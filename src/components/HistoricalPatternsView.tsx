import React, { useMemo } from 'react';
import {
  History,
  GitFork,
  MapPin,
  Clock,
  Coins,
  CheckCircle2,
  Info,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { CybercrimeComplaint } from '../types';
import { findSimilarHistoricalCases } from '../services/predictiveEngine';

interface HistoricalPatternsViewProps {
  activeCase: CybercrimeComplaint;
  onNavigate: (viewId: any) => void;
}

export const HistoricalPatternsView: React.FC<HistoricalPatternsViewProps> = ({
  activeCase,
  onNavigate,
}) => {
  const { cases } = useMemo(() => {
    return findSimilarHistoricalCases(activeCase);
  }, [activeCase]);

  // Top 5 similar cases (User Requirement 7)
  const top5Cases = cases.slice(0, 5);

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-[#DCE4EA] rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded bg-[#EAF4FB] text-[#1769AA] text-xs font-mono font-bold border border-[#1769AA]/30">
              {activeCase.id}
            </span>
            <span className="text-xs text-[#5F6B76]">
              Pattern Correlation Engine
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#0D4778]">
            TOP 5 SIMILAR CASES
          </h2>
        </div>

        <button
          onClick={() => onNavigate('case-intelligence')}
          className="px-3.5 py-1.5 bg-[#F7F9FB] hover:bg-[#DCE4EA] text-[#0D4778] border border-[#1769AA]/30 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Return to Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Exactly One Short Explanation (User Requirement 7) */}
      <div className="bg-[#EAF4FB] border border-[#1769AA]/30 rounded-xl p-3 shadow-2xs flex items-center gap-2.5 text-xs text-[#0D4778]">
        <Info className="w-4 h-4 text-[#1769AA] shrink-0" />
        <p className="font-medium leading-relaxed">
          “Similarity is derived from transaction velocity, graph structure, fraud category, amount range, temporal behaviour and geographic patterns.”
        </p>
      </div>

      {/* Clean Top 5 Cases Table (User Requirement 7) */}
      <div className="bg-white border border-[#DCE4EA] rounded-xl p-4 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F9FB] text-[#5F6B76] border-b border-[#DCE4EA]">
              <tr>
                <th className="py-2.5 px-3.5 font-semibold">Case ID</th>
                <th className="py-2.5 px-3.5 font-semibold">Similarity</th>
                <th className="py-2.5 px-3.5 font-semibold">Fraud Type</th>
                <th className="py-2.5 px-3.5 font-semibold">Mule Pattern</th>
                <th className="py-2.5 px-3.5 font-semibold">Cash-Out Delay</th>
                <th className="py-2.5 px-3.5 font-semibold">Region</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE4EA]">
              {top5Cases.map((hc, idx) => {
                const isClosest = idx === 0;
                return (
                  <tr
                    key={hc.caseId}
                    className={`transition-colors ${
                      isClosest
                        ? 'bg-[#EAF7EF]/50 hover:bg-[#EAF7EF]'
                        : 'hover:bg-[#F7F9FB]'
                    }`}
                  >
                    <td className="py-3 px-3.5 font-mono font-bold text-[#0D4778]">
                      <div className="flex items-center gap-2">
                        <span>{hc.caseId}</span>
                        {isClosest && (
                          <span className="px-2 py-0.2 rounded-full bg-[#138A44] text-white text-[9px] font-bold uppercase tracking-wider">
                            Closest Match
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#138A44]">
                          {hc.similarityPercent}%
                        </span>
                        <div className="w-16 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#138A44] rounded-full"
                            style={{ width: `${hc.similarityPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3.5 font-semibold text-[#172B3A]">
                      {hc.fraudType}
                    </td>
                    <td className="py-3 px-3.5 text-[#5F6B76]">
                      <span className="px-2 py-0.5 rounded bg-white border border-[#DCE4EA] font-medium text-[11px] text-[#172B3A]">
                        {hc.graphPattern}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="font-semibold text-rose-700">
                        {hc.cashOutDelayMinutes} min
                      </span>
                      <span className="text-[10px] text-[#5F6B76] block">
                        via {hc.cashOutMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 font-medium text-[#172B3A]">
                      {hc.withdrawalCity}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
