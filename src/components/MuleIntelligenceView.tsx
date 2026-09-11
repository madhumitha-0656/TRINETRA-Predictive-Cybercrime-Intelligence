import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Info,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  TrendingUp,
  Clock,
  Coins,
  Activity,
  UserCheck,
} from 'lucide-react';
import { SyntheticAccount } from '../types';
import { SYNTHETIC_ACCOUNTS } from '../data/syntheticDataset';

interface MuleIntelligenceViewProps {
  accounts?: SyntheticAccount[];
  onSelectAccount?: (account: SyntheticAccount) => void;
  onNavigate?: (viewId: any) => void;
}

export const MuleIntelligenceView: React.FC<MuleIntelligenceViewProps> = ({
  accounts = SYNTHETIC_ACCOUNTS,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailedIndicators, setShowDetailedIndicators] = useState(false);
  const [showAccountSelector, setShowAccountSelector] = useState(false);

  const safeAccounts = accounts || SYNTHETIC_ACCOUNTS;

  // Selected account for deep-dive, default to Mule C (featured flagship)
  const defaultMuleC =
    safeAccounts.find((a) => a.id === 'ACC-MULE-C-42') ||
    safeAccounts.find((a) => a.nodeType === 'High-Risk Mule') ||
    safeAccounts[0];

  const [inspectedAccount, setInspectedAccount] = useState<SyntheticAccount>(defaultMuleC);

  // Top 4 Strongest Reasons (User Requirement 4)
  const top4Reasons = [
    'Account dormancy followed by sudden high-velocity transfers',
    '92% pass-through forwarding pattern without capital retention',
    'ATM card activated / PIN reset shortly before funds arrival',
    'High graph betweenness centrality in syndicate transaction flow',
  ];

  // Secondary indicators for expandable section
  const secondaryIndicators = [
    'IP log geolocation matches commercial banking cluster in T. Nagar',
    'Co-transacted with 2 flagged accounts in syndicate cluster #SYNTH-SYND-09',
    'Dormant account activated 14 days prior with zero prior merchant transaction history',
    'Disproportionate fan-in (6 inbound lines) with single-session terminal drain',
  ];

  // Feature contribution factors
  const featureContributions = [
    { feature: 'Pass-Through Velocity (<14 min forward)', contribution: 32, color: '#DC2626' },
    { feature: 'Sudden Dormancy Wake-Up & Volume Spike', contribution: 26, color: '#DC2626' },
    { feature: 'ATM Card Activation & PIN Reset Proximity', contribution: 22, color: '#F58220' },
    { feature: 'Graph Betweenness Centrality (Terminal Funnel)', contribution: 20, color: '#1769AA' },
  ];

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="bg-white border border-[#DCE4EA] rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded bg-[#EAF4FB] text-[#1769AA] text-xs font-mono font-bold border border-[#1769AA]/30">
              ACC-MULE-C-42
            </span>
            <span className="text-xs text-[#5F6B76]">
              Target Account Intelligence • Layer 3 Terminal Aggregator
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#0D4778]">
            Mule Behavioral Intelligence & Profiling
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAccountSelector(!showAccountSelector)}
            className="px-3 py-1.5 rounded-lg bg-[#F7F9FB] hover:bg-[#DCE4EA] text-[#172B3A] border border-[#DCE4EA] font-medium text-xs transition-colors cursor-pointer"
          >
            {showAccountSelector ? 'Hide Account List' : 'Switch Account'}
          </button>
          <button
            onClick={() => onNavigate?.('predictive-engine')}
            className="px-3.5 py-1.5 bg-[#1769AA] hover:bg-[#0D4778] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>Run Cash-Out Prediction</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Account Switcher Drawer (Collapsible) */}
      {showAccountSelector && (
        <div className="bg-white border border-[#DCE4EA] rounded-xl p-3 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0D4778]">Select Account for Profiling:</span>
            <input
              type="text"
              placeholder="Search account ID or bank..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs px-2.5 py-1 rounded border border-[#DCE4EA] bg-[#F7F9FB] w-48 focus:outline-none focus:border-[#1769AA]"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {safeAccounts
              .filter(
                (a) =>
                  a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  a.bankName.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => {
                    setInspectedAccount(acc);
                    setShowAccountSelector(false);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-medium border cursor-pointer ${
                    inspectedAccount.id === acc.id
                      ? 'bg-[#1769AA] text-white border-[#0D4778]'
                      : 'bg-[#F7F9FB] text-[#172B3A] border-[#DCE4EA] hover:bg-[#EAF4FB]'
                  }`}
                >
                  {acc.id} ({acc.bankName.split(' ')[0]}) - Risk {acc.riskScore}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* PRIMARY ACCOUNT CARD (User Requirement 4) */}
      <div className="bg-white border-2 border-[#1769AA]/40 rounded-xl p-4 sm:p-5 shadow-xs">
        {/* Core Account Header Information */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-[#DCE4EA]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-base text-[#0D4778]">
                {inspectedAccount.id}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                Risk Tier: HIGH
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAF4FB] text-[#1769AA] font-semibold border border-[#1769AA]/30">
                Role: Terminal Mule / Aggregator
              </span>
            </div>
            <div className="text-sm font-semibold text-[#172B3A]">
              Account Holder: <span className="font-bold">V. P****l</span>
            </div>
            <div className="text-xs text-[#5F6B76]">
              Bank: <strong className="text-[#172B3A]">Axis Bank</strong> • Branch: <strong className="text-[#172B3A]">T. Nagar Usman Road</strong> (Chennai, Tamil Nadu)
            </div>
          </div>

          {/* Large Risk Score Display: 87 / 100 */}
          <div className="flex items-center gap-3 bg-[#F7F9FB] border border-[#DCE4EA] rounded-xl p-3 px-4 shrink-0">
            <div>
              <span className="text-[10px] font-bold text-[#5F6B76] uppercase tracking-wider block">
                MULE RISK SCORE
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black text-rose-700 font-mono">
                  87
                </span>
                <span className="text-sm font-bold text-[#5F6B76]">/ 100</span>
              </div>
            </div>
            <div className="h-9 w-px bg-[#DCE4EA]"></div>
            <div>
              <span className="text-[10px] font-bold text-[#5F6B76] uppercase tracking-wider block">
                EVALUATION
              </span>
              <span className="text-xs font-bold text-rose-700 block mt-0.5 px-2 py-0.5 bg-rose-50 rounded border border-rose-200">
                HIGH RISK
              </span>
            </div>
          </div>
        </div>

        {/* Two-Column Breakdown: Why Flagged (Left) + Feature Contributions (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-3.5">
          {/* Left Column: Top 4 Strongest Reasons */}
          <div className="lg:col-span-6 bg-[#F7F9FB] rounded-xl p-4 border border-[#DCE4EA] flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-[#0D4778] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#DC2626]" />
                WHY WAS THIS ACCOUNT FLAGGED?
              </h3>

              <ol className="space-y-2 text-xs text-[#172B3A]">
                {top4Reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-[#DCE4EA] shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-medium leading-relaxed">{reason}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Expandable Secondary Indicators */}
            <div className="mt-3 pt-3 border-t border-[#DCE4EA]">
              <button
                onClick={() => setShowDetailedIndicators(!showDetailedIndicators)}
                className="w-full py-1.5 px-2.5 bg-white hover:bg-[#EAF4FB] text-[#0D4778] border border-[#DCE4EA] rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Detailed Technical Indicators (Secondary)</span>
                {showDetailedIndicators ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {showDetailedIndicators && (
                <ul className="mt-2 space-y-1.5 text-[11px] text-[#5F6B76] bg-white p-2.5 rounded-lg border border-[#DCE4EA]">
                  {secondaryIndicators.map((ind, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#1769AA] font-bold">•</span>
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right Column: Feature Contributions to 87/100 */}
          <div className="lg:col-span-6 bg-[#F7F9FB] rounded-xl p-4 border border-[#DCE4EA] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-[#0D4778] uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#1769AA]" />
                  FEATURE CONTRIBUTION TO RISK SCORE
                </h3>
                <span className="text-[10px] text-[#5F6B76]">Calibrated Weights</span>
              </div>
              <p className="text-[11px] text-[#5F6B76] mb-3 leading-relaxed">
                Empirical weights quantifying behavioural anomalies for terminal cash-out aggregation.
              </p>

              <div className="space-y-3">
                {featureContributions.map((fc, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-[#172B3A]">{fc.feature}</span>
                      <span className="font-mono font-bold text-[#0D4778]">+{fc.contribution}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${fc.contribution * 2.8}%`,
                          backgroundColor: fc.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Quick Flow Button */}
            <div className="mt-3 pt-3 border-t border-[#DCE4EA] flex items-center justify-between">
              <span className="text-[11px] text-[#5F6B76]">
                Terminal Mule Profile Validated
              </span>
              <button
                onClick={() => onNavigate?.('predictive-engine')}
                className="px-3.5 py-1.5 bg-[#1769AA] hover:bg-[#0D4778] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>Run Cash-Out Prediction</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
