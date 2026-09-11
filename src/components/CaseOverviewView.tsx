import React, { useState } from 'react';
import {
  GitFork,
  Sparkles,
  MapPin,
  FileText,
  RotateCw,
  Play,
  Clock,
  Coins,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { CybercrimeComplaint, NavigationTab } from '../types';

interface CaseOverviewViewProps {
  activeCase?: CybercrimeComplaint;
  caseItem?: CybercrimeComplaint;
  onNavigate: (tab: NavigationTab) => void;
  onStartInvestigation: () => void;
  onReRunAnalysis: () => void;
}

export const CaseOverviewView: React.FC<CaseOverviewViewProps> = ({
  activeCase: propActiveCase,
  caseItem: propCaseItem,
  onNavigate,
  onStartInvestigation,
  onReRunAnalysis,
}) => {
  const currentCase = propActiveCase || propCaseItem;
  const [showConfirmReRun, setShowConfirmReRun] = useState(false);

  if (!currentCase) {
    return (
      <div className="max-w-6xl mx-auto p-8 bg-white border border-[#DCE4EA] rounded-2xl text-center space-y-3">
        <p className="text-sm text-[#5F6B76]">No active case selected.</p>
        <button
          onClick={() => onNavigate('cases')}
          className="px-4 py-2 bg-[#1769AA] text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          View Case Register
        </button>
      </div>
    );
  }

  const hasPrediction = !!currentCase.prediction;
  const p = currentCase.prediction;
  const topZone = p?.whereZones?.[0];
  const topMode = p?.howModes?.[0];

  const handleConfirmReRun = () => {
    setShowConfirmReRun(false);
    onReRunAnalysis();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-fadeIn">
      {/* Top Bar with Back to Cases */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('cases')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#1769AA] hover:text-[#0D4778] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Case Register</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#5F6B76]">Analysis Status:</span>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              hasPrediction
                ? 'bg-[#EAF7EF] text-[#138A44] border-[#138A44]/30'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
          >
            {hasPrediction ? 'COMPLETED' : 'NOT STARTED'}
          </span>
        </div>
      </div>

      {/* Case Header Card */}
      <div className="bg-white border border-[#DCE4EA] rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DCE4EA]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#EAF4FB] text-[#1769AA] font-mono font-bold text-sm border border-[#1769AA]/30">
                {currentCase.id}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                {currentCase.fraudCategory}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  currentCase.overallRisk === 'CRITICAL' || currentCase.overallRisk === 'HIGH'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {currentCase.overallRisk} RISK
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0D4778] tracking-tight">
              ₹{currentCase.fraudAmount.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="text-xs space-y-1 text-slate-600 sm:text-right">
            <div>
              <span className="text-[#5F6B76]">Jurisdiction: </span>
              <span className="font-semibold text-[#172B3A]">{currentCase.victimRegion}</span>
            </div>
            <div>
              <span className="text-[#5F6B76]">Remittance: </span>
              <span className="font-semibold text-[#172B3A]">{currentCase.paymentMethod}</span>
            </div>
            <div>
              <span className="text-[#5F6B76]">Incident Time: </span>
              <span className="font-mono text-[#172B3A]">{currentCase.complaintDate}</span>
            </div>
          </div>
        </div>

        {/* Narrative */}
        <p className="text-xs text-[#5F6B76] pt-3 leading-relaxed">
          {currentCase.complaintNarrative}
        </p>
      </div>

      {/* STATE A: NO PREDICTIVE ANALYSIS AVAILABLE */}
      {!hasPrediction && (
        <div className="bg-white border-2 border-dashed border-[#DCE4EA] rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle className="w-7 h-7" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-lg font-bold text-[#0D4778]">
              NO PREDICTIVE ANALYSIS AVAILABLE
            </h2>
            <p className="text-xs text-[#5F6B76] leading-relaxed">
              Complaint has been successfully registered. Run the TRINETRA investigation engine to trace the multi-hop money flow, assess mule account risk, and predict the cash-out perimeter.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onStartInvestigation}
              className="px-6 py-3 rounded-xl bg-[#1769AA] hover:bg-[#0D4778] text-white font-bold text-sm inline-flex items-center gap-2.5 transition-colors cursor-pointer shadow-md"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>START INVESTIGATION</span>
            </button>
          </div>
        </div>
      )}

      {/* STATE B: PREDICTIVE INTELLIGENCE SUMMARY AVAILABLE */}
      {hasPrediction && (
        <>
          {/* Compact Intelligence Summary Card */}
          <div className="bg-white border-2 border-[#1769AA]/30 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DCE4EA]">
              <div>
                <span className="text-[10px] font-bold text-[#1769AA] tracking-wider uppercase">
                  CALCULATED INTELLIGENCE SUMMARY
                </span>
                <h2 className="text-base font-bold text-[#0D4778]">
                  Predictive Analysis Overview
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#5F6B76]">Generated:</span>
                <span className="text-xs font-mono text-[#172B3A]">
                  {p?.generatedAt ? new Date(p.generatedAt).toLocaleTimeString('en-IN') : 'Recent'}
                </span>
              </div>
            </div>

            {/* 6 Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Money Flow */}
              <div className="p-3.5 bg-[#F7F9FB] rounded-xl border border-[#DCE4EA] space-y-1">
                <span className="text-[10px] font-bold text-[#5F6B76] uppercase tracking-wider block">
                  MONEY FLOW
                </span>
                <div className="text-xs font-bold text-[#0D4778] flex items-center gap-1.5 flex-wrap">
                  <span>Victim</span>
                  <span className="text-[#1769AA]">→</span>
                  <span>Mule A</span>
                  <span className="text-[#1769AA]">→</span>
                  <span>Mule B</span>
                  <span className="text-[#1769AA]">→</span>
                  <span className="text-rose-700">Mule C</span>
                </div>
                <span className="text-[11px] text-[#5F6B76] block">
                  3 hops across {currentCase.transactions?.length || 4} verified transactions
                </span>
              </div>

              {/* Mule Risk */}
              <div className="p-3.5 bg-[#F7F9FB] rounded-xl border border-[#DCE4EA] space-y-1">
                <span className="text-[10px] font-bold text-[#5F6B76] uppercase tracking-wider block">
                  MULE RISK
                </span>
                <div className="text-xs font-bold text-rose-700 flex items-center justify-between">
                  <span>Terminal Aggregator (Mule C)</span>
                  <span className="font-mono text-sm">87 / 100</span>
                </div>
                <span className="text-[11px] text-[#5F6B76] block">
                  Rapid funneling without onward inter-bank transmission
                </span>
              </div>

              {/* Where */}
              <div className="p-3.5 bg-[#F7F9FB] rounded-xl border border-[#DCE4EA] space-y-1">
                <span className="text-[10px] font-bold text-[#5F6B76] uppercase tracking-wider block">
                  WHERE (PRIMARY ZONE)
                </span>
                <div className="text-xs font-bold text-[#0D4778] flex items-center justify-between">
                  <span>{topZone?.name || 'T. Nagar Corridor'}</span>
                  <span className="font-mono text-sm text-[#1769AA]">{topZone?.confidencePercent || 78}%</span>
                </div>
                <span className="text-[11px] text-[#5F6B76] block">
                  {topZone?.city}, {topZone?.state} ({topZone?.atmDensityScore || 'High density'})
                </span>
              </div>

              {/* When */}
              <div className="p-3.5 bg-[#F7F9FB] rounded-xl border border-[#DCE4EA] space-y-1">
                <span className="text-[10px] font-bold text-[#5F6B76] uppercase tracking-wider block">
                  WHEN (WITHDRAWAL WINDOW)
                </span>
                <div className="text-xs font-mono font-bold text-[#172B3A] flex items-center justify-between">
                  <span>{topZone?.withdrawalWindow ? topZone.withdrawalWindow.split('(')[0] : '14:20 – 15:05 IST'}</span>
                </div>
                <span className="text-[11px] text-rose-700 font-semibold block">
                  Estimated {p?.whenWindow?.estimatedMinMinutes || 25}–{p?.whenWindow?.estimatedMaxMinutes || 55} min post-transfer
                </span>
              </div>

              {/* How */}
              <div className="p-3.5 bg-[#F7F9FB] rounded-xl border border-[#DCE4EA] space-y-1">
                <span className="text-[10px] font-bold text-[#5F6B76] uppercase tracking-wider block">
                  HOW (LIKELY MODE)
                </span>
                <div className="text-xs font-bold text-[#138A44] flex items-center justify-between">
                  <span>{topMode?.mode || 'ATM Withdrawal'}</span>
                  <span className="font-mono text-sm">{topMode?.probabilityPercent || 64}%</span>
                </div>
                <span className="text-[11px] text-[#5F6B76] block">
                  Secondary mode: Further Transfer (26%)
                </span>
              </div>

              {/* Confidence */}
              <div className="p-3.5 bg-[#F7F9FB] rounded-xl border border-[#DCE4EA] space-y-1">
                <span className="text-[10px] font-bold text-[#5F6B76] uppercase tracking-wider block">
                  CONFIDENCE SCORE
                </span>
                <div className="text-xs font-bold text-[#0D4778] flex items-center justify-between">
                  <span>Ensemble Calibration</span>
                  <span className="font-mono text-sm text-[#1769AA]">
                    {p?.confidenceMetrics?.predictionConfidence || 78}%
                  </span>
                </div>
                <span className="text-[11px] text-[#138A44] font-semibold block">
                  Strength: {p?.confidenceMetrics?.evidenceStrength || 'STRONG'}
                </span>
              </div>
            </div>
          </div>

          {/* 4 Large Action Cards (Requirement 9) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. TRANSACTION NETWORK */}
            <div
              onClick={() => onNavigate('transaction-network')}
              className="bg-white border border-[#DCE4EA] hover:border-[#1769AA] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#EAF4FB] text-[#1769AA] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <GitFork className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#0D4778] group-hover:text-[#1769AA] transition-colors">
                  TRANSACTION NETWORK
                </h3>
                <p className="text-xs text-[#5F6B76] leading-relaxed">
                  Interactive multi-hop money flow graph showing victim, intermediaries, and terminal aggregator mule.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-[#1769AA] group-hover:translate-x-1 transition-transform">
                <span>Inspect Flow Graph</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 2. PREDICTION DETAILS */}
            <div
              onClick={() => onNavigate('prediction')}
              className="bg-white border border-[#DCE4EA] hover:border-[#F58220] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#FFF3E8] text-[#F58220] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#0D4778] group-hover:text-[#F58220] transition-colors">
                  PREDICTION DETAILS
                </h3>
                <p className="text-xs text-[#5F6B76] leading-relaxed">
                  Where, When, How forecasts with feature contribution weights and historical similarity benchmarks.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-[#F58220] group-hover:translate-x-1 transition-transform">
                <span>View Predictions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 3. DIGITAL NAKABANDI */}
            <div
              onClick={() => onNavigate('digital-nakabandi')}
              className="bg-white border border-[#DCE4EA] hover:border-[#138A44] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#EAF7EF] text-[#138A44] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#0D4778] group-hover:text-[#138A44] transition-colors">
                  DIGITAL NAKABANDI
                </h3>
                <p className="text-xs text-[#5F6B76] leading-relaxed">
                  Geospatial risk perimeter map, ranked cash-out zones, and tactical field patrol directions.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-[#138A44] group-hover:translate-x-1 transition-transform">
                <span>Explore Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 4. INTELLIGENCE REPORT */}
            <div
              onClick={() => onNavigate('reports')}
              className="bg-white border border-[#DCE4EA] hover:border-[#0D4778] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#F7F9FB] text-[#0D4778] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#DCE4EA]">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#0D4778] transition-colors">
                  INTELLIGENCE REPORT
                </h3>
                <p className="text-xs text-[#5F6B76] leading-relaxed">
                  Decision support dossier, printable court/nodal report export, and investigator outcome logging.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-[#0D4778] group-hover:translate-x-1 transition-transform">
                <span>View Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Secondary Action: RE-RUN ANALYSIS (Requirement 9 & 10) */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setShowConfirmReRun(true)}
              className="px-4 py-2 rounded-xl bg-[#F7F9FB] hover:bg-[#DCE4EA] text-[#5F6B76] hover:text-[#172B3A] border border-[#DCE4EA] text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#1769AA]" />
              <span>RE-RUN ANALYSIS</span>
            </button>
          </div>
        </>
      )}

      {/* Confirmation Dialog for RE-RUN ANALYSIS (Requirement 10) */}
      {showConfirmReRun && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-[#DCE4EA] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#EAF4FB] text-[#1769AA] flex items-center justify-center border border-[#1769AA]/30">
              <RotateCw className="w-5 h-5 animate-spin" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-[#0D4778]">
                Re-run TRINETRA Analysis?
              </h3>
              <p className="text-xs text-[#5F6B76] leading-relaxed">
                Re-run TRINETRA analysis using the currently available case data? This will re-execute the 6-stage inference pipeline and refresh all time windows and scores.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowConfirmReRun(false)}
                className="px-4 py-2 rounded-xl border border-[#DCE4EA] text-xs font-bold text-[#5F6B76] hover:bg-[#F7F9FB] transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmReRun}
                className="px-4 py-2 rounded-xl bg-[#1769AA] hover:bg-[#0D4778] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                RE-RUN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
