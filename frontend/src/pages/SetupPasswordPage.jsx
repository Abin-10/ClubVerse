import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck, X } from 'lucide-react';

// Password strength rules
const RULES = [
  { id: 'length',    label: 'At least 8 characters',           test: (p) => p.length >= 8 },
  { id: 'upper',     label: 'At least one uppercase letter (A–Z)', test: (p) => /[A-Z]/.test(p) },
  { id: 'lower',     label: 'At least one lowercase letter (a–z)', test: (p) => /[a-z]/.test(p) },
  { id: 'number',    label: 'At least one number (0–9)',        test: (p) => /[0-9]/.test(p) },
  { id: 'special',   label: 'At least one special character (!@#$…)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(password) {
  const passed = RULES.filter((r) => r.test(password)).length;
  if (passed === 0) return { score: 0, label: '', color: '' };
  if (passed <= 2)  return { score: 1, label: 'Weak',      color: '#EF4444' };
  if (passed === 3) return { score: 2, label: 'Fair',      color: '#F59E0B' };
  if (passed === 4) return { score: 3, label: 'Strong',    color: '#7A8B5A' };
  return               { score: 4, label: 'Very Strong', color: '#16A34A' };
}

export default function SetupPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [tokenInfo, setTokenInfo] = useState(null);
  const [tokenError, setTokenError] = useState('');
  const [tokenLoading, setTokenLoading] = useState(true);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = useMemo(() => getStrength(newPassword), [newPassword]);
  const ruleResults = useMemo(() => RULES.map((r) => ({ ...r, passed: r.test(newPassword) })), [newPassword]);
  const allRulesPassed = ruleResults.every((r) => r.passed);
  const passwordsMatch = newPassword !== '' && newPassword === confirmPassword;
  const confirmMismatch = touched.confirm && confirmPassword !== '' && newPassword !== confirmPassword;

  useEffect(() => {
    if (!token) {
      setTokenError('No invitation token found. Please use the link from your email.');
      setTokenLoading(false);
      return;
    }
    fetch(`http://localhost:5000/api/auth/setup-password/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {
          setTokenInfo({ email: data.email, role: data.role });
        } else {
          setTokenError(data.message || 'Invalid or expired invitation link.');
        }
        setTokenLoading(false);
      })
      .catch(() => {
        setTokenError('Failed to verify the invitation link. Please try again.');
        setTokenLoading(false);
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTouched({ password: true, confirm: true });

    if (!allRulesPassed) {
      setError('Please meet all the password requirements below.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please check and try again.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/setup-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to set password.');
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to set password. Please try again.');
    }
  };

  const isSubmitDisabled = loading || !allRulesPassed || !passwordsMatch;

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-[#EFEEE8] rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#E4E1D8]/60 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-black text-2xl tracking-tight text-[#20221F] font-serif">Club</span>
          <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-[#7A8B5A] to-[#B08D57] bg-clip-text text-transparent">Verse</span>
          <span className="w-2 h-2 rounded-full bg-[#7A8B5A] inline-block ml-1" />
        </div>

        <div className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-[2.5rem] p-8 shadow-warm-lg">

          {/* Loading */}
          {tokenLoading && (
            <div className="text-center py-10">
              <div className="w-10 h-10 border-4 border-[#7A8B5A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-[#6F716B] font-medium">Verifying your invitation link…</p>
            </div>
          )}

          {/* Invalid token */}
          {!tokenLoading && tokenError && (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7 text-red-500" />
              </div>
              <h2 className="text-xl font-black text-[#20221F] font-serif mb-2">Link Invalid</h2>
              <p className="text-sm text-[#6F716B] mb-6">{tokenError}</p>
              <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-[#7A8B5A] hover:text-[#20221F] transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          )}

          {/* Success */}
          {!tokenLoading && !tokenError && success && (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-[#7A8B5A]/15 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-[#7A8B5A]" />
              </div>
              <h2 className="text-xl font-black text-[#20221F] font-serif mb-2">Password Set!</h2>
              <p className="text-sm text-[#6F716B] mb-1">Your account is now active. Welcome to ClubVerse FC!</p>
              <p className="text-xs text-[#6F716B]">Redirecting you to login…</p>
            </div>
          )}

          {/* Setup form */}
          {!tokenLoading && !tokenError && !success && tokenInfo && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A8B5A]/15 text-[#7A8B5A] text-[11px] font-extrabold uppercase tracking-wider mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Account Setup</span>
                </div>
                <h2 className="text-2xl font-black text-[#20221F] font-serif tracking-tight">Set Your Password</h2>
                <p className="text-sm text-[#6F716B] mt-1">
                  Welcome, <strong>{tokenInfo.email}</strong><br />
                  You've been added as a <span className="text-[#7A8B5A] font-bold">{tokenInfo.role}</span> at ClubVerse FC.
                </p>
              </div>

              {/* Global error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-xs text-red-700 font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* New Password */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B08D57]" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                      placeholder="Create a strong password"
                      className={`w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border pl-10 pr-10 py-3 font-medium focus:outline-none transition-all ${
                        touched.password && !allRulesPassed && newPassword
                          ? 'border-red-400 focus:border-red-400'
                          : touched.password && allRulesPassed
                          ? 'border-[#7A8B5A] focus:border-[#7A8B5A] bg-[#FFFDF8]'
                          : 'border-[#E4E1D8] focus:border-[#7A8B5A] focus:bg-[#FFFDF8]'
                      }`}
                    />
                    <button type="button" onClick={() => setShowPass((p) => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6F716B] hover:text-[#20221F] transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Strength bar — shown as soon as user starts typing */}
                  {newPassword.length > 0 && (
                    <div className="space-y-1 px-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-[#6F716B] uppercase tracking-wide">Strength</span>
                        {strength.label && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wide" style={{ color: strength.color }}>
                            {strength.label}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((bar) => (
                          <div
                            key={bar}
                            className="h-1.5 flex-1 rounded-full transition-all duration-300"
                            style={{
                              backgroundColor: bar <= strength.score ? strength.color : '#E4E1D8',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Requirement checklist */}
                  {(touched.password || newPassword.length > 0) && (
                    <ul className="space-y-1 pt-1 pl-1">
                      {ruleResults.map((rule) => (
                        <li key={rule.id} className="flex items-center gap-2">
                          {rule.passed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#7A8B5A] shrink-0" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          )}
                          <span className={`text-[11px] font-medium transition-colors ${rule.passed ? 'text-[#7A8B5A]' : 'text-[#6F716B]'}`}>
                            {rule.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#6F716B] uppercase tracking-wider ml-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B08D57]" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => setTouched((p) => ({ ...p, confirm: true }))}
                      placeholder="Repeat your password"
                      className={`w-full bg-[#F7F5EF] text-[#20221F] text-xs rounded-full border pl-10 pr-10 py-3 font-medium focus:outline-none transition-all ${
                        confirmMismatch
                          ? 'border-red-400 focus:border-red-400'
                          : passwordsMatch
                          ? 'border-[#7A8B5A] bg-[#FFFDF8]'
                          : 'border-[#E4E1D8] focus:border-[#7A8B5A] focus:bg-[#FFFDF8]'
                      }`}
                    />
                    <button type="button" onClick={() => setShowConfirm((p) => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6F716B] hover:text-[#20221F] transition-colors">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {/* Match icon */}
                    {confirmPassword && !showConfirm && (
                      <div className="absolute right-10 top-1/2 -translate-y-1/2">
                        {passwordsMatch
                          ? <CheckCircle2 className="w-4 h-4 text-[#7A8B5A]" />
                          : touched.confirm && <X className="w-4 h-4 text-red-400" />
                        }
                      </div>
                    )}
                  </div>
                  {confirmMismatch && (
                    <p className="text-[11px] text-red-500 font-medium ml-1 flex items-center gap-1">
                      <X className="w-3 h-3" /> Passwords do not match
                    </p>
                  )}
                  {passwordsMatch && (
                    <p className="text-[11px] text-[#7A8B5A] font-medium ml-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Passwords match
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="w-full bg-[#7A8B5A] hover:bg-[#6a7a4d] text-white font-bold text-sm py-3.5 rounded-full transition-all shadow-warm-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Setting Password…</>
                  ) : (
                    <><ShieldCheck className="w-4 h-4" /> Set Password & Activate Account</>
                  )}
                </button>

              </form>

              <div className="mt-5 text-center">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6F716B] hover:text-[#20221F] transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> Already have a password? Log in
                </Link>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-[#6F716B] mt-6 font-medium">
          © {new Date().getFullYear()} ClubVerse FC • Spotify Arena Platform
        </p>
      </div>
    </div>
  );
}
