import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../lib/authStore';

export const Login = () => {
  const navigate = useNavigate();
  const { Login, isLoggingIn } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await Login(formData);
    if (result.success) navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#111317] relative overflow-hidden">
      {/* ── Ambient Glows ── */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#c0c1ff]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[260px] bg-[#00885d]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Floating security badge */}
      <div className="hidden sm:flex fixed top-6 right-6 z-40 items-center gap-2 px-3.5 py-1.5 bg-[#1a1c1f]/90 border border-white/5 backdrop-blur-md rounded-lg shadow-xl text-xs text-[#e2e2e6]">
        <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
        <span className="font-mono text-[11px] tracking-wider uppercase text-[#4edea3]">Session Secure</span>
        <span className="text-[#94a3b8]/40">|</span>
        <span className="font-mono text-[11px] text-[#94a3b8]">TLS 1.3 Vault</span>
      </div>

      <div className="w-full max-w-md flex flex-col items-center sm:items-start relative z-10">
        {/* Brand Anchor Chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 bg-[#1a1c1f] border border-white/10 rounded-lg shadow-sm">
          <div className="w-5 h-5 flex items-center justify-center rounded bg-[#282a2d] text-[#c0c1ff] font-bold text-xs">
            M
          </div>
          <span className="font-semibold text-xs tracking-wider text-[#e2e2e6]">MINDHUB</span>
          <span className="text-[#94a3b8] font-mono text-xs">/</span>
          <span className="text-[10px] font-mono text-[#c0c1ff] tracking-widest uppercase">AUTH.VAULT</span>
        </div>

        {/* Headings */}
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-[#e2e2e6] uppercase">
            WELCOME BACK.
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1">
            Sign in to your sovereign cognitive workspace & synchronized notes.
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full bg-[#1a1c1f] rounded-xl p-6 sm:p-7 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Subtle Top Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c0c1ff] to-transparent opacity-80" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-wider text-[#94a3b8]">
                <label htmlFor="login-email">Email Address</label>
                <span className="text-[#94a3b8]/60 text-[10px]">PRIMARY ID</span>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#94a3b8] text-[18px] pointer-events-none">
                  mail
                </span>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@mindhub.internal"
                  required
                  disabled={isLoggingIn}
                  className="w-full bg-[#0c0e11] text-[#e2e2e6] text-xs pl-10 pr-3 py-2.5 rounded-lg border border-white/10 focus:border-[#c0c1ff] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-wider text-[#94a3b8]">
                <label htmlFor="login-password">Password</label>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#94a3b8] text-[18px] pointer-events-none">
                  lock
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  required
                  disabled={isLoggingIn}
                  className="w-full bg-[#0c0e11] text-[#e2e2e6] text-xs pl-10 pr-10 py-2.5 rounded-lg border border-white/10 focus:border-[#c0c1ff] focus:outline-none transition-colors"
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

            {/* Security Status Callout */}
            <div className="flex items-center gap-2.5 p-2.5 bg-[#0c0e11] border border-white/5 rounded-lg">
              <span className="material-symbols-outlined text-[#c0c1ff] text-[18px] shrink-0">
                shield_lock
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-medium text-[#e2e2e6] truncate">
                  Encrypted Knowledge Vault
                </span>
                <span className="text-[10px] text-[#94a3b8] truncate">
                  7-Day Persistent Session • Zero-loss storage
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoggingIn || !formData.email || !formData.password}
              className="w-full mt-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#c0c1ff] hover:bg-[#e1e0ff] text-[#1000a9] font-semibold text-xs tracking-wider uppercase rounded-lg shadow-lg shadow-[#c0c1ff]/15 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#1000a9] border-t-transparent rounded-full animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <span>LOG IN</span>
                  <span className="material-symbols-outlined text-[17px]">bolt</span>
                </>
              )}
            </button>
          </form>

          {/* Form Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="w-full h-px bg-white/5" />
            <span className="absolute bg-[#1a1c1f] px-3 font-mono text-[10px] text-[#94a3b8] uppercase tracking-wider">
              Authentication Protocol
            </span>
          </div>

          {/* Footer Link */}
          <div className="flex items-center justify-between text-xs text-[#94a3b8]">
            <span>No account registered yet?</span>
            <Link
              to="/signup"
              className="text-[#c0c1ff] hover:text-[#e1e0ff] font-medium flex items-center gap-1 group transition-colors"
            >
              <span>Sign up</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* Bottom Trust Badges */}
        <div className="w-full mt-4 flex items-center justify-between px-2 text-[#94a3b8] font-mono text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#4edea3]">key</span>
            <span>WebAuthn / Passkeys Ready</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Quick Launch:</span>
            <kbd className="px-1.5 py-0.5 bg-[#1a1c1f] border border-white/10 rounded text-[9px] text-[#e2e2e6]">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
};