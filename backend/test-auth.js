const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('--- STARTING AUTHENTICATION SYSTEM TESTS ---');
  let exitCode = 0;

  const timestamp = Date.now();
  const testUser = {
    name: 'Regular Test User',
    email: `user_${timestamp}@example.com`,
    password: 'password123',
  };

  const adminUser = {
    name: 'Admin Test User',
    email: `admin_${timestamp}@example.com`,
    password: 'adminpassword123',
    role: 'admin',
  };

  let userToken = '';
  let adminToken = '';

  // Helper function to handle fetch calls
  async function makeRequest(path, method, body = null, token = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${BASE_URL}${path}`, options);
      const data = await res.json();
      return { status: res.status, data };
    } catch (err) {
      console.error(`Fetch error on ${path}:`, err.message);
      throw err;
    }
  }

  try {
    // 1. Verify root endpoint
    console.log('\n[TEST 1] GET / (Root API Health Check)');
    const rootRes = await makeRequest('/', 'GET');
    if (rootRes.status === 200 && rootRes.data.message.includes('running')) {
      console.log('✅ Pass: Root API is running');
    } else {
      console.log('❌ Fail:', rootRes);
      exitCode = 1;
    }

    // 2. Register new user
    console.log('\n[TEST 2] POST /api/auth/register (New User)');
    const regRes = await makeRequest('/api/auth/register', 'POST', testUser);
    if (regRes.status === 201 && regRes.data.token && regRes.data.userId && regRes.data.userId.startsWith('sr_')) {
      console.log(`✅ Pass: User registered successfully. UserID: ${regRes.data.userId}`);
      userToken = regRes.data.token;
    } else {
      console.log('❌ Fail:', regRes);
      exitCode = 1;
    }

    // 3. Register duplicate user
    console.log('\n[TEST 3] POST /api/auth/register (Duplicate User)');
    const dupRes = await makeRequest('/api/auth/register', 'POST', testUser);
    if (dupRes.status === 400 && dupRes.data.message.includes('exists')) {
      console.log('✅ Pass: Correctly rejected duplicate registration');
    } else {
      console.log('❌ Fail:', dupRes);
      exitCode = 1;
    }

    // 4. Login user (Success)
    console.log('\n[TEST 4] POST /api/auth/login (Correct Credentials)');
    const loginRes = await makeRequest('/api/auth/login', 'POST', {
      email: testUser.email,
      password: testUser.password,
    });
    if (loginRes.status === 200 && loginRes.data.token && loginRes.data.userId === regRes.data.userId) {
      console.log('✅ Pass: User logged in successfully and returned matching UserID');
      // Verify login token works too
      userToken = loginRes.data.token;
    } else {
      console.log('❌ Fail:', loginRes);
      exitCode = 1;
    }

    // 5. Login user (Fail - wrong password)
    console.log('\n[TEST 5] POST /api/auth/login (Incorrect Credentials)');
    const badLoginRes = await makeRequest('/api/auth/login', 'POST', {
      email: testUser.email,
      password: 'wrong_password',
    });
    if (badLoginRes.status === 401) {
      console.log('✅ Pass: Correctly rejected invalid credentials');
    } else {
      console.log('❌ Fail:', badLoginRes);
      exitCode = 1;
    }

    // 6. Get Profile without token
    console.log('\n[TEST 6] GET /api/auth/profile (Without Token)');
    const getProfileNoToken = await makeRequest('/api/auth/profile', 'GET');
    if (getProfileNoToken.status === 401) {
      console.log('✅ Pass: Correctly blocked unauthorized access');
    } else {
      console.log('❌ Fail:', getProfileNoToken);
      exitCode = 1;
    }

    // 7. Get Profile with token
    console.log('\n[TEST 7] GET /api/auth/profile (With Token)');
    const getProfileRes = await makeRequest('/api/auth/profile', 'GET', null, userToken);
    if (getProfileRes.status === 200 && getProfileRes.data.email === testUser.email && getProfileRes.data.userId === regRes.data.userId) {
      console.log(`✅ Pass: Profile retrieved. Welcome ${getProfileRes.data.name}! UserID: ${getProfileRes.data.userId}`);
    } else {
      console.log('❌ Fail:', getProfileRes);
      exitCode = 1;
    }

    // 8. Update Profile
    console.log('\n[TEST 8] PUT /api/auth/profile (Update Name and Password)');
    const updatedName = 'Updated Regular Test User';
    const updateRes = await makeRequest(
      '/api/auth/profile',
      'PUT',
      { name: updatedName, password: 'newpassword123' },
      userToken
    );
    if (updateRes.status === 200 && updateRes.data.name === updatedName && updateRes.data.userId === regRes.data.userId) {
      console.log('✅ Pass: Profile updated successfully');
      // Save new token from update response
      userToken = updateRes.data.token;

      // Verify login with new password
      console.log('   - Verifying login with updated password...');
      const updatedLoginRes = await makeRequest('/api/auth/login', 'POST', {
        email: testUser.email,
        password: 'newpassword123',
      });
      if (updatedLoginRes.status === 200 && updatedLoginRes.data.userId === regRes.data.userId) {
        console.log('     ✅ Pass: Logged in successfully with new password');
      } else {
        console.log('     ❌ Fail:', updatedLoginRes);
        exitCode = 1;
      }
    } else {
      console.log('❌ Fail:', updateRes);
      exitCode = 1;
    }

    // 9. Access Admin endpoint as normal user
    console.log('\n[TEST 9] GET /api/auth/admin (As Normal User)');
    const adminAccessUserRes = await makeRequest('/api/auth/admin', 'GET', null, userToken);
    if (adminAccessUserRes.status === 403) {
      console.log('✅ Pass: Correctly blocked regular user from admin route');
    } else {
      console.log('❌ Fail:', adminAccessUserRes);
      exitCode = 1;
    }

    // 10. Register Admin user
    console.log('\n[TEST 10] POST /api/auth/register (Admin User)');
    const regAdminRes = await makeRequest('/api/auth/register', 'POST', adminUser);
    if (regAdminRes.status === 201 && regAdminRes.data.role === 'admin') {
      console.log('✅ Pass: Admin user registered successfully');
      adminToken = regAdminRes.data.token;
    } else {
      console.log('❌ Fail:', regAdminRes);
      exitCode = 1;
    }

    // 11. Access Admin endpoint as admin user
    console.log('\n[TEST 11] GET /api/auth/admin (As Admin User)');
    const adminAccessAdminRes = await makeRequest('/api/auth/admin', 'GET', null, adminToken);
    if (adminAccessAdminRes.status === 200 && adminAccessAdminRes.data.message.includes('Admin access granted')) {
      console.log('✅ Pass: Admin access granted successfully');
    } else {
      console.log('❌ Fail:', adminAccessAdminRes);
      exitCode = 1;
    }

  } catch (error) {
    console.error('Test script encountered an error:', error);
    exitCode = 1;
  }

  console.log('\n--- TESTS COMPLETED ---');
  if (exitCode === 0) {
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉');
  } else {
    console.log('🛑 SOME TESTS FAILED. Please check logs.');
  }

  process.exit(exitCode);
}

// Wait for a small buffer, then run
setTimeout(runTests, 1000);
