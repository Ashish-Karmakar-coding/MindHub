import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../lib/authStore';

export const Signup = () => {
  const navigate = useNavigate();
  const { signUp, isSigningUp } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const result = await signUp({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#111317] relative overflow-hidden">
      {/* ── Ambient Glows ── */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#d0bcff]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[260px] bg-[#4edea3]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Floating status */}
      <div className="hidden sm:flex fixed top-6 right-6 z-40 items-center gap-2 px-3.5 py-1.5 bg-[#1a1c1f]/90 border border-white/5 backdrop-blur-md rounded-lg shadow-xl text-xs text-[#e2e2e6]">
        <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
        <span className="font-mono text-[11px] tracking-wider uppercase text-[#4edea3]">Vault Ready</span>
        <span className="text-[#94a3b8]/40">|</span>
        <span className="font-mono text-[11px] text-[#94a3b8]">New Profile</span>
      </div>

      <div className="w-full max-w-md flex flex-col items-center sm:items-start relative z-10">
        {/* Brand Anchor Chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 bg-[#1a1c1f] border border-white/10 rounded-lg shadow-sm">
          <div className="w-5 h-5 flex items-center justify-center rounded bg-[#282a2d] text-[#d0bcff] font-bold text-xs">
            M
          </div>
          <span className="font-semibold text-xs tracking-wider text-[#e2e2e6]">MINDHUB</span>
          <span className="text-[#94a3b8] font-mono text-xs">/</span>
          <span className="text-[10px] font-mono text-[#d0bcff] tracking-widest uppercase">PROVISION</span>
        </div>

        {/* Headings */}
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-[#e2e2e6] uppercase">
            CREATE ACCOUNT.
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1">
            Provision your sovereign knowledge vault & cognitive workspace.
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full bg-[#1a1c1f] rounded-xl p-6 sm:p-7 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Subtle Top Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d0bcff] to-transparent opacity-80" />

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8]" htmlFor="name">
                Full Name
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#94a3b8] text-[18px] pointer-events-none">
                  badge
                </span>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Alex Vance"
                  required
                  disabled={isSigningUp}
                  className="w-full bg-[#0c0e11] text-[#e2e2e6] text-xs pl-10 pr-3 py-2.5 rounded-lg border border-white/10 focus:border-[#d0bcff] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8]" htmlFor="email">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#94a3b8] text-[18px] pointer-events-none">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@mindhub.internal"
                  required
                  disabled={isSigningUp}
                  className="w-full bg-[#0c0e11] text-[#e2e2e6] text-xs pl-10 pr-3 py-2.5 rounded-lg border border-white/10 focus:border-[#d0bcff] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8]" htmlFor="password">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#94a3b8] text-[18px] pointer-events-none">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  required
                  disabled={isSigningUp}
                  className="w-full bg-[#0c0e11] text-[#e2e2e6] text-xs pl-10 pr-10 py-2.5 rounded-lg border border-white/10 focus:border-[#d0bcff] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#94a3b8] hover:text-[#e2e2e6] p-0.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8]" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#94a3b8] text-[18px] pointer-events-none">
                  lock_clock
                </span>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                  disabled={isSigningUp}
                  className="w-full bg-[#0c0e11] text-[#e2e2e6] text-xs pl-10 pr-3 py-2.5 rounded-lg border border-white/10 focus:border-[#d0bcff] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-[#d0bcff] hover:bg-[#e9ddff] text-[#3c0091] font-semibold text-xs tracking-wider uppercase rounded-lg shadow-lg shadow-[#d0bcff]/15 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningUp ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#3c0091] border-t-transparent rounded-full animate-spin" />
                  <span>PROVISIONING VAULT...</span>
                </>
              ) : (
                <>
                  <span>CREATE ACCOUNT</span>
                  <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Form Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="w-full h-px bg-white/5" />
            <span className="absolute bg-[#1a1c1f] px-3 font-mono text-[10px] text-[#94a3b8] uppercase tracking-wider">
              Existing Account
            </span>
          </div>

          {/* Footer Link */}
          <div className="flex items-center justify-between text-xs text-[#94a3b8]">
            <span>Already have an account?</span>
            <Link
              to="/login"
              className="text-[#d0bcff] hover:text-[#e9ddff] font-medium flex items-center gap-1 group transition-colors"
            >
              <span>Log in</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};