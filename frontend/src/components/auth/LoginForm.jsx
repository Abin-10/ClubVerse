import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';

export default function LoginForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectNotice = location.state?.message;

  const [view, setView] = useState(() => location.state?.view || 'login'); // 'login' | 'forgot' | 'change_password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // OTP Password Reset States
  const [resetStep, setResetStep] = useState('request'); // 'request' | 'verify'
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [resetNewPass, setResetNewPass] = useState('');
  const [resetConfirmPass, setResetConfirmPass] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pendingUser, setPendingUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      setLoading(false);

      // If user must set a new password (admin-created Coach/Player)
      if (data.user.mustChangePassword) {
        setPendingUser(data.user);
        // Store user temporarily so role is available after password change
        localStorage.setItem('clubverse_user', JSON.stringify(data.user));
        setView('change_password');
        return;
      }

      setSuccess(true);
      localStorage.setItem('clubverse_user', JSON.stringify(data.user));

      setTimeout(() => {
        if (data.user && data.user.role === 'Admin') {
          navigate('/admin');
        } else if (data.user && data.user.role === 'Player') {
          navigate('/player');
        } else if (data.user && data.user.role === 'Coach') {
          navigate('/coach');
        } else if (data.user && data.user.role === 'Fan') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
        window.location.reload();
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to connect to database server. Please check your network or server status.');
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: pendingUser.email || email,
          oldPassword: password,
          newPassword: newPassword
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Password update failed.');
      }

      setLoading(false);
      setSuccess(true);

      // Merge saved user info with the returned data (role may not be in data.user yet)
      const savedUser = JSON.parse(localStorage.getItem('clubverse_user') || '{}');
      const updatedUser = { ...savedUser, ...data.user, mustChangePassword: false };
      localStorage.setItem('clubverse_user', JSON.stringify(updatedUser));

      setTimeout(() => {
        if (updatedUser.role === 'Admin') {
          navigate('/admin');
        } else if (updatedUser.role === 'Player') {
          navigate('/player');
        } else if (updatedUser.role === 'Coach') {
          navigate('/coach');
        } else if (updatedUser.role === 'Fan') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
        window.location.reload();
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to update password. Please try again.');
    }
  };

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '979549155500-2l5d58h03q0dmppdp8rbu7kod79gs9fu.apps.googleusercontent.com';

  const ensureGoogleSDK = () => {
    return new Promise((resolve) => {
      if (window.google?.accounts) {
        resolve(window.google);
        return;
      }
      const existingScript = document.getElementById('google-gsi-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'google-gsi-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => resolve(window.google);
        script.onerror = () => resolve(null);
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener('load', () => resolve(window.google));
        setTimeout(() => resolve(window.google), 1500);
      }
    });
  };

  const handleGoogleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      setError('Google Sign-In was cancelled or failed.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Google authentication failed.');
      }

      setLoading(false);
      setSuccess(true);
      localStorage.setItem('clubverse_user', JSON.stringify(data.user));

                setTimeout(() => {
                  if (data.user && data.user.role === 'Admin') {
                    navigate('/admin');
                  } else if (data.user && data.user.role === 'Player') {
                    navigate('/player');
                  } else if (data.user && data.user.role === 'Coach') {
                    navigate('/coach');
                  } else if (data.user && data.user.role === 'Fan') {
                    navigate('/dashboard');
                  } else {
                    navigate('/');
                  }
                  window.location.reload();
                }, 1000);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Google login failed. Please ensure the backend server is running.');
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);

    const google = await ensureGoogleSDK();
    setLoading(false);
    
    // Official Google OAuth2 Token Client Popup Flow
    if (google?.accounts?.oauth2) {
      try {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              setError(`Google Sign-In Error: ${tokenResponse.error_description || tokenResponse.error}`);
              return;
            }
            if (tokenResponse.access_token) {
              setLoading(true);
              try {
                // Fetch authentic Google account profile
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const googleProfile = await userInfoRes.json();

                if (!googleProfile.email) {
                  throw new Error('Could not retrieve email address from your Google account.');
                }

                // Register/Authenticate real Google user in MongoDB
                const res = await fetch('http://localhost:5000/api/auth/google', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: googleProfile.name || googleProfile.given_name || 'Google User',
                    email: googleProfile.email,
                  }),
                });

                const data = await res.json();
                if (!res.ok) {
                  throw new Error(data.message || 'Google authentication failed.');
                }

                setLoading(false);
                setSuccess(true);
                localStorage.setItem('clubverse_user', JSON.stringify(data.user));

                setTimeout(() => {
                  if (data.user && data.user.role === 'Admin') {
                    navigate('/admin');
                  } else if (data.user && data.user.role === 'Player') {
                    navigate('/player');
                  } else if (data.user && data.user.role === 'Coach') {
                    navigate('/coach');
                  } else if (data.user && data.user.role === 'Fan') {
                    navigate('/dashboard');
                  } else {
                    navigate('/');
                  }
                  window.location.reload();
                }, 1000);
              } catch (err) {
                setLoading(false);
                setError(err.message || 'Failed to authenticate Google user with backend database.');
              }
            }
          },
        });
        client.requestAccessToken();
      } catch (err) {
        setError('Failed to launch Google Sign-In popup. Please check your Google OAuth origins configuration.');
      }
    } else if (google?.accounts?.id) {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse,
      });
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          setError('Google Sign-In prompt blocked. Please ensure http://localhost:5173 is added under Authorized JavaScript Origins in your Google Cloud Console.');
        }
      });
    } else {
      setError('Google Sign-In SDK is loading. Please check your internet connection or try again.');
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!resetEmail.includes('@') || !resetEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setOtpError('');
    setOtpSuccess('');
    setResetLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });

      const data = await res.json();
      setResetLoading(false);

      if (res.ok) {
        setOtpSuccess(data.message || `OTP code sent to ${resetEmail}. Check your email inbox!`);
        setEnteredOtp('');
        setResetStep('verify');
      } else {
        setError(data.message || 'Failed to send OTP code to email.');
      }
    } catch (err) {
      setResetLoading(false);
      setError('Backend server connection error. Please ensure the server is running.');
    }
  };

  const handleVerifyOtpAndResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setOtpError('');
    setOtpSuccess('');

    if (!enteredOtp || enteredOtp.length < 6) {
      setOtpError('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    if (resetNewPass.length < 6) {
      setOtpError('New password must be at least 6 characters long.');
      return;
    }

    if (resetNewPass !== resetConfirmPass) {
      setOtpError('New password and confirm password do not match.');
      return;
    }

    setResetLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail,
          otp: enteredOtp,
          newPassword: resetNewPass
        })
      });

      const data = await res.json();
      setResetLoading(false);

      if (res.ok) {
        setOtpSuccess('OTP verified & password updated successfully in MongoDB!');
        setTimeout(() => {
          setEmail(resetEmail);
          setPassword(resetNewPass);
          setView('login');
          setResetStep('request');
          setOtpSuccess('');
        }, 1500);
      } else {
        setOtpError(data.message || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      setResetLoading(false);
      setOtpError('Backend server connection error. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-4xl bg-[#FFFDF8] rounded-[2.5rem] border border-[#E4E1D8] shadow-warm-lg overflow-hidden grid grid-cols-1 md:grid-cols-12 relative font-sans">
      
      {/* Left Column: Form Panel */}
      <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-between z-10">
        
        {view === 'login' ? (
          <div>
            {/* Header Title */}
            <div className="mb-6 space-y-1">
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#20221F] font-serif tracking-tight">
                Log in
              </h2>
              <p className="text-xs text-[#6F716B] font-medium">
                Access your ClubVerse fan portal, matchday passes, and club hub.
              </p>
            </div>
            {/* Redirect Info Notice */}
            {redirectNotice && !error && !success && (
              <div className="mb-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{redirectNotice}</span>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="mb-5 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="mb-5 p-3 rounded-2xl bg-[#7A8B5A]/15 border border-[#7A8B5A]/30 text-[#7A8B5A] text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#7A8B5A]" />
                <span>Authentication successful! Redirecting to home...</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Login / Email Input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  Login, email or phone number
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-3 focus:outline-none focus:border-[#7A8B5A] focus:bg-[#FFFDF8] font-medium transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between ml-1">
                  <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setError('');
                      setView('forgot');
                    }}
                    className="text-[11px] font-bold text-[#7A8B5A] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-3 pr-10 focus:outline-none focus:border-[#7A8B5A] focus:bg-[#FFFDF8] font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6F716B] hover:text-[#20221F]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Log in Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-3.5 rounded-full bg-[#2E332B] hover:bg-[#7A8B5A] text-white font-bold text-xs shadow-warm-sm transition-all duration-300 mt-2"
              >
                {loading ? 'Authenticating...' : 'Log in'}
              </button>
            </form>

            {/* Social Divider */}
            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E4E1D8]"></div>
              </div>
              <span className="relative bg-[#FFFDF8] px-3 text-[11px] font-semibold text-[#6F716B]">
                or continue with Google
              </span>
            </div>

            {/* Single Google Login Button */}
            <div>
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading || success}
                className="w-full py-3 px-4 rounded-full bg-[#F7F5EF] border border-[#E4E1D8] hover:border-[#7A8B5A] hover:bg-[#EFEEE8] transition-all duration-200 shadow-warm-sm flex items-center justify-center gap-3 font-bold text-xs text-[#20221F] group"
              >
                <svg className="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          </div>
        ) : view === 'change_password' ? (
          /* Change Password View for Player/Coach First-Time Login */
          <div>
            <div className="mb-6 space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-[#7A8B5A]/10 border border-[#7A8B5A]/20 flex items-center justify-center text-[#7A8B5A] mb-3">
                <KeyRound className="w-5 h-5" />
              </div>
              <h2 className="text-3xl font-semibold text-[#20221F] font-serif tracking-tight">
                Set New Password
              </h2>
              <p className="text-xs text-[#6F716B] font-medium">
                Welcome, <strong>{pendingUser?.name}</strong> ({pendingUser?.role})! Please replace your initial Date of Birth (DOB) password with a new secure password.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-5 p-3 rounded-2xl bg-[#7A8B5A]/15 border border-[#7A8B5A]/30 text-[#7A8B5A] text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#7A8B5A]" />
                <span>Password updated successfully! Redirecting to home...</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-3 focus:outline-none focus:border-[#7A8B5A] focus:bg-[#FFFDF8] font-medium transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-3 focus:outline-none focus:border-[#7A8B5A] focus:bg-[#FFFDF8] font-medium transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-3.5 rounded-full bg-[#7A8B5A] hover:bg-[#627146] text-white font-bold text-xs shadow-warm-sm transition-all duration-300 mt-2"
              >
                {loading ? 'Updating Password...' : 'Update Password & Access Portal'}
              </button>
            </form>
          </div>
        ) : (
          /* Forgot Password OTP View */
          <div>
            <div className="mb-6 space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-[#7A8B5A]/10 border border-[#7A8B5A]/20 flex items-center justify-center text-[#7A8B5A] mb-3">
                <KeyRound className="w-5 h-5" />
              </div>
              <h2 className="text-3xl font-semibold text-[#20221F] font-serif tracking-tight">
                {resetStep === 'request' ? 'Reset Password' : 'Verify OTP & Reset'}
              </h2>
              <p className="text-xs text-[#6F716B] font-medium">
                {resetStep === 'request' 
                  ? 'Enter your account email to receive your 6-digit OTP verification code.'
                  : `Enter the 6-digit OTP code sent to ${resetEmail} and set your new password.`}
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {otpError && (
              <div className="mb-5 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{otpError}</span>
              </div>
            )}

            {otpSuccess && (
              <div className="mb-5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{otpSuccess}</span>
              </div>
            )}

            {resetStep === 'request' ? (
              /* STEP 1: Enter Email to Request OTP */
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-3 focus:outline-none focus:border-[#7A8B5A] focus:bg-[#FFFDF8] font-medium transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3.5 rounded-full bg-[#7A8B5A] hover:bg-[#627146] text-white font-bold text-xs shadow-warm-sm transition-all duration-300"
                >
                  {resetLoading ? 'Generating OTP...' : 'Send OTP Verification Code'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    setError('');
                    setResetStep('request');
                  }}
                  className="w-full py-2.5 text-xs font-bold text-[#6F716B] hover:text-[#20221F] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#7A8B5A]" />
                  <span>Back to Log in</span>
                </button>
              </form>
            ) : (
              /* STEP 2: Enter OTP & New Password */
              <form onSubmit={handleVerifyOtpAndResetPassword} className="space-y-4">
                
                {/* Email Sent Notice Banner */}
                <div className="p-4 rounded-2xl bg-[#7A8B5A]/15 border border-[#7A8B5A]/30 text-[#20221F] space-y-1 shadow-warm-sm">
                  <div className="flex items-center gap-2 text-[#7A8B5A] font-bold text-xs">
                    <Mail className="w-4 h-4 text-[#7A8B5A]" />
                    <span>OTP Sent to Your Email</span>
                  </div>
                  <p className="text-[11px] text-[#6F716B] leading-relaxed">
                    We sent a 6-digit OTP verification code to <strong className="text-[#20221F]">{resetEmail}</strong>. Please check your email inbox (and spam folder).
                  </p>
                </div>

                {/* OTP Code Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    className="w-full bg-[#F7F5EF] text-[#20221F] text-sm font-mono tracking-widest rounded-full border border-[#E4E1D8] px-4 py-3 focus:outline-none focus:border-[#7A8B5A] focus:bg-[#FFFDF8] font-bold transition-all text-center"
                  />
                </div>

                {/* New Password Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={resetNewPass}
                    onChange={(e) => setResetNewPass(e.target.value)}
                    className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-3 focus:outline-none focus:border-[#7A8B5A] focus:bg-[#FFFDF8] font-medium transition-all"
                  />
                </div>

                {/* Confirm New Password Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={resetConfirmPass}
                    onChange={(e) => setResetConfirmPass(e.target.value)}
                    className="w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border border-[#E4E1D8] px-4 py-3 focus:outline-none focus:border-[#7A8B5A] focus:bg-[#FFFDF8] font-medium transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-3.5 rounded-full bg-[#7A8B5A] hover:bg-[#627146] text-white font-bold text-xs shadow-warm-sm transition-all duration-300 mt-2"
                >
                  {resetLoading ? 'Verifying OTP & Updating...' : 'Verify OTP & Reset Password'}
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    className="text-xs font-bold text-[#7A8B5A] hover:underline"
                  >
                    Resend New OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setResetStep('request');
                    }}
                    className="text-xs font-bold text-[#6F716B] hover:text-[#20221F]"
                  >
                    Change Email
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Footer Navigation Links */}
        <div className="mt-8 pt-4 border-t border-[#E4E1D8] text-center space-y-2">
          {view === 'login' && (
            <button
              type="button"
              onClick={() => {
                setResetEmail(email);
                setError('');
                setView('forgot');
              }}
              className="text-[11px] font-semibold text-[#7A8B5A] hover:underline block mx-auto"
            >
              Forgot login or password?
            </button>
          )}

          <p className="text-[11px] font-medium text-[#6F716B]">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#20221F] hover:underline">
              Create account
            </Link>
          </p>
        </div>

      </div>

      {/* Right Column: Exact Uploaded Messi "undisputed." Image Panel */}
      <div className="md:col-span-5 relative overflow-hidden hidden md:block bg-[#0e100d]">
        
        {/* Organic Paper-Cut Curved Border Cutout Transition on the Left */}
        <div className="absolute top-0 bottom-0 left-0 w-16 pointer-events-none z-20">
          <svg className="w-full h-full" viewBox="0 0 100 500" preserveAspectRatio="none" fill="none">
            <path d="M0 0 C 85 130, 15 320, 100 500 L 0 500 Z" fill="#FFFDF8" />
          </svg>
        </div>

        {/* Exact User Image */}
        <img 
          src="/messi-undisputed.jpg" 
          alt="Messi Undisputed Poster" 
          className="w-full h-full object-cover object-top filter brightness-95 contrast-105"
        />

      </div>

    </div>
  );
}
