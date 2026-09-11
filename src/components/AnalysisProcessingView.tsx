import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  MapPin,
  Coins,
  ShieldCheck,
  Zap,
  Activity,
  GitFork,
  FileText,
} from 'lucide-react';
import { CybercrimeComplaint } from '../types';
import { generateCaseInference, CaseInferenceOutput } from '../services/inferenceEngine';
import { dataRepository } from '../services/dataRepository';

interface AnalysisProcessingViewProps {
  activeCase: CybercrimeComplaint;
  onComplete?: (updatedCase: CybercrimeComplaint) => void;
  onAnalysisComplete?: (updatedCase: CybercrimeComplaint) => void;
  onNavigateToOverview: () => void;
  onCancel?: () => void;
}

const STAGES = [
  {
    id: 1,
    num: '01',
    name: 'INGESTING COMPLAINT',
    desc: 'Validating complaint and transaction inputs...',
  },
  {
    id: 2,
    num: '02',
    name: 'BUILDING MONEY FLOW',
    desc: 'Constructing multi-hop transaction graph...',
  },
  {
    id: 3,
    num: '03',
    name: 'ANALYSING MULE RISK',
    desc: 'Evaluating account and network behaviour...',
  },
  {
    id: 4,
    num: '04',
    name: 'MATCHING HISTORICAL PATTERNS',
    desc: 'Finding similar synthetic fraud signatures...',
  },
  {
    id: 5,
    num: '05',
    name: 'FORECASTING CASH-OUT',
    desc: 'Estimating geography, time and withdrawal mode...',
  },
  {
    id: 6,
    num: '06',
    name: 'GENERATING INTELLIGENCE',
    desc: 'Calculating confidence and risk zones...',
  },
];

export const AnalysisProcessingView: React.FC<AnalysisProcessingViewProps> = ({
  activeCase,
  onComplete,
  onAnalysisComplete,
  onNavigateToOverview,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(12);
  const [isDone, setIsDone] = useState(false);
  const [inferenceResult, setInferenceResult] = useState<CaseInferenceOutput | null>(null);

  const onCompleteRef = useRef(onComplete || onAnalysisComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete || onAnalysisComplete;
  }, [onComplete, onAnalysisComplete]);

  useEffect(() => {
    // Generate the deterministic inference
    const output = generateCaseInference(activeCase);
    setInferenceResult(output);

    let stage = 0;
    const totalStages = STAGES.length;

    // Run sequential steps
    const interval = setInterval(() => {
      stage += 1;
      if (stage < totalStages) {
        setCurrentStageIndex(stage);
        setProgress(Math.round(((stage + 1) / totalStages) * 100));
      } else {
        clearInterval(interval);
        setCurrentStageIndex(totalStages - 1);
        setProgress(100);
        setIsDone(true);

        // Persist the inference to repository
        const updated = dataRepository.saveCaseInference(activeCase.id, output);
        if (updated && typeof onCompleteRef.current === 'function') {
          setTimeout(() => {
            onCompleteRef.current?.(updated);
          }, 50);
        }
      }
    }, 600);

    return () => clearInterval(interval);
  }, [activeCase.id]);

  const p = inferenceResult?.prediction;
  const topZone = p?.whereZones?.[0];
  const topMode = p?.howModes?.[0];

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-5 animate-fadeIn">
      {/* Title block */}
      <div className="bg-white border border-[#DCE4EA] rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DCE4EA]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF4FB] border border-[#1769AA]/30 flex items-center justify-center text-[#1769AA]">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#1769AA] uppercase tracking-wider">
                TRINETRA INVESTIGATION ENGINE
              </div>
              <h1 className="text-xl font-extrabold text-[#0D4778]">
                {isDone ? 'ANALYSIS COMPLETE' : `Analysing Case ${activeCase.id}`}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#F7F9FB] border border-[#DCE4EA] text-xs font-mono font-bold text-[#172B3A]">
              {activeCase.id}
            </span>
            <span className="text-xs text-[#5F6B76] font-medium">
              {activeCase.fraudCategory} • ₹{activeCase.fraudAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* High-level investigation pipeline strip */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-1 text-[11px] font-semibold text-[#5F6B76]">
          <span className="text-[#1769AA] font-bold">Complaint</span>
          <span>→</span>
          <span className={currentStageIndex >= 1 ? 'text-[#1769AA] font-bold' : ''}>Graph</span>
          <span>→</span>
          <span className={currentStageIndex >= 2 ? 'text-[#1769AA] font-bold' : ''}>Mule Risk</span>
          <span>→</span>
          <span className={currentStageIndex >= 3 ? 'text-[#1769AA] font-bold' : ''}>Pattern Match</span>
          <span>→</span>
          <span className={currentStageIndex >= 4 ? 'text-[#1769AA] font-bold' : ''}>Forecast</span>
          <span>→</span>
          <span className={currentStageIndex >= 5 ? 'text-[#138A44] font-bold' : ''}>Intelligence</span>
        </div>

        {/* Progress bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-[#172B3A]">
            <span>Inference Progress</span>
            <span className="font-mono text-[#1769AA]">{progress}%</span>
          </div>
          <div className="w-full bg-[#E5E9EE] h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isDone ? 'bg-[#138A44]' : 'bg-[#1769AA]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 6 Sequential Stages Card */}
      <div className="bg-white border border-[#DCE4EA] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#5F6B76]">
          Multi-Stage Analytical Pipeline
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STAGES.map((stage, idx) => {
            const isFinished = idx < currentStageIndex || isDone;
            const isCurrent = idx === currentStageIndex && !isDone;

            return (
              <div
                key={stage.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isFinished
                    ? 'bg-[#F7FBF8] border-[#138A44]/30'
                    : isCurrent
                    ? 'bg-[#EAF4FB] border-[#1769AA] shadow-xs'
                    : 'bg-[#F7F9FB] border-[#DCE4EA]/60 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                        isFinished
                          ? 'bg-[#EAF7EF] text-[#138A44]'
                          : isCurrent
                          ? 'bg-[#1769AA] text-white'
                          : 'bg-[#DCE4EA] text-[#5F6B76]'
                      }`}
                    >
                      {stage.num}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isFinished
                          ? 'text-[#065F46]'
                          : isCurrent
                          ? 'text-[#0D4778]'
                          : 'text-[#5F6B76]'
                      }`}
                    >
                      {stage.name}
                    </span>
                  </div>

                  {isFinished && (
                    <CheckCircle2 className="w-4 h-4 text-[#138A44] shrink-0" />
                  )}
                  {isCurrent && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1769AA] animate-ping shrink-0" />
                  )}
                </div>

                <p className="text-[11px] text-[#5F6B76] mt-1.5 pl-7">
                  {stage.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Live Metrics During Processing */}
        <div className="pt-3 border-t border-[#DCE4EA]">
          <span className="text-[10px] font-bold uppercase text-[#5F6B76] tracking-wider block mb-2">
            Execution Telemetry
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-[#F7F9FB] p-2.5 rounded-lg border border-[#DCE4EA]">
              <span className="text-[10px] text-[#5F6B76] block">Transactions Analysed:</span>
              <span className="font-mono font-bold text-sm text-[#0D4778]">
                {inferenceResult?.metrics.transactionsAnalysed ?? 14}
              </span>
            </div>
            <div className="bg-[#F7F9FB] p-2.5 rounded-lg border border-[#DCE4EA]">
              <span className="text-[10px] text-[#5F6B76] block">Graph Nodes:</span>
              <span className="font-mono font-bold text-sm text-[#0D4778]">
                {inferenceResult?.metrics.graphNodes ?? 5}
              </span>
            </div>
            <div className="bg-[#F7F9FB] p-2.5 rounded-lg border border-[#DCE4EA]">
              <span className="text-[10px] text-[#5F6B76] block">Hop Depth:</span>
              <span className="font-mono font-bold text-sm text-[#0D4778]">
                {inferenceResult?.metrics.hopDepth ?? 3} Hops
              </span>
            </div>
            <div className="bg-[#F7F9FB] p-2.5 rounded-lg border border-[#DCE4EA]">
              <span className="text-[10px] text-[#5F6B76] block">Patterns Compared:</span>
              <span className="font-mono font-bold text-sm text-[#0D4778]">
                {inferenceResult?.metrics.historicalPatternsCompared ?? 128} Cases
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* When complete: Display Compact Result Summary & View Full Investigation button */}
      {isDone && (
        <div className="bg-[#F7FBF8] border-2 border-[#138A44]/40 rounded-2xl p-5 sm:p-6 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 text-[#138A44]">
            <CheckCircle2 className="w-5 h-5" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#065F46]">
              ANALYSIS COMPLETE — PREDICTIVE INTELLIGENCE READY
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <div className="bg-white p-2.5 rounded-xl border border-[#DCE4EA]">
              <span className="text-[10px] uppercase font-bold text-[#5F6B76] block">OVERALL RISK</span>
              <span
                className={`text-xs font-extrabold mt-0.5 block ${
                  inferenceResult?.overallRisk === 'CRITICAL' || inferenceResult?.overallRisk === 'HIGH'
                    ? 'text-rose-700'
                    : 'text-amber-700'
                }`}
              >
                {inferenceResult?.overallRisk}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-[#DCE4EA]">
              <span className="text-[10px] uppercase font-bold text-[#5F6B76] block">HIGH-RISK MULE</span>
              <span className="text-xs font-bold text-[#172B3A] mt-0.5 block truncate" title={inferenceResult?.highestRiskMule.accountId}>
                {inferenceResult?.highestRiskMule.score}/100 Risk
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-[#DCE4EA]">
              <span className="text-[10px] uppercase font-bold text-[#5F6B76] block">WHERE</span>
              <span className="text-xs font-bold text-[#0D4778] mt-0.5 block truncate" title={topZone?.name}>
                {topZone?.name.split(' ')[0]} Hub
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-[#DCE4EA]">
              <span className="text-[10px] uppercase font-bold text-[#5F6B76] block">WHEN</span>
              <span className="text-xs font-mono font-bold text-[#172B3A] mt-0.5 block truncate">
                {topZone?.withdrawalWindow.split(' ')[0] || '14:20'}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-[#DCE4EA]">
              <span className="text-[10px] uppercase font-bold text-[#5F6B76] block">HOW</span>
              <span className="text-xs font-bold text-[#138A44] mt-0.5 block truncate">
                {topMode?.mode || 'ATM Withdrawal'}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-[#DCE4EA]">
              <span className="text-[10px] uppercase font-bold text-[#5F6B76] block">CONFIDENCE</span>
              <span className="text-xs font-mono font-bold text-[#0D4778] mt-0.5 block">
                {p?.confidenceMetrics?.predictionConfidence || 78}%
              </span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onNavigateToOverview}
              className="px-5 py-2.5 rounded-xl bg-[#1769AA] hover:bg-[#0D4778] text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <span>VIEW FULL INVESTIGATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
