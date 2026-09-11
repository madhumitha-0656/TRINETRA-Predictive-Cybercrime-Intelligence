import React from 'react';
import {
  User,
  LogOut,
  Layers,
  Server,
} from 'lucide-react';
import { CybercrimeComplaint, InvestigatorSession, PrototypeUser } from '../types';
import { SYNTHETIC_DISCLAIMER_SHORT } from '../data/syntheticDataset';

interface HeaderProps {
  session?: InvestigatorSession | null;
  activeCase: CybercrimeComplaint;
  allComplaints?: CybercrimeComplaint[];
  complaints?: CybercrimeComplaint[];
  onSelectCase: (c: CybercrimeComplaint) => void;
  onLogout: () => void;
  onOpenReport?: () => void;
  onNavigate: (viewId: any) => void;
  officerName?: string;
  officerRole?: string;
  badgeId?: string;
  currentUser?: PrototypeUser | null;
  onOpenTechInfo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  activeCase,
  allComplaints,
  complaints,
  officerName,
  officerRole,
  badgeId,
  currentUser,
  onSelectCase,
  onLogout,
  onNavigate,
  onOpenTechInfo,
}) => {
  const caseList = allComplaints || complaints || [];

  return (
    <header className="bg-white border border-[#DCE4EA] rounded-xl shadow-xs sticky top-0 z-40">
      {/* Top SIH & Prototype Identification Bar */}
      <div className="bg-[#F7F9FB] px-3.5 py-1.5 flex items-center justify-between text-xs border-b border-[#DCE4EA] rounded-t-xl">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#FFF3E8] text-[#F58220] font-semibold border border-[#F58220]/30 text-[11px] tracking-wide">
            {SYNTHETIC_DISCLAIMER_SHORT}
          </span>
          <span className="text-[#5F6B76] text-xs">
            Smart India Hackathon 2026 • Team: <strong className="text-[#172B3A] font-semibold">Furious Rookie</strong>
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Brand, Subtitle & Tagline */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => onNavigate('command-center')}
          title="Return to Command Center"
        >
          {/* Professional Government-Tech Emblem with SIH Blue & Orange Tricolor accent */}
          <div className="w-10 h-10 rounded-lg bg-[#1769AA] flex flex-col items-center justify-center text-white shadow-xs shrink-0 border border-[#0D4778] relative overflow-hidden">
            <span className="font-extrabold text-base tracking-tight leading-none">त्र</span>
            <div className="absolute bottom-0 inset-x-0 h-1 bg-[#F58220]"></div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-[#0D4778] leading-none">
                TRINETRA
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#EAF4FB] text-[#1769AA] border border-[#1769AA]/20">
                SIH 2026
              </span>
            </div>
            <p className="text-xs font-semibold text-[#172B3A] mt-0.5">
              Predictive Cybercrime Cash-Out Intelligence Network
            </p>
            <p className="text-[11px] text-[#5F6B76] italic">
              “From Reactive Tracing to Predictive Intervention”
            </p>
          </div>
        </div>

        {/* Center: Case Quick Switcher (Light, Clean Dropdown) */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-2">
          <div className="bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg px-3 py-1.5 flex items-center gap-2 w-full text-xs shadow-2xs hover:border-[#1769AA]/40 transition-colors">
            <span className="text-[#5F6B76] font-medium text-[11px] whitespace-nowrap flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#1769AA]" />
              Case:
            </span>
            <select
              value={activeCase?.id || 'TRI-2026-0042'}
              onChange={(e) => {
                const found = caseList.find((c) => c.id === e.target.value);
                if (found) onSelectCase(found);
              }}
              className="bg-transparent text-[#172B3A] text-xs font-semibold focus:outline-none flex-1 truncate cursor-pointer"
            >
              <option value="TRI-2026-0042">
                TRI-2026-0042 • Investment Scam (₹1,85,000) [Flagship Demo]
              </option>
              {caseList
                .filter((c) => c.id !== 'TRI-2026-0042')
                .filter((c, idx, arr) => arr.findIndex((x) => x.id === c.id) === idx)
                .slice(0, 15)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} • {c.fraudCategory} (₹{c.fraudAmount.toLocaleString('en-IN')}) — {c.overallRisk}
                  </option>
                ))}
            </select>
            <span
              className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${
                activeCase?.overallRisk === 'CRITICAL'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : activeCase?.overallRisk === 'HIGH'
                  ? 'bg-[#FFF3E8] text-[#F58220] border border-[#F58220]/30'
                  : 'bg-[#EAF7EF] text-[#138A44] border border-[#138A44]/30'
              }`}
            >
              {activeCase?.overallRisk || 'HIGH'}
            </span>
          </div>
        </div>

        {/* Right: Technical Info, Profile & Logout */}
        <div className="flex items-center gap-2.5">
          {onOpenTechInfo && (
            <button
              onClick={onOpenTechInfo}
              className="px-2.5 py-1.5 rounded-lg bg-[#F7F9FB] hover:bg-[#EAF4FB] text-[#0D4778] border border-[#DCE4EA] hover:border-[#1769AA]/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="View PostgreSQL, PostGIS & Neo4j architecture and audit log"
            >
              <Server className="w-3.5 h-3.5 text-[#1769AA]" />
              <span className="hidden md:inline">Technical Info</span>
            </button>
          )}

          <div className="hidden sm:flex flex-col text-right">
            <span className="font-semibold text-xs text-[#172B3A]">
              {currentUser?.name || officerName || session?.officerName || 'Rehan'}
            </span>
            <span className="text-[11px] text-[#5F6B76]">
              {currentUser?.role || officerRole || 'Team Lead / Supervising Analyst'} • {currentUser?.user_id || badgeId || 'FR-001'}
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#EAF4FB] border border-[#1769AA]/30 flex items-center justify-center text-[#1769AA]">
            <User className="w-4 h-4" />
          </div>

          <button
            onClick={onLogout}
            title="Sign out of prototype session"
            className="p-1.5 rounded-lg bg-white border border-[#DCE4EA] hover:bg-rose-50 text-[#5F6B76] hover:text-rose-600 hover:border-rose-200 transition-colors shadow-2xs cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
