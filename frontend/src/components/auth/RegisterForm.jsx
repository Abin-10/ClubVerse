import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck, X } from 'lucide-react';
import { isValidEmail } from '../../utils/validators';

// Password strength rules (Exact same validation as Player/Coach Setup Password)
const RULES = [
  { id: 'length',  label: 'At least 8 characters',           test: (p) => p.length >= 8 },
  { id: 'upper',   label: 'At least one uppercase letter (A–Z)', test: (p) => /[A-Z]/.test(p) },
  { id: 'lower',   label: 'At least one lowercase letter (a–z)', test: (p) => /[a-z]/.test(p) },
  { id: 'number',  label: 'At least one number (0–9)',        test: (p) => /[0-9]/.test(p) },
  { id: 'special', label: 'At least one special character (!@#$…)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };
  const passed = RULES.filter((r) => r.test(password)).length;
  if (passed === 0) return { score: 0, label: '', color: '' };
  if (passed <= 2)  return { score: 1, label: 'Weak',      color: '#EF4444' };
  if (passed === 3) return { score: 2, label: 'Fair',      color: '#F59E0B' };
  if (passed === 4) return { score: 3, label: 'Strong',    color: '#7A8B5A' };
  return               { score: 4, label: 'Very Strong', color: '#16A34A' };
}

export default function RegisterForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // Field-level error and touched states
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password calculations matching SetupPasswordPage
  const strength = useMemo(() => getStrength(password), [password]);
  const ruleResults = useMemo(() => RULES.map((r) => ({ ...r, passed: r.test(password) })), [password]);
  const allRulesPassed = useMemo(() => ruleResults.every((r) => r.passed), [ruleResults]);
  const passwordsMatch = useMemo(() => password !== '' && password === confirmPassword, [password, confirmPassword]);
  const confirmMismatch = useMemo(() => touched.confirmPassword && confirmPassword !== '' && password !== confirmPassword, [touched.confirmPassword, confirmPassword, password]);

  // Helper validation logic for individual fields
  const validateField = (name, value, allValues = {}) => {
    let err = '';
    const currentPass = allValues.password !== undefined ? allValues.password : password;
    const currentAgree = allValues.agreeTerms !== undefined ? allValues.agreeTerms : agreeTerms;

    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          err = 'Full name is required.';
        } else if (value.trim().length < 2) {
          err = 'Full name must be at least 2 characters long.';
        } else if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
          err = 'Full name should only contain letters and spaces.';
        }
        break;

      case 'email':
        if (!value.trim()) {
          err = 'Email address is required.';
        } else if (!isValidEmail(value.trim())) {
          err = 'Please enter a valid email address (e.g. alex@example.com).';
        }
        break;

      case 'password':
        if (!value) {
          err = 'Password is required.';
        } else if (!RULES.every(r => r.test(value))) {
          err = 'Password must satisfy all security rules below.';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          err = 'Please confirm your password.';
        } else if (value !== currentPass) {
          err = 'Passwords do not match.';
        }
        break;

      case 'agreeTerms':
        if (!currentAgree) {
          err = 'You must accept the Terms of Service & Privacy Policy.';
        }
        break;

      default:
        break;
    }
    return err;
  };

  // Validate entire form and return error map
  const validateForm = () => {
    const errors = {
      fullName: validateField('fullName', fullName),
      email: validateField('email', email),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword, { password }),
      agreeTerms: validateField('agreeTerms', agreeTerms, { agreeTerms }),
    };

    // Filter empty errors
    const activeErrors = {};
    Object.keys(errors).forEach((key) => {
      if (errors[key]) {
        activeErrors[key] = errors[key];
      }
    });

    return activeErrors;
  };

  // Field change handler with live error re-validation
  const handleFieldChange = (field, value) => {
    if (field === 'fullName') setFullName(value);
    if (field === 'email') setEmail(value);
    if (field === 'password') {
      setPassword(value);
      // Re-validate confirm password if it's already touched
      if (touched.confirmPassword && confirmPassword) {
        const confirmErr = validateField('confirmPassword', confirmPassword, { password: value });
        setFieldErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
      }
    }
    if (field === 'confirmPassword') setConfirmPassword(value);
    if (field === 'agreeTerms') setAgreeTerms(value);

    // Revalidate modified field if it was touched
    if (touched[field]) {
      const err = validateField(field, value, {
        password: field === 'password' ? value : password,
        agreeTerms: field === 'agreeTerms' ? value : agreeTerms,
      });
      setFieldErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  // Blur handler to mark field as touched and validate
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = 
      field === 'fullName' ? fullName :
      field === 'email' ? email :
      field === 'password' ? password :
      field === 'confirmPassword' ? confirmPassword :
      field === 'agreeTerms' ? agreeTerms : '';
      
    const err = validateField(field, value);
    setFieldErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Mark all fields as touched
    const allTouched = {
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      agreeTerms: true,
    };
    setTouched(allTouched);

    // Run full validation check
    const errors = validateForm();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError('Please meet all password and form requirements below before submitting.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, role: 'Fan' }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      setLoading(false);
      setSuccess(true);

      localStorage.setItem('clubverse_user', JSON.stringify(data.user));

      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to connect to MongoDB server.');
    }
  };

  // Helper input styling depending on touched and error status
  const getInputClass = (field) => {
    const base = 'w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border px-4 py-2.5 font-medium transition-all focus:outline-none focus:bg-[#FFFDF8]';
    if (touched[field] && fieldErrors[field]) {
      return `${base} border-red-400 focus:border-red-500 bg-red-50/20`;
    }
    if (touched[field] && !fieldErrors[field]) {
      return `${base} border-emerald-400 focus:border-[#7A8B5A]`;
    }
    return `${base} border-[#E4E1D8] focus:border-[#7A8B5A]`;
  };

  return (
    <div className="w-full max-w-4xl bg-[#FFFDF8] rounded-[2.5rem] border border-[#E4E1D8] shadow-warm-lg overflow-hidden grid grid-cols-1 md:grid-cols-12 relative font-sans">
      
      {/* Left Column: Form Panel */}
      <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-between z-10">
        
        <div>
          {/* Header Title */}
          <div className="mb-6 space-y-1">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#20221F] font-serif tracking-tight">
              Create Account
            </h2>
            <p className="text-xs text-[#6F716B] font-medium">
              Join ClubVerse to unlock official club features & fan perks.
            </p>
          </div>

          {/* Top Form Error Alert */}
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-4 p-3 rounded-2xl bg-[#7A8B5A]/15 border border-[#7A8B5A]/30 text-[#7A8B5A] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#7A8B5A]" />
              <span>Registration successful! Redirecting to home...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
            
            {/* Informative Fan Account Notice */}
            <div className="p-3 rounded-2xl bg-[#7A8B5A]/10 border border-[#7A8B5A]/25 text-xs text-[#20221F] space-y-1">
              <p className="font-bold text-[#7A8B5A] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Fan Registration</span>
              </p>
              <p className="text-[11px] text-[#6F716B]">
                Public registration is for <strong>Fan Accounts</strong>. Players and Coaches are registered directly by the Club Admin using their Date of Birth (DOB) as their initial password.
              </p>
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="block text-[10px] font-bold text-[#6F716B] uppercase tracking-wider">
                  Full Name <span className="text-red-500">*</span>
                </label>
                {touched.fullName && !fieldErrors.fullName && (
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Valid
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="Alex Morgan"
                value={fullName}
                onChange={(e) => handleFieldChange('fullName', e.target.value)}
                onBlur={() => handleBlur('fullName')}
                className={getInputClass('fullName')}
              />
              {touched.fullName && fieldErrors.fullName && (
                <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 ml-1 mt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.fullName}</span>
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="block text-[10px] font-bold text-[#6F716B] uppercase tracking-wider">
                  Email Address <span className="text-red-500">*</span>
                </label>
                {touched.email && !fieldErrors.email && (
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Valid
                  </span>
                )}
              </div>
              <input
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={getInputClass('email')}
              />
              {touched.email && fieldErrors.email && (
                <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 ml-1 mt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.email}</span>
                </p>
              )}
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-[10px] font-bold text-[#6F716B] uppercase tracking-wider">
                    Password <span className="text-red-500">*</span>
                  </label>
                  {password && strength.label && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wide" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={`${getInputClass('password')} pr-9`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6F716B] hover:text-[#20221F]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Password Strength Indicator Bar */}
                {password.length > 0 && (
                  <div className="space-y-1 px-1 pt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((bar) => (
                        <div
                          key={bar}
                          className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: bar <= strength.score ? strength.color : '#E4E1D8',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-[10px] font-bold text-[#6F716B] uppercase tracking-wider">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  {touched.confirmPassword && !fieldErrors.confirmPassword && confirmPassword && (
                    <span className="text-[10px] text-[#7A8B5A] font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Matches
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    className={getInputClass('confirmPassword')}
                  />
                </div>
                {confirmMismatch && (
                  <p className="text-[11px] text-red-500 font-medium ml-1 flex items-center gap-1 mt-1">
                    <X className="w-3 h-3" /> Passwords do not match
                  </p>
                )}
              </div>

            </div>

            {/* Exact Rule Checklist from SetupPasswordPage */}
            {(touched.password || password.length > 0) && (
              <div className="p-3 bg-[#F7F5EF] rounded-2xl border border-[#E4E1D8] space-y-1.5">
                <p className="text-[10px] font-bold text-[#6F716B] uppercase tracking-wider">Password Requirements:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {ruleResults.map((rule) => (
                    <div key={rule.id} className="flex items-center gap-1.5">
                      {rule.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#7A8B5A] shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      )}
                      <span className={`text-[11px] font-medium ${rule.passed ? 'text-[#7A8B5A]' : 'text-[#6F716B]'}`}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Terms Agreement Checkbox */}
            <div className="pt-1 ml-1">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[#6F716B] font-medium select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => handleFieldChange('agreeTerms', e.target.checked)}
                  onBlur={() => handleBlur('agreeTerms')}
                  className="w-3.5 h-3.5 rounded border-[#E4E1D8] text-[#7A8B5A] focus:ring-[#7A8B5A]"
                />
                <span>
                  I agree to the <a href="#terms" onClick={(e) => e.preventDefault()} className="text-[#20221F] underline font-semibold">Terms of Service</a> & <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-[#20221F] underline font-semibold">Privacy Policy</a> <span className="text-red-500">*</span>
                </span>
              </label>
              {touched.agreeTerms && fieldErrors.agreeTerms && (
                <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.agreeTerms}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 rounded-full bg-[#2E332B] hover:bg-[#7A8B5A] text-white font-bold text-xs shadow-warm-sm transition-all duration-300 mt-2 disabled:opacity-60"
            >
              {loading ? 'Creating Account...' : 'Register Fan Account'}
            </button>
          </form>

        </div>

        {/* Footer Navigation Link */}
        <div className="mt-6 pt-3 border-t border-[#E4E1D8] text-center">
          <p className="text-[11px] font-medium text-[#6F716B]">
            Already have a ClubVerse account?{' '}
            <Link to="/login" className="font-bold text-[#20221F] hover:underline">
              Log in
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
