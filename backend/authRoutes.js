const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleLogin,
  getUserProfile,
  updateUserProfile,
} = require('./authController');
const { emailCard } = require('./emailController');
const { protect, admin } = require('./authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/email-card', emailCard);

// Protected user routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin-only test route
router.get('/admin', protect, admin, (req, res) => {
  res.json({
    message: 'Admin access granted. Welcome to the admin panel!',
    admin: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

module.exports = router;
