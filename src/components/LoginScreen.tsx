import React, { useState } from 'react';
import {
  Lock,
  UserCheck,
  Building,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { PrototypeUser } from '../types';
import { DEMO_PROTOTYPE_USERS } from '../data/demoUsers';
import { authService } from '../services/authService';

interface LoginScreenProps {
  onLoginSuccess: (user: PrototypeUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('FR-001');
  const [password, setPassword] = useState('Trinetra@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState<PrototypeUser | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const result = await authService.loginWithPassword(identifier, password);
      if (result.success && result.user) {
        setVerifiedUser(result.user);
        setTimeout(() => {
          onLoginSuccess(result.user!);
        }, 1200);
      } else {
        setErrorMsg(result.error || 'Invalid credentials.');
        setLoading(false);
      }
    } catch {
      setErrorMsg('Authentication error. Please try again.');
      setLoading(false);
    }
  };

  const handleQuickSelect = (user: PrototypeUser) => {
    setIdentifier(user.user_id);
    setPassword('Trinetra@2026');
    setErrorMsg(null);
    setLoading(true);
    const updated = authService.quickSelectUser(user);
    setVerifiedUser(updated);
    setTimeout(() => {
      onLoginSuccess(updated);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col justify-between text-[#172B3A] font-sans selection:bg-[#1769AA] selection:text-white">
      {/* Top Bar with Tricolor Strip */}
      <div>
        <div className="h-1.5 w-full bg-gradient-to-r from-[#F58220] via-white to-[#138A44]"></div>
        <div className="border-b border-[#DCE4EA] px-6 py-3 bg-white shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0D4778] text-white flex items-center justify-center font-bold text-lg shadow-2xs">
              त्र
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-wider text-base text-[#0D4778]">
                  TRINETRA
                </span>
                <span className="text-[10px] bg-[#FFF3E8] text-[#F58220] border border-[#F58220]/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  SIH 2026
                </span>
              </div>
              <div className="text-xs text-[#5F6B76]">
                Predictive Cybercrime Cash-Out Intelligence Network
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#1769AA] font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1769AA]"></span>
            <span>PROTOTYPE ENVIRONMENT</span>
          </div>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="max-w-md w-full space-y-4">
          {/* Transition Card: IDENTITY VERIFIED */}
          {verifiedUser ? (
            <div className="bg-white border-2 border-[#138A44] rounded-xl p-7 shadow-md text-center space-y-3.5 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-[#EAF7EF] text-[#138A44] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#138A44] uppercase tracking-wider block">
                  IDENTITY VERIFIED
                </span>
                <h2 className="text-lg font-bold text-[#0D4778]">
                  Authorized Prototype User
                </h2>
              </div>
              <div className="bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg p-3 text-xs space-y-0.5">
                <div className="font-bold text-sm text-[#172B3A]">{verifiedUser.name}</div>
                <div className="text-[#1769AA] font-semibold">{verifiedUser.role}</div>
                <div className="text-[10px] text-[#5F6B76] font-mono mt-1">Prototype ID: {verifiedUser.user_id}</div>
              </div>
              <p className="text-[11px] text-[#5F6B76]">Entering TRINETRA Command Center...</p>
            </div>
          ) : (
            /* Standard Login Form */
            <div className="bg-white border border-[#DCE4EA] rounded-xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF4FB] border border-[#1769AA]/30 text-[#1769AA] text-xs font-semibold mb-1">
                  <Lock className="w-3.5 h-3.5 text-[#1769AA]" />
                  <span>AUTHORIZED PROTOTYPE ACCESS</span>
                </div>
                <h1 className="text-xl font-bold text-[#0D4778]">
                  TRINETRA
                </h1>
                <p className="text-xs text-[#5F6B76] font-medium leading-relaxed">
                  Predictive Cybercrime Cash-Out Intelligence Network
                </p>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[#172B3A] font-semibold text-xs mb-1">
                    Prototype ID / Email
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-[#5F6B76] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. FR-001"
                      className="w-full pl-9 pr-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-[#172B3A] text-xs focus:outline-none focus:border-[#1769AA] focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#172B3A] font-semibold text-xs mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-[#5F6B76] absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-[#172B3A] text-xs focus:outline-none focus:border-[#1769AA] focus:bg-white font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[#5F6B76] hover:text-[#172B3A] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#1769AA] hover:bg-[#0D4778] text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {loading ? 'Verifying Credentials...' : 'VERIFY & CONTINUE'}
                </button>
              </form>

              {/* 1-Click Demo Profiles Picker */}
              <div className="pt-3 border-t border-[#DCE4EA] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#5F6B76]">
                  <span className="font-bold uppercase tracking-wide flex items-center gap-1 text-[#0D4778]">
                    <Users className="w-3.5 h-3.5" />
                    TEAM FURIOUS ROOKIE — PROTOTYPE USERS
                  </span>
                  <span className="text-[10px]">1-Click Login</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {DEMO_PROTOTYPE_USERS.map((user) => (
                    <button
                      key={user.user_id}
                      type="button"
                      onClick={() => handleQuickSelect(user)}
                      className="p-2 text-left rounded-lg border border-[#DCE4EA] bg-[#F7F9FB] hover:bg-[#EAF4FB] hover:border-[#1769AA] transition-colors cursor-pointer"
                    >
                      <div className="font-bold text-[11px] text-[#172B3A] truncate">{user.name}</div>
                      <div className="text-[10px] text-[#1769AA] truncate">{user.role}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notice & Team Attribution */}
              <div className="pt-2 text-center space-y-1">
                <p className="text-[11px] text-[#5F6B76] italic">
                  “Restricted SIH prototype environment. Demo access limited to registered Team Furious Rookie users.”
                </p>
                <div className="text-[11px] font-bold text-[#0D4778]">
                  SMART INDIA HACKATHON 2026 • Team Furious Rookie
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#DCE4EA] py-3 text-center text-xs text-[#5F6B76] bg-white">
        TRINETRA Prototype • Decision Support for Cybercrime Investigations • Role-Based Prototype Access
      </div>
    </div>
  );
};
