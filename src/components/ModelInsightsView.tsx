import React from 'react';
import {
  BarChart3,
  Target,
  Clock,
  Compass,
  CheckCircle,
  AlertTriangle,
  Info,
  Layers,
  Cpu,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { SYNTHETIC_MODEL_METRICS } from '../data/syntheticDataset';

export const ModelInsightsView: React.FC = () => {
  const m = SYNTHETIC_MODEL_METRICS;

  // Synthetic validation data for charts
  const accuracyByLayer = [
    { layer: 'Layer 1 (Hop 1)', top1: 62, top3: 79, avgDelay: 22 },
    { layer: 'Layer 2 (Hop 2)', top1: 69, top3: 84, avgDelay: 36 },
    { layer: 'Layer 3 (Hop 3)', top1: 74, top3: 90, avgDelay: 48 },
    { layer: 'Layer 4+ (Terminal)', top1: 78, top3: 93, avgDelay: 58 },
  ];

  const precisionRecallByThreshold = [
    { threshold: 'Score ≥ 50', precision: 71, recall: 94 },
    { threshold: 'Score ≥ 65', precision: 82, recall: 88 },
    { threshold: 'Score ≥ 75', precision: 86, recall: 82 },
    { threshold: 'Score ≥ 85', precision: 92, recall: 68 },
    { threshold: 'Score ≥ 95', precision: 97, recall: 45 },
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white border border-[#DCE4EA] rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-[#EAF4FB] text-[#1769AA] text-xs font-bold uppercase border border-[#1769AA]/30">
              Module 09
            </span>
            <span className="text-xs text-[#5F6B76]">
              Quantitative Evaluation & Benchmarking
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0D4778] tracking-tight">
            Model Insights & Evaluation Benchmark
          </h1>
          <p className="text-xs text-[#5F6B76] mt-0.5 max-w-3xl leading-relaxed">
            Performance metrics calculated exclusively across the synthetic validation partition (N={m.totalEvaluatedSyntheticCases} cases). No inflated claims or unverified operational accuracy.
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-[#FFF3E8] border border-[#F58220]/30 text-xs text-[#B45309] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#F58220] shrink-0" />
          <span className="font-semibold">SYNTHETIC VALIDATION (N={m.totalEvaluatedSyntheticCases})</span>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#DCE4EA] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[#5F6B76] mb-1">
            <span className="text-[11px] uppercase font-semibold">Top-1 Accuracy</span>
            <Target className="w-4 h-4 text-[#1769AA]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#0D4778]">
            {m.top1ZoneAccuracy}
          </div>
          <span className="text-[10px] text-[#5F6B76]">750m perimeter</span>
        </div>

        <div className="bg-white border border-[#DCE4EA] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[#5F6B76] mb-1">
            <span className="text-[11px] uppercase font-semibold">Top-3 Accuracy</span>
            <Compass className="w-4 h-4 text-[#138A44]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#138A44]">
            {m.top3ZoneAccuracy}
          </div>
          <span className="text-[10px] text-[#5F6B76]">Present in top 3 zones</span>
        </div>

        <div className="bg-white border border-[#DCE4EA] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[#5F6B76] mb-1">
            <span className="text-[11px] uppercase font-semibold">Median Distance Error</span>
            <Compass className="w-4 h-4 text-[#F58220]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#B45309]">
            {m.medianLocationErrorKm}
          </div>
          <span className="text-[10px] text-[#5F6B76]">Delta to actual cash-out</span>
        </div>

        <div className="bg-white border border-[#DCE4EA] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[#5F6B76] mb-1">
            <span className="text-[11px] uppercase font-semibold">Time MAE</span>
            <Clock className="w-4 h-4 text-[#1769AA]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#0D4778]">
            {m.timePredictionMaeMinutes}
          </div>
          <span className="text-[10px] text-[#5F6B76]">Mean absolute delay error</span>
        </div>

        <div className="bg-white border border-[#DCE4EA] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[#5F6B76] mb-1">
            <span className="text-[11px] uppercase font-semibold">Mule Precision</span>
            <CheckCircle className="w-4 h-4 text-[#1769AA]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#172B3A]">
            {m.muleDetectionPrecision}
          </div>
          <span className="text-[10px] text-[#5F6B76]">True positives ratio</span>
        </div>

        <div className="bg-white border border-[#DCE4EA] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[#5F6B76] mb-1">
            <span className="text-[11px] uppercase font-semibold">Mule Recall</span>
            <CheckCircle className="w-4 h-4 text-[#1769AA]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#172B3A]">
            {m.muleDetectionRecall}
          </div>
          <span className="text-[10px] text-[#5F6B76]">Flagged out of total</span>
        </div>

        <div className="bg-white border border-[#DCE4EA] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[#5F6B76] mb-1">
            <span className="text-[11px] uppercase font-semibold">Mule F1 Score</span>
            <CheckCircle className="w-4 h-4 text-[#138A44]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#138A44]">
            {m.f1Score}
          </div>
          <span className="text-[10px] text-[#5F6B76]">Harmonic balance</span>
        </div>

        <div className="bg-white border border-[#DCE4EA] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[#5F6B76] mb-1">
            <span className="text-[11px] uppercase font-semibold">Inference Latency</span>
            <Cpu className="w-4 h-4 text-[#1769AA]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#172B3A]">
            {m.avgInferenceLatencyMs}
          </div>
          <span className="text-[10px] text-[#5F6B76]">Mean pipeline runtime</span>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Accuracy progression by layer depth */}
        <div className="bg-white border border-[#DCE4EA] rounded-xl p-4 shadow-xs">
          <div className="mb-3">
            <h3 className="text-xs font-bold text-[#0D4778] uppercase tracking-wide">
              Spatio-Temporal Accuracy by Mule Hop Depth
            </h3>
            <p className="text-[11px] text-[#5F6B76]">
              As funds traverse towards terminal nodes, convergence accuracy increases
            </p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyByLayer} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="layer" tick={{ fontSize: 10, fill: '#5F6B76' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#5F6B76' }} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#DCE4EA',
                    color: '#172B3A',
                    fontSize: '11px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="top1" name="Top-1 Zone Accuracy (%)" fill="#1769AA" radius={[4, 4, 0, 0]} />
                <Bar dataKey="top3" name="Top-3 Zone Accuracy (%)" fill="#138A44" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Precision vs Recall by score threshold */}
        <div className="bg-white border border-[#DCE4EA] rounded-xl p-4 shadow-xs">
          <div className="mb-3">
            <h3 className="text-xs font-bold text-[#0D4778] uppercase tracking-wide">
              Mule Risk Threshold Operating Curve
            </h3>
            <p className="text-[11px] text-[#5F6B76]">
              Precision vs. Recall trade-off across 0–100 threshold cut-offs
            </p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={precisionRecallByThreshold} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="threshold" tick={{ fontSize: 10, fill: '#5F6B76' }} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 10, fill: '#5F6B76' }} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#DCE4EA',
                    color: '#172B3A',
                    fontSize: '11px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="precision"
                  name="Precision (%)"
                  stroke="#1769AA"
                  strokeWidth={2.5}
                />
                <Line
                  type="monotone"
                  dataKey="recall"
                  name="Recall (%)"
                  stroke="#F58220"
                  strokeWidth={2.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
