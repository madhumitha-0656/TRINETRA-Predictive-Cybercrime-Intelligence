import React, { useState, useMemo } from 'react';
import {
  Compass,
  MapPin,
  Clock,
  Coins,
  ShieldAlert,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { CybercrimeComplaint, PredictedZone } from '../types';
import { LeafletRiskMap } from './LeafletRiskMap';
import { CaseHeader } from './CaseHeader';

interface DigitalNakabandiViewProps {
  activeCase: CybercrimeComplaint;
  onNavigate: (viewId: any) => void;
  selectedZone?: PredictedZone | null;
  onSelectZone?: (zone: PredictedZone) => void;
}

export const DigitalNakabandiView: React.FC<DigitalNakabandiViewProps> = ({
  activeCase,
  onNavigate,
  selectedZone: propSelectedZone,
  onSelectZone: propOnSelectZone,
}) => {
  // Ensure the 3 ranked zones match the user's explicit values for demo case, and dynamic for others
  const zones: PredictedZone[] = useMemo(() => {
    const rawZones = activeCase?.prediction?.whereZones || [];
    if (activeCase?.id === 'TRI-2026-0042' && rawZones.length >= 3) {
      return [
        {
          ...rawZones[0],
          rank: 1,
          name: 'T. Nagar Corridor',
          confidencePercent: 78,
          riskLevel: 'HIGH',
          city: 'Chennai',
          state: 'Tamil Nadu',
          withdrawalWindow: '14:20 – 15:05 IST',
          likelyMode: 'ATM Withdrawal',
          likelyModePercent: 64,
        },
        {
          ...rawZones[1],
          rank: 2,
          name: 'Guindy Region',
          confidencePercent: 54,
          riskLevel: 'HIGH',
          city: 'Chennai',
          state: 'Tamil Nadu',
          withdrawalWindow: '15:10 – 15:45 IST',
          likelyMode: 'ATM Withdrawal',
          likelyModePercent: 52,
        },
        {
          ...rawZones[2],
          rank: 3,
          name: 'Saidapet Region',
          confidencePercent: 37,
          riskLevel: 'MODERATE',
          city: 'Chennai',
          state: 'Tamil Nadu',
          withdrawalWindow: '15:30 – 16:15 IST',
          likelyMode: 'POS / Transfer',
          likelyModePercent: 41,
        },
      ];
    }
    return rawZones;
  }, [activeCase]);

  const [internalSelectedZone, setInternalSelectedZone] = useState<PredictedZone>(
    propSelectedZone || zones[0]
  );

  const selectedZone = propSelectedZone || internalSelectedZone || zones[0];

  const handleSelectZone = (zone: PredictedZone) => {
    setInternalSelectedZone(zone);
    if (propOnSelectZone) {
      propOnSelectZone(zone);
    }
  };

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto">
      {/* Persistent Case Header */}
      <CaseHeader
        activeCase={activeCase}
        onNavigate={onNavigate}
        currentView="digital-nakabandi"
      />

      {/* 1. Header & One-sentence explanation (User Requirement 14) */}
      <div className="bg-white border border-[#DCE4EA] rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded bg-[#EAF4FB] text-[#1769AA] text-xs font-mono font-bold border border-[#1769AA]/30">
              {activeCase.id}
            </span>
            <span className="text-xs font-bold text-[#1769AA] uppercase tracking-wider">
              GEOSPATIAL RISK PERIMETER
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0D4778]">
            DIGITAL NAKABANDI
          </h1>
          <p className="text-xs text-[#5F6B76] font-medium mt-0.5">
            Predictive Cash-Out Risk Perimeter
          </p>
        </div>

        <button
          onClick={() => onNavigate('reports')}
          className="px-4 py-2 bg-[#1769AA] hover:bg-[#0D4778] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0 self-start md:self-auto uppercase"
        >
          <span>Generate Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Main Content Grid: Map (67% width) + Intelligence Panel (33% width) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left: Map Canvas (8 cols out of 12 = ~67% width) */}
        <div className="lg:col-span-8 bg-white border border-[#DCE4EA] rounded-xl p-3 shadow-xs flex flex-col justify-between">
          {/* Legend Strip with 3 Ranked Zones */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-2.5 border-b border-[#DCE4EA] text-xs">
            <span className="font-bold text-[#0D4778] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#1769AA]" />
              THREE RANKED ZONES:
            </span>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-bold">
              {zones[0] && (
                <button
                  onClick={() => handleSelectZone(zones[0])}
                  className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 cursor-pointer transition-colors ${
                    selectedZone.rank === 1
                      ? 'bg-rose-50 border-rose-400 text-rose-800'
                      : 'bg-[#F7F9FB] border-[#DCE4EA] text-[#172B3A]'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span>
                  #1 {zones[0].name} ({zones[0].confidencePercent}%)
                </button>
              )}
              {zones[1] && (
                <button
                  onClick={() => handleSelectZone(zones[1])}
                  className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 cursor-pointer transition-colors ${
                    selectedZone.rank === 2
                      ? 'bg-orange-50 border-orange-400 text-orange-800'
                      : 'bg-[#F7F9FB] border-[#DCE4EA] text-[#172B3A]'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F58220]"></span>
                  #2 {zones[1].name} ({zones[1].confidencePercent}%)
                </button>
              )}
              {zones[2] && (
                <button
                  onClick={() => handleSelectZone(zones[2])}
                  className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 cursor-pointer transition-colors ${
                    selectedZone.rank === 3
                      ? 'bg-amber-50 border-amber-400 text-amber-800'
                      : 'bg-[#F7F9FB] border-[#DCE4EA] text-[#172B3A]'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]"></span>
                  #3 {zones[2].name} ({zones[2].confidencePercent}%)
                </button>
              )}
            </div>
          </div>

          {/* Leaflet Risk Map Canvas */}
          <div className="rounded-lg overflow-hidden border border-[#DCE4EA] mt-2.5">
            <LeafletRiskMap
              zones={zones}
              activeZoneId={selectedZone?.id}
              onSelectZone={handleSelectZone}
              height="470px"
            />
          </div>

          {/* Permanent Disclaimer (User Requirement 14) */}
          <div className="pt-2 text-center">
            <p className="text-[11px] text-[#5F6B76] font-medium bg-[#F7F9FB] py-1 px-3 rounded-md border border-[#DCE4EA] inline-block">
              ⚠️ Permanent notice: Probabilistic prototype forecast — not a confirmed criminal location.
            </p>
          </div>
        </div>

        {/* Right: Zone Intelligence Panel (4 cols) (User Requirement 14) */}
        <div className="lg:col-span-4 bg-white border border-[#DCE4EA] rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            {/* Header: Zone Identity */}
            <div className="pb-2.5 border-b border-[#DCE4EA]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6B76]">
                  ZONE INTELLIGENCE
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF4FB] text-[#1769AA] uppercase border border-[#1769AA]/30">
                  RANK #{selectedZone.rank}
                </span>
              </div>
              <h3 className="font-bold text-base text-[#0D4778]">
                {selectedZone.name}
              </h3>
              <p className="text-[11px] text-[#5F6B76] mt-0.5">
                {selectedZone.city}, {selectedZone.state} • {selectedZone.areaDescription}
              </p>
            </div>

            {/* Risk & Confidence Metric Row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                <span className="text-[10px] font-bold text-rose-800 uppercase block">
                  Risk Level
                </span>
                <div className="font-bold text-base text-rose-700 mt-0.5">
                  {selectedZone.rank === 1 ? 'HIGH RISK' : selectedZone.rank === 2 ? 'MEDIUM-HIGH' : 'MODERATE'}
                </div>
                <div className="text-[10px] text-rose-800 font-mono mt-0.5">
                  Score: {selectedZone.riskScore}/100
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#EAF4FB] border border-[#1769AA]/30">
                <span className="text-[10px] font-bold text-[#1769AA] uppercase block">
                  Confidence
                </span>
                <div className="font-bold text-base text-[#0D4778] font-mono mt-0.5">
                  {selectedZone.confidencePercent}%
                </div>
                <div className="text-[10px] text-[#1769AA] mt-0.5">
                  High statistical prior
                </div>
              </div>
            </div>

            {/* Expected Window & Likely Mode */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#F7F9FB] border border-[#DCE4EA]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#5F6B76] uppercase tracking-wider mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#F58220]" />
                  <span>EXPECTED WITHDRAWAL WINDOW</span>
                </div>
                <div className="font-mono font-bold text-sm text-[#172B3A]">
                  {selectedZone.withdrawalWindow}
                </div>
                <div className="text-[10px] text-[#5F6B76] mt-0.5">
                  Optimal intervention timeframe from final hop
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#F7F9FB] border border-[#DCE4EA]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#5F6B76] uppercase tracking-wider mb-1">
                  <Coins className="w-3.5 h-3.5 text-[#138A44]" />
                  <span>LIKELY CASH-OUT MODE</span>
                </div>
                <div className="font-bold text-sm text-[#138A44]">
                  {selectedZone.likelyMode} ({selectedZone.likelyModePercent}%)
                </div>
                <div className="text-[10px] text-[#5F6B76] mt-0.5">
                  ATM Cluster density: {selectedZone.atmDensityScore}
                </div>
              </div>

              {/* Historical Matches */}
              <div className="p-2.5 rounded-lg bg-[#F7F9FB] border border-[#DCE4EA]">
                <div className="text-[10px] font-bold text-[#5F6B76] uppercase tracking-wider mb-0.5">
                  HISTORICAL MATCHES
                </div>
                <div className="font-semibold text-xs text-[#172B3A]">
                  {selectedZone.historicalClusterMatches || 14} Prior Incidents in this Perimeter
                </div>
              </div>

              {/* Key Factors */}
              <div className="p-2.5 rounded-lg bg-[#FFF3E8] border border-[#F58220]/30">
                <div className="text-[10px] font-bold text-[#F58220] uppercase tracking-wider mb-1">
                  KEY CONTRIBUTING FACTORS:
                </div>
                <ul className="text-[11px] text-[#172B3A] space-y-0.5 list-disc list-inside">
                  <li>High ATM terminal density (&gt;20 active kiosks)</li>
                  <li>Historical syndicate cash-out pattern cluster</li>
                  <li>Rapid transit accessibility & highway interchange</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Button at bottom of side panel */}
          <div className="pt-3 mt-3 border-t border-[#DCE4EA]">
            <button
              onClick={() => onNavigate('reports')}
              className="w-full py-2.5 bg-[#1769AA] hover:bg-[#0D4778] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span>PROCEED TO INTELLIGENCE REPORT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
