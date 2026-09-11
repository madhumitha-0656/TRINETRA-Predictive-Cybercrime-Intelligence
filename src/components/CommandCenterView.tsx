import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowRight,
  ShieldAlert,
  Compass,
  FilePlus,
  Coins,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { CybercrimeComplaint } from '../types';
import { dataRepository } from '../services/dataRepository';
import { authService } from '../services/authService';

interface CommandCenterViewProps {
  complaints: CybercrimeComplaint[];
  activeCase: CybercrimeComplaint;
  onSelectCase: (c: CybercrimeComplaint) => void;
  onNavigate: (viewId: any) => void;
  onOpenNewComplaint?: () => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  complaints = [],
  activeCase,
  onSelectCase,
  onNavigate,
  onOpenNewComplaint,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const stats = useMemo(() => dataRepository.getDatabaseStats(), [complaints]);

  // Search execution
  const searchResults = useMemo(() => {
    if (!hasSearched || !searchQuery.trim()) return [];
    return dataRepository.searchCases(searchQuery);
  }, [hasSearched, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    authService.recordAuditLog(
      'ANALYSIS_REQUESTED',
      `Searched repository with query: "${searchQuery}"`
    );
  };

  const handleOpenCase = (c: CybercrimeComplaint) => {
    onSelectCase(c);
    authService.recordAuditLog('CASE_OPENED', `Opened case ${c.id} from Dashboard`);
    onNavigate('case-overview');
  };

  const handleOpenDemoCase = () => {
    const demoCase =
      complaints.find((c) => c.id === 'TRI-2026-0042') || activeCase;
    handleOpenCase(demoCase);
  };

  // Recent 5 cases
  const recentCases = useMemo(() => {
    const seen = new Set<string>();
    return complaints
      .filter((c) => {
        if (!c || !c.id || seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      })
      .slice(0, 5);
  }, [complaints]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* 1. Header & Paradigm Shift Strip (User Requirement 7) */}
      <div className="bg-white border border-[#DCE4EA] rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="mb-3.5">
          <h1 className="text-xl sm:text-2xl font-bold text-[#0D4778] tracking-tight">
            TRINETRA COMMAND CENTER
          </h1>
          <p className="text-sm font-semibold text-[#172B3A] mt-0.5">
            From Reactive Tracing to Predictive Intervention
          </p>
        </div>

        {/* Conceptual Paradigm Strip */}
        <div className="bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 items-center text-center">
            {/* Reactive */}
            <div className="bg-white border border-[#DCE4EA] rounded-md p-2.5 shadow-2xs">
              <span className="text-[10px] font-bold text-[#5F6B76] uppercase tracking-wider block">
                REACTIVE
              </span>
              <p className="text-xs sm:text-sm font-bold text-rose-700 mt-0.5">
                WHERE DID THE MONEY GO?
              </p>
            </div>

            {/* TRINETRA Pivot */}
            <div className="flex items-center justify-center gap-2 py-1">
              <span className="text-[#1769AA] font-bold text-sm hidden md:inline">↓</span>
              <div className="px-4 py-1.5 rounded-full bg-[#1769AA] text-white font-bold text-xs shadow-xs tracking-wider">
                TRINETRA
              </div>
              <span className="text-[#1769AA] font-bold text-sm hidden md:inline">↓</span>
            </div>

            {/* Predictive */}
            <div className="bg-[#EAF7EF] border border-[#138A44]/30 rounded-md p-2.5 shadow-2xs">
              <span className="text-[10px] font-bold text-[#138A44] uppercase tracking-wider block">
                PREDICTIVE
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#138A44] mt-0.5">
                WHERE IS IT LIKELY TO EMERGE NEXT?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ONLY 4 Metric Cards (User Requirement 7) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-[#DCE4EA] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[#5F6B76] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              ACTIVE CASES
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F7F9FB] border border-[#DCE4EA] text-[#5F6B76]">
              Synthetic Demo
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0D4778] font-mono">
            {stats.activeCases}
          </div>
        </div>

        <div className="bg-white border border-[#DCE4EA] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[#5F6B76] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
              HIGH-RISK MULES
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F7F9FB] border border-[#DCE4EA] text-[#5F6B76]">
              Synthetic Demo
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-rose-700 font-mono">
            {stats.highRiskMules}
          </div>
        </div>

        <div className="bg-white border border-[#DCE4EA] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[#5F6B76] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1769AA]">
              PREDICTIONS
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F7F9FB] border border-[#DCE4EA] text-[#5F6B76]">
              Synthetic Demo
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#1769AA] font-mono">
            {stats.totalPredictions}
          </div>
        </div>

        <div className="bg-white border border-[#DCE4EA] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[#5F6B76] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#138A44]">
              RISK ZONES
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F7F9FB] border border-[#DCE4EA] text-[#5F6B76]">
              Synthetic Demo
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#138A44] font-mono">
            {stats.activeRiskZones}
          </div>
        </div>
      </div>

      {/* 3. SEARCH CASE Section (User Requirement 7 & 8) */}
      <div className="bg-white border border-[#DCE4EA] rounded-xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#0D4778] uppercase tracking-wider flex items-center gap-1.5">
            <Search className="w-4 h-4 text-[#1769AA]" />
            SEARCH CASE
          </h2>
          <span className="text-[11px] text-[#5F6B76]">
            Supports Case ID, Complaint ID, Account ID or Transaction ID
          </span>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#5F6B76] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Complaint ID, Case ID, Account ID or Transaction ID (e.g. TRI-2026-0042)..."
              className="w-full pl-10 pr-3 py-2.5 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs text-[#172B3A] focus:outline-none focus:border-[#1769AA] focus:bg-white font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#1769AA] hover:bg-[#0D4778] text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs shrink-0"
          >
            SEARCH
          </button>
        </form>

        {/* Search Results Display */}
        {hasSearched && (
          <div className="pt-2 border-t border-[#DCE4EA] space-y-2">
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {searchResults.slice(0, 4).map((c, idx) => (
                  <div
                    key={`${c.id}-${idx}`}
                    className="p-3 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#0D4778]">{c.id}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            c.overallRisk === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800'
                              : c.overallRisk === 'HIGH'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {c.overallRisk}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-[#172B3A] mt-0.5">
                        {c.fraudCategory} • ₹{c.fraudAmount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-[#5F6B76] flex items-center gap-2 mt-0.5">
                        <span>
                          Analysis:{' '}
                          <strong className={c?.prediction ? 'text-[#138A44]' : 'text-amber-700'}>
                            {c?.prediction ? 'COMPLETED' : 'NOT STARTED'}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          Prediction:{' '}
                          <strong className={c?.prediction ? 'text-[#138A44]' : 'text-amber-700'}>
                            {c?.prediction ? 'GENERATED' : 'PENDING'}
                          </strong>
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenCase(c)}
                      className="px-3.5 py-1.5 bg-[#1769AA] hover:bg-[#0D4778] text-white rounded-lg font-bold text-xs transition-colors cursor-pointer shrink-0 shadow-xs whitespace-nowrap"
                    >
                      OPEN FULL CASE
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs flex items-center justify-between gap-3 text-amber-900">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>No matching synthetic case found for “{searchQuery}”.</span>
                </div>
                <button
                  onClick={() => {
                    onNavigate('cases');
                    if (onOpenNewComplaint) onOpenNewComplaint();
                  }}
                  className="px-3 py-1.5 bg-[#1769AA] text-white rounded font-bold text-xs hover:bg-[#0D4778] shrink-0"
                >
                  CREATE NEW COMPLAINT
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. RECENT CASES (Max 5 Rows) & HIGHLIGHTED DEMO CASE (User Requirement 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left: Recent Cases Table (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#DCE4EA] rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#0D4778] uppercase tracking-wider">
              RECENT CASES
            </h2>
            <button
              onClick={() => onNavigate('cases')}
              className="text-xs text-[#1769AA] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View All Cases</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F7F9FB] text-[#5F6B76] border-b border-[#DCE4EA]">
                <tr>
                  <th className="py-2 px-3 font-semibold">Case ID</th>
                  <th className="py-2 px-3 font-semibold">Fraud Type</th>
                  <th className="py-2 px-3 font-semibold">Amount</th>
                  <th className="py-2 px-3 font-semibold">Risk</th>
                  <th className="py-2 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE4EA]">
                {recentCases.map((c, idx) => (
                  <tr
                    key={`${c.id}-${idx}`}
                    onClick={() => handleOpenCase(c)}
                    className="hover:bg-[#EAF4FB]/60 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0D4778]">
                      {c.id}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#172B3A]">
                      {c.fraudCategory}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-[#172B3A]">
                      ₹{c.fraudAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.overallRisk === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : c.overallRisk === 'HIGH'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.overallRisk}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#F7F9FB] border border-[#DCE4EA] text-[10px] font-medium text-[#5F6B76]">
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Highlighted DEMO CASE Card (4 cols) */}
        <div className="lg:col-span-4 bg-white border-2 border-[#1769AA]/40 rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#1769AA] uppercase tracking-wider bg-[#EAF4FB] px-2 py-0.5 rounded border border-[#1769AA]/30">
                FLAGSHIP DEMO CASE
              </span>
              <span className="text-xs font-bold text-rose-700 font-mono">
                HIGH RISK
              </span>
            </div>

            <div className="pt-1">
              <div className="font-mono font-bold text-lg text-[#0D4778]">
                TRI-2026-0042
              </div>
              <div className="text-sm font-semibold text-[#172B3A]">
                Investment Scam
              </div>
              <div className="text-base font-extrabold text-[#172B3A] font-mono mt-0.5">
                ₹1,85,000
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#F7F9FB] border border-[#DCE4EA] text-[11px] space-y-1 text-[#5F6B76]">
              <div className="flex justify-between">
                <span>Trail:</span>
                <span className="font-semibold text-[#172B3A]">3 Hops (Mule A → B → C)</span>
              </div>
              <div className="flex justify-between">
                <span>Predicted Zone:</span>
                <span className="font-semibold text-[#0D4778]">T. Nagar Corridor (78%)</span>
              </div>
              <div className="flex justify-between">
                <span>Window:</span>
                <span className="font-semibold text-[#F58220]">14:20 – 15:05 IST</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleOpenDemoCase}
            className="w-full mt-3 py-2.5 bg-[#1769AA] hover:bg-[#0D4778] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>OPEN DEMO CASE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
