'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ShieldCheck, Mail, Lock, User, Check, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

interface Particle {
  id: number;
  size: number;
  opacity: number;
  left: number;
  top: number;
  dx: number;
  dy: number;
  dur: number;
  delay: number;
  isPulse: boolean;
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '';
  const { login, signup, loginWithGoogle, user, isAuthenticated } = useAuth();

  const [activeCard, setActiveCard] = useState<'login' | 'signup'>('login');

  // Input states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginPwVisible, setLoginPwVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupPwVisible, setSignupPwVisible] = useState(false);
  const [signupConfirmVisible, setSignupConfirmVisible] = useState(false);

  // Auth states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (redirectTo) {
        router.push(redirectTo);
      } else if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router, redirectTo]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    const result = await login(loginEmail, loginPassword);
    setIsSubmitting(false);
    if (!result.success) {
      setAuthError(result.error || 'Login failed');
    }
    // Redirect happens via useEffect above
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (signupPassword !== signupConfirm) {
      setAuthError('Passwords do not match');
      return;
    }
    if (signupPassword.length < 6) {
      setAuthError('Password must be at least 6 characters');
      return;
    }
    setIsSubmitting(true);
    const result = await signup(signupName, signupEmail, signupPassword);
    setIsSubmitting(false);
    if (!result.success) {
      setAuthError(result.error || 'Registration failed');
    }
    // Redirect happens via useEffect above
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setIsSubmitting(true);
    const result = await loginWithGoogle();
    setIsSubmitting(false);
    if (!result.success) {
      setAuthError(result.error || 'Google Sign-in failed');
    }
  };

  // Password strength states
  const [strengthScore, setStrengthScore] = useState(0);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);

  // Mouse move glow state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);

  // Generated particles state
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate background particles on mount
    const list: Particle[] = [];
    for (let i = 0; i < 24; i++) {
      list.push({
        id: i,
        size: 2 + Math.random() * 4,
        opacity: 0.18 + Math.random() * 0.35,
        left: Math.random() * 100,
        top: Math.random() * 100,
        dx: (Math.random() - 0.5) * 80,
        dy: (Math.random() - 0.5) * 80,
        dur: 6 + Math.random() * 10,
        delay: Math.random() * 3,
        isPulse: Math.random() > 0.55,
      });
    }
    setParticles(list);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (stageRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Watch password strength
  useEffect(() => {
    if (!signupPassword) {
      setStrengthScore(0);
      return;
    }
    let score = 0;
    if (signupPassword.length >= 8) score++;
    if (/[A-Z]/.test(signupPassword)) score++;
    if (/[0-9]/.test(signupPassword)) score++;
    if (/[^A-Za-z0-9]/.test(signupPassword)) score++;
    setStrengthScore(signupPassword.length === 0 ? 0 : Math.max(1, score));
  }, [signupPassword]);

  // Watch confirmation password matching
  useEffect(() => {
    if (!signupConfirm) {
      setPasswordsMatch(null);
      return;
    }
    setPasswordsMatch(signupConfirm === signupPassword);
  }, [signupConfirm, signupPassword]);

  const strengthLevels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#E53935', '#FF8A65', '#FFB300', '#34B27B'];

  return (
    <div
      ref={stageRef}
      onMouseMove={handleMouseMove}
      className="stage min-h-screen bg-[#F8F6F2] text-[#2A2520] overflow-hidden w-screen h-screen relative flex items-center justify-center font-sans select-none"
    >
      {/* Background Blobs */}
      <div className="absolute inset-0 bg-[#F8F6F2] pointer-events-none z-0" />
      
      {/* Animated blurry blobs */}
      <div className="blob blob-coral absolute w-[720px] h-[720px] right-[-180px] top-[8%] rounded-full opacity-65 pointer-events-none filter blur-[80px]" style={{
        background: 'radial-gradient(circle at 35% 35%, rgba(255,98,72,0.35), rgba(255,98,72,0) 70%)',
      }} />
      <div className="blob blob-peach absolute w-[480px] h-[480px] left-[28%] top-[-160px] rounded-full opacity-55 pointer-events-none filter blur-[60px]" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(255,176,136,0.3), rgba(255,176,136,0) 70%)',
      }} />
      <div className="blob blob-beige-1 absolute w-[320px] h-[320px] left-[-100px] bottom-[-100px] rounded-full opacity-65 pointer-events-none filter blur-[50px]" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(226,212,190,0.45), rgba(226,212,190,0) 70%)',
      }} />
      <div className="blob blob-beige-2 absolute w-[260px] h-[260px] right-[4%] bottom-[-60px] rounded-full opacity-45 pointer-events-none filter blur-[40px]" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(91,141,239,0.12), rgba(91,141,239,0) 70%)',
      }} />

      {/* Mouse follow glow */}
      <div
        className="mouse-glow absolute w-[480px] h-[480px] rounded-full pointer-events-none z-10 transition-all duration-[400ms] ease-out filter blur-[30px]"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          background: 'radial-gradient(circle, rgba(255,138,101,0.12) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Brand logo top-left */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-3 z-50 group select-none">
        <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-br from-[#FF6248] to-[#FFB088] flex items-center justify-center shadow-md shadow-[#FF6248]/15">
          <span className="text-white font-serif font-bold text-base">C</span>
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-bold text-base text-[#2A2520] tracking-wide">CardCraft</span>
          <span className="text-[9px] font-semibold text-[#6B6358] uppercase tracking-wider mt-0.5">Digital Identity</span>
        </div>
      </Link>

      {/* Main Container */}
      <div className="w-full max-w-5xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-20">
        
        {/* Left Side: Login / Register card container (5 columns) */}
        <div className="lg:col-span-6 flex justify-center">
          
          <div className="w-full max-w-[420px]">
            {/* LOGIN CARD */}
            {activeCard === 'login' ? (
              <div className="bg-white/40 border border-white/60 backdrop-blur-2xl rounded-[32px] p-8 shadow-xl shadow-[#FF6248]/10 animate-in zoom-in-95 duration-350 space-y-6">
                <div className="text-center space-y-1.5">
                  <h2 className="text-3xl font-bold font-serif text-[#2A2520] tracking-tight">Welcome back</h2>
                  <p className="text-xs text-[#6B6358] font-medium">Please enter your details to access your dashboard.</p>
                </div>

                {authError && activeCard === 'login' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <span className="text-red-500">✕</span> {authError}
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleLogin}>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#6B6358] uppercase tracking-wider block" htmlFor="login-email">Email Address</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-4 h-4.5 w-4.5 text-[#9C9488]" />
                      <input
                        id="login-email"
                        type="email"
                        placeholder="you@company.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full h-11 bg-white/90 border border-[#2A2520]/10 rounded-xl pl-12 pr-4 text-xs font-semibold focus:ring-2 focus:ring-[#FF6248]/20 focus:border-[#FF6248] outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#6B6358] uppercase tracking-wider block" htmlFor="login-pass">Password</label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-4 h-4.5 w-4.5 text-[#9C9488]" />
                      <input
                        id="login-pass"
                        type={loginPwVisible ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full h-11 bg-white/90 border border-[#2A2520]/10 rounded-xl pl-12 pr-12 text-xs font-semibold focus:ring-2 focus:ring-[#FF6248]/20 focus:border-[#FF6248] outline-none transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setLoginPwVisible(!loginPwVisible)}
                        className="absolute right-4 text-[#9C9488] hover:text-[#6B6358]"
                      >
                        {loginPwVisible ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-[#6B6358] font-semibold">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 accent-[#FF6248] rounded border-gray-300"
                      />
                      Remember me
                    </label>
                    <Link href="#" className="font-bold text-[#FF6248] hover:underline">Forgot password?</Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-[#FF6248] to-[#FF8A65] text-white font-bold text-sm tracking-wide shadow-md shadow-[#FF6248]/20 hover:shadow-lg hover:shadow-[#FF6248]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : 'Sign In'}
                  </button>
                </form>

                <div className="relative flex items-center justify-center my-4">
                  <div className="absolute w-full h-[1px] bg-[#2A2520]/10" />
                  <span className="relative bg-[#F8F6F2]/70 px-3 text-[10px] uppercase tracking-wider font-semibold text-[#9C9488]">or continue with</span>
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  className="w-full h-11 rounded-xl bg-white border border-[#2A2520]/10 flex items-center justify-center gap-3 font-semibold text-xs text-[#2A2520] shadow-sm hover:border-[#2A2520]/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.47 14.97 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.86 3C6.27 7.74 8.9 5.04 12 5.04z" />
                    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.58v2.98h3.89c2.28-2.1 3.56-5.19 3.56-8.71z" />
                    <path fill="#FBBC05" d="M5.36 14.5c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28L1.5 6.94C.54 8.86 0 11.01 0 13.25c0 2.24.54 4.39 1.5 6.31l3.86-3.06z" />
                    <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.89-2.98c-1.1.74-2.5 1.18-4.07 1.18-3.1 0-5.73-2.7-6.64-5.46L1.5 15.89C3.4 19.74 7.35 23 12 23z" />
                  </svg>
                  Sign in with Google
                </button>

                <p className="text-center text-xs text-[#6B6358] font-semibold pt-2 select-none">
                  Don't have an account?
                  <button
                    onClick={() => setActiveCard('signup')}
                    className="text-[#FF6248] font-bold ml-1 hover:underline cursor-pointer"
                  >
                    Get started free
                  </button>
                </p>
              </div>
            ) : (
              /* SIGNUP CARD */
              <div className="bg-white/40 border border-white/60 backdrop-blur-2xl rounded-[32px] p-8 shadow-xl shadow-[#FF6248]/10 animate-in zoom-in-95 duration-350 space-y-5">
                <div className="text-center space-y-1.5">
                  <h2 className="text-3xl font-bold font-serif text-[#2A2520] tracking-tight">Create account</h2>
                  <p className="text-xs text-[#6B6358] font-medium">Build your premium digital business identity.</p>
                </div>

                {authError && activeCard === 'signup' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <span className="text-red-500">✕</span> {authError}
                  </div>
                )}

                <form className="space-y-3.5" onSubmit={handleSignup}>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#6B6358] uppercase tracking-wider block" htmlFor="signup-name">Full Name</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-4 h-4.5 w-4.5 text-[#9C9488]" />
                      <input
                        id="signup-name"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full h-10.5 bg-white/90 border border-[#2A2520]/10 rounded-xl pl-12 pr-4 text-xs font-semibold focus:ring-2 focus:ring-[#FF6248]/20 focus:border-[#FF6248] outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#6B6358] uppercase tracking-wider block" htmlFor="signup-email">Email Address</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-4 h-4.5 w-4.5 text-[#9C9488]" />
                      <input
                        id="signup-email"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full h-10.5 bg-white/90 border border-[#2A2520]/10 rounded-xl pl-12 pr-4 text-xs font-semibold focus:ring-2 focus:ring-[#FF6248]/20 focus:border-[#FF6248] outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#6B6358] uppercase tracking-wider block" htmlFor="signup-pass">Password</label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-4 h-4.5 w-4.5 text-[#9C9488]" />
                      <input
                        id="signup-pass"
                        type={signupPwVisible ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-10.5 bg-white/90 border border-[#2A2520]/10 rounded-xl pl-12 pr-12 text-xs font-semibold focus:ring-2 focus:ring-[#FF6248]/20 focus:border-[#FF6248] outline-none transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setSignupPwVisible(!signupPwVisible)}
                        className="absolute right-4 text-[#9C9488]"
                      >
                        {signupPwVisible ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                    {/* Password Strength Meter */}
                    {signupPassword && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex gap-1 h-[3.5px]">
                          {[1, 2, 3, 4].map((idx) => (
                            <div
                              key={idx}
                              className="flex-1 rounded transition-colors duration-300"
                              style={{
                                background: idx <= strengthScore ? strengthColors[strengthScore] : 'rgba(42,37,32,0.1)',
                              }}
                            />
                          ))}
                        </div>
                        <div className="text-[10px] font-bold text-[#9C9488]">
                          Strength: <span style={{ color: strengthColors[strengthScore] }}>{strengthLevels[strengthScore]}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#6B6358] uppercase tracking-wider block" htmlFor="signup-confirm">Confirm Password</label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-4 h-4.5 w-4.5 text-[#9C9488]" />
                      <input
                        id="signup-confirm"
                        type={signupConfirmVisible ? 'text' : 'password'}
                        value={signupConfirm}
                        onChange={(e) => setSignupConfirm(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-10.5 bg-white/90 border border-[#2A2520]/10 rounded-xl pl-12 pr-12 text-xs font-semibold focus:ring-2 focus:ring-[#FF6248]/20 focus:border-[#FF6248] outline-none transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setSignupConfirmVisible(!signupConfirmVisible)}
                        className="absolute right-4 text-[#9C9488]"
                      >
                        {signupConfirmVisible ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                    {passwordsMatch !== null && (
                      <div className={`text-[10px] font-bold mt-1 ${passwordsMatch ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-[#FF6248] to-[#FF8A65] text-white font-bold text-sm tracking-wide shadow-md shadow-[#FF6248]/20 hover:shadow-lg hover:shadow-[#FF6248]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</> : 'Sign Up'}
                  </button>
                </form>

                <p className="text-center text-xs text-[#6B6358] font-semibold pt-2 select-none">
                  Already have an account?
                  <button
                    onClick={() => setActiveCard('login')}
                    className="text-[#FF6248] font-bold ml-1 hover:underline cursor-pointer"
                  >
                    Log in
                  </button>
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Floating Interactive Mockups (6 columns) */}
        <div className="lg:col-span-6 hidden lg:flex justify-center relative min-h-[580px] pointer-events-none">
          
          {/* Simulated Floating Phone */}
          <div className="absolute w-[260px] h-[520px] right-[10%] top-[8%] rounded-[42px] bg-gradient-to-b from-[#2A2520] to-[#16130F] p-2.5 shadow-2xl border-6 border-[#0C0607] shadow-[#2A2520]/30 transform rotate-[10deg] animate-pulse duration-[7000ms]">
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-[#0C0607] rounded-full z-20" />
            <div className="w-full h-full rounded-[32px] bg-[#FEFFFA] overflow-hidden flex flex-col justify-between p-4 relative">
              <div className="h-[96px] bg-gradient-to-br from-[#FF6248] to-[#FF8A65] absolute top-0 left-0 right-0" />
              <div className="w-14 h-14 rounded-full border-4 border-white bg-[#F2EEE6] absolute top-[68px] left-5 flex items-center justify-center overflow-hidden">
                <span className="font-serif font-bold text-xl text-[#FF6248]">C</span>
              </div>

              <div className="h-16 shrink-0" />

              <div className="space-y-1">
                <div className="text-base font-bold text-[#2A2520] font-serif">{signupName || 'Your Name'}</div>
                <div className="text-[10px] text-[#6B6358] font-semibold">Creative Director · CardCraft</div>
              </div>

              <div className="bg-[#FF6248]/5 border border-[#FF6248]/10 rounded-xl p-3 flex items-center justify-between mt-4">
                <div className="min-w-0">
                  <div className="text-[9.5px] font-bold text-[#2A2520] truncate">CardCraft</div>
                  <div className="text-[8.5px] text-[#6B6358] font-semibold">Scan to save</div>
                </div>
                <div className="w-8 h-8 bg-white border border-[#E2D9D0] rounded p-0.5 shadow-sm flex items-center justify-center">
                  <div className="w-6 h-6 bg-repeating-conic-gradient" style={{
                    background: 'repeating-conic-gradient(#2A2520 0% 25%, #FEFFFA 0% 50%) 0 0/5px 5px'
                  }} />
                </div>
              </div>

              <div className="flex gap-2 mt-auto">
                {['Call', 'Email', 'Links'].map((l) => (
                  <div key={l} className="bg-[#FF6248]/5 text-[#FF6248] text-[8.5px] font-bold py-1.5 rounded-full flex-1 text-center border border-[#FF6248]/10">
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating QR Card */}
          <div className="absolute left-[8%] top-[15%] bg-white border border-[#E2D9D0] rounded-2xl p-4 shadow-xl flex flex-col items-center gap-3 z-30 transform -rotate-[5deg] w-28">
            <span className="text-[8px] font-bold tracking-wider text-[#FF6248]">SCAN TO CONNECT</span>
            <div className="w-16 h-16 bg-white border border-[#E2D9D0] rounded-md p-1">
              <svg viewBox="0 0 21 21" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <rect width="21" height="21" fill="white" />
                <rect x="1" y="1" width="7" height="7" rx="0.8" fill="#1C1410" />
                <rect x="2" y="2" width="5" height="5" rx="0.5" fill="white" />
                <rect x="3" y="3" width="3" height="3" fill="#1C1410" />
              </svg>
            </div>
          </div>

          {/* Floating NFC Card */}
          <div className="absolute left-[15%] bottom-[12%] bg-gradient-to-br from-[#FF6248] to-[#FF8A65] rounded-xl p-3 shadow-lg flex items-center gap-2.5 z-30 transform rotate-[8deg] text-white">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold font-serif">C</div>
            <span className="text-[9.5px] font-bold uppercase tracking-wider">NFC Tap Active</span>
          </div>

        </div>

      </div>

      {/* Floating background particles */}
      <div className="particles absolute inset-0 z-0 pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className={`particle absolute rounded-full bg-[#FF6248] opacity-0 ${
              p.isPulse ? 'animate-pulse' : ''
            }`}
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              top: `${p.top}%`,
              animationDuration: `${p.isPulse ? 3 + Math.random() * 3 : p.dur}s`,
              animationDelay: `${p.delay}s`,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-[#FF6248] animate-spin" />
          <span className="text-sm font-semibold text-[#6B6358]">Loading...</span>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

