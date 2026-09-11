import React from 'react';
import {
  MapPin,
  Clock,
  Coins,
  ShieldCheck,
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  History,
} from 'lucide-react';
import { CybercrimeComplaint, PredictedZone } from '../types';
import { CaseHeader } from './CaseHeader';

interface PredictiveEngineViewProps {
  activeCase: CybercrimeComplaint;
  onNavigate: (viewId: any) => void;
  onSelectZone?: (zone: PredictedZone) => void;
}

export const PredictiveEngineView: React.FC<PredictiveEngineViewProps> = ({
  activeCase,
  onNavigate,
}) => {
  const isDemoCase = activeCase?.id === 'TRI-2026-0042';
  const prediction = activeCase?.prediction;
  const primaryZone = prediction?.whereZones?.[0];
  const primaryHow = prediction?.howModes?.[0];

  const zoneName = isDemoCase ? 'T. Nagar Corridor' : (primaryZone?.name || 'Identified Corridor');
  const zoneCityState = isDemoCase ? 'Chennai, Tamil Nadu' : `${primaryZone?.city || 'Chennai'}, ${primaryZone?.state || 'Tamil Nadu'}`;
  const windowText = isDemoCase ? '14:20 – 15:05 IST' : (prediction?.whenWindow?.expectedTimeRange || '14:20 – 15:05 IST');
  const remainingMinutes = isDemoCase ? 42 : (prediction?.whenWindow?.remainingMinutes || 40);
  const howName = isDemoCase ? 'ATM Withdrawal' : (primaryHow?.mode || 'ATM Withdrawal');
  const howPercent = isDemoCase ? 64 : (primaryHow?.probabilityPercent || 64);
  const confidenceScore = isDemoCase ? 78 : (prediction?.confidenceMetrics?.overallConfidenceScore || 78);

  const fraudCat = activeCase?.fraudCategory || 'Cyber Fraud';
  const fraudAmt = activeCase?.fraudAmount || 1850000;

  // Feature contribution weights (User Requirement 13)
  const contributions = [
    { factor: 'Transaction Velocity', weight: 28, color: '#DC2626' },
    { factor: 'Historical Similarity', weight: 24, color: '#F58220' },
    { factor: 'Mule Network Structure', weight: 20, color: '#1769AA' },
    { factor: 'Geographic Pattern', weight: 17, color: '#138A44' },
    { factor: 'Time-of-Day Pattern', weight: 11, color: '#6366F1' },
  ];

  // Top 3 Similar Synthetic Cases (User Requirement 13)
  const historicalSupportCases = [
    {
      caseId: 'TRI-2025-0819',
      similarity: '91%',
      outcome: `ATM cash-out at ${zoneName} within 48 mins`,
      category: fraudCat,
      amount: `₹${Math.round(fraudAmt * 0.9).toLocaleString('en-IN')}`,
    },
    {
      caseId: 'TRI-2025-0644',
      similarity: '86%',
      outcome: `ATM cash-out at ${zoneName} within 39 mins`,
      category: fraudCat,
      amount: `₹${Math.round(fraudAmt * 1.05).toLocaleString('en-IN')}`,
    },
    {
      caseId: 'TRI-2025-0412',
      similarity: '82%',
      outcome: 'ATM cash-out at adjacent corridor within 55 mins',
      category: fraudCat,
      amount: `₹${Math.round(fraudAmt * 0.75).toLocaleString('en-IN')}`,
    },
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Persistent Case Header */}
      <CaseHeader
        activeCase={activeCase}
        onNavigate={onNavigate}
        currentView="prediction"
      />

      {/* If analysis is not run yet */}
      {!prediction && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-3">
          <span className="text-xs font-medium">
            Analysis has not been run for this case yet. Predictive values below are initialized baseline indicators.
          </span>
          <button
            onClick={() => onNavigate('analysis-processing')}
            className="px-3.5 py-1.5 bg-[#1769AA] text-white rounded-lg text-xs font-bold hover:bg-[#0D4778] cursor-pointer whitespace-nowrap"
          >
            RUN INVESTIGATION NOW
          </button>
        </div>
      )}

      {/* 1. FIRST THING VISIBLE: 4 Large Cards (User Requirement 13) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* WHERE? */}
        <div className="bg-white border-2 border-[#1769AA]/40 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#5F6B76] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1769AA] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#1769AA]" />
              WHERE?
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold uppercase">
              HIGH RISK
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#0D4778] tracking-tight">
            {zoneName}
          </div>
          <p className="text-xs text-[#5F6B76] mt-0.5">
            {zoneCityState}
          </p>
          <div className="mt-2.5 pt-2 border-t border-[#DCE4EA] flex items-center justify-between text-[11px]">
            <span className="text-[#5F6B76]">Cluster:</span>
            <span className="font-semibold text-[#172B3A]">Commercial ATM Belt (24+ terminals)</span>
          </div>
        </div>

        {/* WHEN? */}
        <div className="bg-white border-2 border-[#F58220]/40 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#5F6B76] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F58220] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#F58220]" />
              WHEN?
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#FFF3E8] text-[#F58220] font-bold">
              WINDOW
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#172B3A] font-mono tracking-tight">
            {windowText}
          </div>
          <p className="text-xs text-rose-700 font-bold mt-0.5">
            {remainingMinutes} mins remaining
          </p>
          <div className="mt-2.5 pt-2 border-t border-[#DCE4EA] flex items-center justify-between text-[11px]">
            <span className="text-[#5F6B76]">Estimated Latency:</span>
            <span className="font-semibold text-[#172B3A]">35–45 mins from Hop 3</span>
          </div>
        </div>

        {/* HOW? */}
        <div className="bg-white border-2 border-[#138A44]/40 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#5F6B76] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#138A44] flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-[#138A44]" />
              HOW?
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#EAF7EF] text-[#138A44] font-bold font-mono">
              {howPercent}%
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#138A44] tracking-tight">
            {howName}
          </div>
          <p className="text-xs text-[#5F6B76] mt-0.5">
            Secondary: Further Transfer ({100 - howPercent}%)
          </p>
          <div className="mt-2.5 pt-2 border-t border-[#DCE4EA] flex items-center justify-between text-[11px]">
            <span className="text-[#5F6B76]">Modus Operandi:</span>
            <span className="font-semibold text-[#172B3A]">Debit Card / Multiple Swipes</span>
          </div>
        </div>

        {/* CONFIDENCE? */}
        <div className="bg-white border-2 border-[#1769AA]/40 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-[#5F6B76] mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1769AA] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1769AA]" />
              CONFIDENCE?
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#EAF4FB] text-[#1769AA] font-bold">
              MODEL SCORE
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#0D4778] font-mono tracking-tight">
            {confidenceScore}%
          </div>
          <p className="text-xs text-[#5F6B76] mt-0.5">
            High statistical confidence
          </p>
          <div className="mt-2.5 pt-2 border-t border-[#DCE4EA] flex items-center justify-between text-[11px]">
            <span className="text-[#5F6B76]">Ensemble Model:</span>
            <span className="font-semibold text-[#172B3A]">XGBoost + Graph Prior</span>
          </div>
        </div>
      </div>

      {/* 2. WHY THIS PREDICTION? (Contribution Graph) */}
      <div className="bg-white border border-[#DCE4EA] rounded-xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-[#DCE4EA]">
          <div>
            <h2 className="text-xs font-bold text-[#0D4778] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#1769AA]" />
              FEATURE CONTRIBUTION
            </h2>
          </div>
          <span className="text-xs font-mono font-semibold text-[#5F6B76]">
            Total: 100%
          </span>
        </div>

        <div className="space-y-3">
          {contributions.map((c) => (
            <div key={c.factor} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#172B3A]">{c.factor}</span>
                <span className="font-mono font-bold text-[#0D4778]">{c.weight}%</span>
              </div>
              <div className="h-2 w-full bg-[#F7F9FB] border border-[#DCE4EA] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${c.weight}%`, backgroundColor: c.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. HISTORICAL SUPPORT (Similar Synthetic Cases - User Requirement 13) */}
      <div className="bg-white border border-[#DCE4EA] rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#DCE4EA]">
          <div className="flex items-center gap-1.5">
            <History className="w-4 h-4 text-[#1769AA]" />
            <h2 className="text-xs font-bold text-[#0D4778] uppercase tracking-wider">
              HISTORICAL SUPPORT — TOP 3 SIMILAR SYNTHETIC CASES
            </h2>
          </div>
          <span className="text-[11px] text-[#5F6B76]">
            k-NN Cosine Similarity on graph topology & transaction velocity
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F9FB] text-[#5F6B76] border-b border-[#DCE4EA]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Case ID</th>
                <th className="py-2.5 px-3 font-semibold">Fraud Type & Amount</th>
                <th className="py-2.5 px-3 font-semibold">Similarity</th>
                <th className="py-2.5 px-3 font-semibold">Historical Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE4EA]">
              {historicalSupportCases.map((h) => (
                <tr key={h.caseId} className="hover:bg-[#EAF4FB]/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#0D4778]">
                    {h.caseId}
                  </td>
                  <td className="py-2.5 px-3 text-[#172B3A]">
                    <span className="font-semibold">{h.category}</span>
                    <span className="text-[#5F6B76] ml-1.5 font-mono">({h.amount})</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#EAF4FB] text-[#1769AA] font-mono font-bold">
                      {h.similarity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#138A44]">
                    {h.outcome}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. AT BOTTOM: Open Digital Nakabandi */}
      <div className="pt-2">
        <button
          onClick={() => onNavigate('digital-nakabandi')}
          className="w-full py-3 bg-[#1769AA] hover:bg-[#0D4778] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
        >
          <span>Open Digital Nakabandi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
