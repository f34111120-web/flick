import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Eye, EyeOff, ShieldCheck, User } from 'lucide-react';

interface SignupScreenProps {
  onSignUp: (userData: { name: string; username: string; email: string; discipline: string }) => void;
  onLogin: (email: string) => void;
}

export default function SignupScreen({ onSignUp, onLogin }: SignupScreenProps) {
  const [email, setEmail] = useState('jane@studio.design');
  const [password, setPassword] = useState('monochrome2026');
  const [discipline, setDiscipline] = useState('Creator');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all details.');
      return;
    }
    setError('');
    
    // Derive name and username from email
    const emailParts = email.split('@');
    const localPart = emailParts[0] || 'user';
    const cleanUsername = localPart.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() || 'user';
    const derivedName = localPart.charAt(0).toUpperCase() + localPart.slice(1);

    onSignUp({
      name: derivedName,
      username: `@${cleanUsername}`,
      email,
      discipline
    });
  };

  const handleGoogleLogin = () => {
    onSignUp({
      name: 'Google User',
      username: '@google_flick',
      email: 'user@gmail.com',
      discipline: 'Creator'
    });
  };

  const handleAppleLogin = () => {
    onSignUp({
      name: 'Apple User',
      username: '@apple_flick',
      email: 'user@icloud.com',
      discipline: 'Creator'
    });
  };

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setError('請先填入 email 再登入。');
      return;
    }
    setError('');
    onLogin(email); // 用填入的 email 記一筆登入（累積登入次數/時間）
  };

  return (
    <div className="w-full h-[844px] bg-[#070707] text-[#e5e2e1] relative overflow-hidden flex flex-col items-center justify-center">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#151515_1px,transparent_1px),linear-gradient(to_bottom,#151515_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      {/* Floating high-contrast circles (editorial styling, blurred) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-neutral-900 blur-2xl pointer-events-none" />

      {/* Scrollable Container wrapper to keep everything perfectly reachable inside the phone view mockup */}
      <div className="w-full h-full overflow-y-auto scrollbar-none p-6 flex flex-col items-center justify-start pt-12 pb-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md relative"
        >
        {/* Gallery-style Top Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#444748] bg-[#0e0e0e] mb-4 text-[#c7c6c6]">
            <span className="font-mono text-xl font-bold tracking-widest">F</span>
          </div>
          <h1 className="font-sans text-3xl font-extrabold tracking-tight text-white mb-2">FLICK</h1>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8e9192]">分享生活點滴，參與熱門話題</p>
        </div>

        {/* Signup Card */}
        <div className="bg-[#131313] border border-neutral-800 p-8 rounded-xl relative shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-neutral-800 via-neutral-500 to-neutral-800" />
          
          <h2 className="text-xl font-semibold text-white mb-6 tracking-tight">建立生活分享帳號</h2>

          {error && (
            <div className="mb-4 bg-red-950/40 border border-red-900 text-red-300 px-4 py-2 text-xs rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-wider text-[#8e9192] mb-1.5">
                電子信箱 Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0e0e0e] border border-neutral-800 rounded-md py-2.5 px-4 text-sm text-white focus:outline-none focus:border-neutral-500 transition-colors"
                placeholder="jane@studio.design"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-wider text-[#8e9192] mb-1.5">
                密碼 Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0e0e0e] border border-neutral-800 rounded-md py-2.5 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-neutral-500 transition-colors"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2.5 py-1">
              <input
                id="terms"
                type="checkbox"
                defaultChecked
                required
                className="mt-0.5 accent-white rounded"
              />
              <label htmlFor="terms" className="text-[11px] text-[#8e9192] leading-tight">
                我已閱讀並同意生活分享條款與隱私權保護政策。
              </label>
            </div>

            {/* SIGN UP Button */}
            <button
              id="signup-button"
              type="submit"
              className="w-full py-3 bg-white text-[#131313] hover:bg-[#c7c6c6] text-xs font-bold uppercase tracking-widest rounded-md mt-2 transition-all duration-300 cursor-pointer"
            >
              開啟體驗之旅
            </button>
          </form>

          {/* Quick Login Separator */}
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-850"></div>
            </div>
            <span className="relative px-3 bg-[#131313] font-mono text-[8.5px] uppercase tracking-wider text-[#6a6c6d]">
              快速登入 Quick Access
            </span>
          </div>

          {/* Quick Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleGoogleLogin}
              className="py-2.5 px-3 bg-[#0e0e0e] border border-neutral-800 hover:border-neutral-700 hover:bg-[#131313] rounded-md text-xs font-medium text-neutral-300 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.147 4.114-3.41 0-6.173-2.763-6.173-6.173s2.763-6.173 6.173-6.173c1.558 0 2.977.575 4.077 1.514l3.1-3.1C19.23 2.15 15.96 1 12.24 1 5.48 1 0 6.48 0 13.24s5.48 12.24 12.24 12.24c6.76 0 11.76-4.76 11.76-11.76 0-.48-.04-.96-.12-1.44H12.24z"
                />
              </svg>
              <span>Google 登入</span>
            </button>
            <button
              onClick={handleAppleLogin}
              className="py-2.5 px-3 bg-[#0e0e0e] border border-neutral-800 hover:border-neutral-700 hover:bg-[#131313] rounded-md text-xs font-medium text-neutral-300 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94 1.07.08 2.15-.52 2.81-1.33z" />
              </svg>
              <span>Apple 登入</span>
            </button>
          </div>

          {/* Already a member */}
          <div className="mt-6 text-center border-t border-neutral-800 pt-4">
            <a
              id="signin-link"
              href="#"
              onClick={handleSignInClick}
              className="font-mono text-[11px] text-[#8e9192] hover:text-[#e5e2e1] active:text-[#c7c6c6] transition-colors uppercase tracking-wider decoration-1 underline-offset-4 hover:underline"
            >
              已有帳號？登入體驗
            </a>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
