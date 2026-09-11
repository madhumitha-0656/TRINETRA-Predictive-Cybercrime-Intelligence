import React from 'react';
import { LayoutDashboard, Sparkles, MapPin, FileText, GitFork, ArrowRight } from 'lucide-react';
import { CybercrimeComplaint } from '../types';

interface CaseHeaderProps {
  activeCase: CybercrimeComplaint;
  onNavigate: (viewId: any) => void;
  currentView?: string;
}

export const CaseHeader: React.FC<CaseHeaderProps> = ({
  activeCase,
  onNavigate,
  currentView,
}) => {
  return (
    <div className="bg-white border border-[#DCE4EA] rounded-xl px-4 py-2.5 shadow-2xs mb-3 flex flex-wrap items-center justify-between gap-2.5">
      {/* Left: Thin Single-Line Case Summary */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="font-mono font-bold text-[#0D4778] text-sm">
          {activeCase.id}
        </span>
        <span className="text-[#DCE4EA]">|</span>
        <span className="font-semibold text-[#172B3A]">
          {activeCase.fraudCategory}
        </span>
        <span className="text-[#DCE4EA]">|</span>
        <span className="font-mono font-bold text-[#172B3A]">
          ₹{activeCase.fraudAmount.toLocaleString('en-IN')}
        </span>
        <span className="text-[#DCE4EA]">|</span>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
            activeCase.overallRisk === 'CRITICAL'
              ? 'bg-rose-100 text-rose-800'
              : activeCase.overallRisk === 'HIGH'
              ? 'bg-orange-100 text-orange-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {activeCase.overallRisk} RISK
        </span>
      </div>

      {/* Right: Quick Navigation Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => onNavigate('case-overview')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
            currentView === 'case-overview'
              ? 'bg-[#1769AA] text-white font-bold'
              : 'bg-[#F7F9FB] hover:bg-[#EAF4FB] text-[#0D4778] border border-[#DCE4EA]'
          }`}
        >
          <LayoutDashboard className="w-3 h-3" />
          <span>CASE OVERVIEW</span>
        </button>

        <button
          onClick={() => onNavigate('transaction-network')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
            currentView === 'transaction-network'
              ? 'bg-[#1769AA] text-white font-bold'
              : 'bg-[#F7F9FB] hover:bg-[#EAF4FB] text-[#0D4778] border border-[#DCE4EA]'
          }`}
        >
          <GitFork className="w-3 h-3" />
          <span>NETWORK</span>
        </button>

        <button
          onClick={() => onNavigate('prediction')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
            currentView === 'prediction'
              ? 'bg-[#1769AA] text-white font-bold'
              : 'bg-[#F7F9FB] hover:bg-[#EAF4FB] text-[#0D4778] border border-[#DCE4EA]'
          }`}
        >
          <Sparkles className="w-3 h-3 text-[#F58220]" />
          <span>PREDICTION</span>
        </button>

        <button
          onClick={() => onNavigate('digital-nakabandi')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
            currentView === 'digital-nakabandi'
              ? 'bg-[#1769AA] text-white font-bold'
              : 'bg-[#F7F9FB] hover:bg-[#EAF4FB] text-[#0D4778] border border-[#DCE4EA]'
          }`}
        >
          <MapPin className="w-3 h-3 text-[#138A44]" />
          <span>DIGITAL NAKABANDI</span>
        </button>

        <button
          onClick={() => onNavigate('reports')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
            currentView === 'reports'
              ? 'bg-[#1769AA] text-white font-bold'
              : 'bg-[#F7F9FB] hover:bg-[#EAF4FB] text-[#0D4778] border border-[#DCE4EA]'
          }`}
        >
          <FileText className="w-3 h-3" />
          <span>REPORT</span>
        </button>
      </div>
    </div>
  );
};
