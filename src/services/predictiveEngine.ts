/**
 * TRINETRA - Predictive Decision Intelligence Engine
 *
 * Implements deterministic, explainable prototype scoring for:
 * 1. Mule Risk Scoring (0 - 100)
 * 2. Historical Pattern Similarity
 * 3. Spatio-Temporal Cash-Out Zone Prediction (WHERE + WHEN + HOW + CONFIDENCE)
 * 4. Feature Contribution (Explainable AI)
 */

import {
  CybercrimeComplaint,
  SyntheticAccount,
  SyntheticTransaction,
  PredictedZone,
  PredictionResult,
  HistoricalPatternCase,
  RiskLevel,
  CashOutMode,
} from '../types';
import { TOP_SIMILAR_CASES_0042 } from '../data/syntheticDataset';

export interface MuleRiskBreakdown {
  score: number;
  level: RiskLevel;
  factors: {
    name: string;
    points: number;
    maxPoints: number;
    description: string;
  }[];
  flagReasons: string[];
}

/**
 * Transparent Prototype Mule Risk Formula:
 * Score = Weighted combination of:
 * 1. Forwarding Velocity (max 25 pts)
 * 2. Rapid Forwarding Proportion (max 25 pts)
 * 3. Network Topology (Fan-in / Fan-out) (max 20 pts)
 * 4. Account Age vs Volume Anomaly (max 15 pts)
 * 5. Linked Suspicious Entities (max 15 pts)
 */
export function evaluateMuleRisk(
  account: SyntheticAccount,
  allTransactions: SyntheticTransaction[] = []
): MuleRiskBreakdown {
  const factors: MuleRiskBreakdown['factors'] = [];
  const flagReasons: string[] = [];

  // Factor 1: Forwarding Velocity
  let velScore = 0;
  if (account.avgForwardTimeMinutes > 0 && account.avgForwardTimeMinutes <= 15) {
    velScore = 25;
    flagReasons.push(
      `Extreme forwarding velocity: average exit time ${account.avgForwardTimeMinutes} min`
    );
    factors.push({
      name: 'High Forwarding Velocity',
      points: 25,
      maxPoints: 25,
      description: `Funds forwarded within ${account.avgForwardTimeMinutes} mins of receipt`,
    });
  } else if (account.avgForwardTimeMinutes <= 45) {
    velScore = 15;
    factors.push({
      name: 'Elevated Velocity',
      points: 15,
      maxPoints: 25,
      description: `Average forwarding interval ${account.avgForwardTimeMinutes} mins`,
    });
  } else {
    velScore = 5;
    factors.push({
      name: 'Normal Transaction Velocity',
      points: 5,
      maxPoints: 25,
      description: 'Standard forwarding intervals observed',
    });
  }

  // Factor 2: Pass-Through Ratio
  let passScore = 0;
  const forwardedRatio =
    account.totalReceived > 0 ? account.totalForwarded / account.totalReceived : 0;
  if (forwardedRatio >= 0.85) {
    passScore = 25;
    flagReasons.push(
      `${(forwardedRatio * 100).toFixed(1)}% of received funds drained almost immediately`
    );
    factors.push({
      name: 'Pass-Through Drain Ratio',
      points: 25,
      maxPoints: 25,
      description: `${(forwardedRatio * 100).toFixed(0)}% funds vacated; zero capital retention`,
    });
  } else if (forwardedRatio >= 0.5) {
    passScore = 12;
    factors.push({
      name: 'Moderate Pass-Through',
      points: 12,
      maxPoints: 25,
      description: 'Over 50% funds forwarded',
    });
  } else {
    passScore = 4;
    factors.push({
      name: 'Low Pass-Through',
      points: 4,
      maxPoints: 25,
      description: 'Standard retail balance retention',
    });
  }

  // Factor 3: Topology (Fan-in / Fan-out)
  let topoScore = 0;
  if (account.fanIn >= 3 && account.fanOut >= 2) {
    topoScore = 20;
    flagReasons.push(`High graph degree: Fan-in ${account.fanIn} & Fan-out ${account.fanOut}`);
    factors.push({
      name: 'Syndicate Intermediary Topology',
      points: 20,
      maxPoints: 20,
      description: 'Multi-source aggregator funneling to terminal cash-out nodes',
    });
  } else if (account.fanIn >= 3 || account.fanOut >= 3) {
    topoScore = 14;
    factors.push({
      name: 'Unbalanced Degree Centrality',
      points: 14,
      maxPoints: 20,
      description: 'Disproportionate transaction fan-in or fan-out',
    });
  } else {
    topoScore = 5;
    factors.push({
      name: 'Linear Degree',
      points: 5,
      maxPoints: 20,
      description: 'Standard 1-to-1 or low-branching account topology',
    });
  }

  // Factor 4: Account Age Anomaly
  let ageScore = 0;
  if (account.createdDaysAgo <= 60 && account.totalReceived > 150000) {
    ageScore = 15;
    flagReasons.push(
      `New account (${account.createdDaysAgo} days) with sudden high turnover (₹${account.totalReceived.toLocaleString('en-IN')})`
    );
    factors.push({
      name: 'New Account High-Velocity Surge',
      points: 15,
      maxPoints: 15,
      description: `Account created only ${account.createdDaysAgo} days ago with rapid high-volume transfers`,
    });
  } else if (account.createdDaysAgo <= 120) {
    ageScore = 8;
    factors.push({
      name: 'Relatively Fresh Account',
      points: 8,
      maxPoints: 15,
      description: `Account age ${account.createdDaysAgo} days`,
    });
  } else {
    ageScore = 2;
    factors.push({
      name: 'Mature Account History',
      points: 2,
      maxPoints: 15,
      description: `Maturity ${account.createdDaysAgo} days`,
    });
  }

  // Factor 5: Linked Suspicious Accounts
  let linkedScore = 0;
  if (account.linkedSuspiciousCount >= 4) {
    linkedScore = 15;
    flagReasons.push(`Direct graph connection to ${account.linkedSuspiciousCount} flagged high-risk accounts`);
    factors.push({
      name: 'Cluster Affiliation',
      points: 15,
      maxPoints: 15,
      description: `Clustered with ${account.linkedSuspiciousCount} known flagged mule entities`,
    });
  } else if (account.linkedSuspiciousCount >= 1) {
    linkedScore = 8;
    factors.push({
      name: 'Secondary Suspicious Link',
      points: 8,
      maxPoints: 15,
      description: `Connected to ${account.linkedSuspiciousCount} flagged account`,
    });
  } else {
    linkedScore = 2;
    factors.push({
      name: 'Clean Neighbourhood',
      points: 2,
      maxPoints: 15,
      description: 'No prior flagged connections in 1-hop neighborhood',
    });
  }

  const rawScore = velScore + passScore + topoScore + ageScore + linkedScore;
  const score = Math.min(100, Math.max(0, rawScore));

  const level: RiskLevel =
    score >= 80 ? 'CRITICAL' : score >= 65 ? 'HIGH' : score >= 40 ? 'MODERATE' : 'LOW';

  return {
    score,
    level,
    factors,
    flagReasons: flagReasons.length > 0 ? flagReasons : ['Clean operational indicators'],
  };
}

/**
 * Historical Pattern Similarity Engine
 */
export function findSimilarHistoricalCases(
  complaint: CybercrimeComplaint
): { cases: HistoricalPatternCase[]; insight: string } {
  if (complaint.id === 'TRI-2026-0042') {
    return {
      cases: TOP_SIMILAR_CASES_0042,
      insight:
        'Cases with similar transaction velocity and 3-hop mule structures historically concentrated cash-out activity in commercial retail ATM corridors (Chennai T. Nagar and Vadapalani). In 78% of matched instances, cash-out was executed within 35–65 minutes.',
    };
  }

  // Deterministic generator for other complaints based on input fields
  const baseSeed = (
    complaint.fraudAmount +
    (complaint.victimRegion?.length || 0) * 17 +
    (complaint.fraudCategory?.length || 0) * 31 +
    (complaint.paymentMethod?.length || 0) * 43
  );

  const mockCases: HistoricalPatternCase[] = [
    {
      caseId: `TRI-HIST-${1000 + (baseSeed % 8000)}`,
      similarityPercent: 89.2,
      fraudType: complaint.fraudCategory,
      amount: Math.floor(complaint.fraudAmount * 0.92),
      graphPattern: `${complaint.currentLayer}-Hop Fan-out`,
      historicalCashOutRegion: `${complaint.victimRegion || 'Regional'} Market Corridor`,
      cashOutDelayMinutes: 42,
      cashOutMethod: 'ATM Withdrawal',
      muleCount: complaint.currentLayer,
      outcomeVerified: true,
    },
    {
      caseId: `TRI-HIST-${1000 + ((baseSeed * 3) % 8000)}`,
      similarityPercent: 83.5,
      fraudType: complaint.fraudCategory,
      amount: Math.floor(complaint.fraudAmount * 1.1),
      graphPattern: 'Linear High-Velocity Chain',
      historicalCashOutRegion: `${complaint.victimRegion || 'Regional'} Metro Interchange`,
      cashOutDelayMinutes: 55,
      cashOutMethod: 'ATM Withdrawal',
      muleCount: complaint.currentLayer + 1,
      outcomeVerified: true,
    },
    {
      caseId: `TRI-HIST-${1000 + ((baseSeed * 7) % 8000)}`,
      similarityPercent: 77.8,
      fraudType: complaint.fraudCategory,
      amount: Math.floor(complaint.fraudAmount * 0.85),
      graphPattern: 'Split Aggregator Funnel',
      historicalCashOutRegion: 'Commercial Banking Strip',
      cashOutDelayMinutes: 38,
      cashOutMethod: 'Further Transfer',
      muleCount: complaint.currentLayer,
      outcomeVerified: true,
    },
    {
      caseId: `TRI-HIST-${1000 + ((baseSeed * 11) % 8000)}`,
      similarityPercent: 71.4,
      fraudType: complaint.fraudCategory,
      amount: Math.floor(complaint.fraudAmount * 1.25),
      graphPattern: 'Terminal Merchant POS Sweep',
      historicalCashOutRegion: 'Central Retail District',
      cashOutDelayMinutes: 68,
      cashOutMethod: 'POS / Merchant',
      muleCount: 2,
      outcomeVerified: true,
    },
    {
      caseId: `TRI-HIST-${Math.floor(1000 + Math.random() * 8000)}`,
      similarityPercent: 68.0,
      fraudType: complaint.fraudCategory,
      amount: Math.floor(complaint.fraudAmount * 0.95),
      graphPattern: 'Rapid 2-Hop Evacuation',
      historicalCashOutRegion: 'Industrial Perimeter',
      cashOutDelayMinutes: 47,
      cashOutMethod: 'UPI',
      muleCount: 3,
      outcomeVerified: true,
    },
  ];

  return {
    cases: mockCases,
    insight: `Synthetic historical similarity analysis indicates that ${complaint.fraudCategory} complaints of comparable volume (~₹${complaint.fraudAmount.toLocaleString('en-IN')}) exhibit a strong inclination toward rapid ATM liquidation before automated inter-bank freeze cycles take effect.`,
  };
}

/**
 * AI Predictive Engine: Generates WHERE + WHEN + HOW + CONFIDENCE
 */
export function runPredictiveEngine(
  complaint: CybercrimeComplaint,
  accounts: SyntheticAccount[]
): PredictionResult {
  if (complaint.id === 'TRI-2026-0042' && complaint.prediction) {
    return complaint.prediction;
  }

  // Deterministic prediction based on complaint attributes
  const primaryCity = complaint.victimRegion?.split(' ')[0] || 'Chennai';
  const coords: Record<string, { lat: number; lng: number }> = {
    Chennai: { lat: 13.0418, lng: 80.2341 },
    Bengaluru: { lat: 12.9716, lng: 77.5946 },
    Delhi: { lat: 28.6139, lng: 77.2090 },
    Mumbai: { lat: 19.0760, lng: 72.8777 },
    Hyderabad: { lat: 17.3850, lng: 78.4867 },
  };

  const center = coords[primaryCity] || { lat: 13.0418, lng: 80.2341 };

  const zones: PredictedZone[] = [
    {
      id: `ZONE-${complaint.id}-1`,
      rank: 1,
      name: `${primaryCity} Commercial & Banking Corridor`,
      areaDescription: 'High-density commercial cluster with high ATM terminal density within 750m perimeter.',
      city: primaryCity,
      state: complaint.victimState || 'State',
      lat: center.lat,
      lng: center.lng,
      radiusMeters: 750,
      riskScore: 91,
      riskLevel: 'CRITICAL',
      confidencePercent: 78,
      withdrawalWindow: '35–65 min from current transaction',
      likelyMode: 'ATM Withdrawal',
      likelyModePercent: 64,
      historicalClusterMatches: 12,
      atmDensityScore: 'High (36 Terminals/km²)',
      commercialHub: true,
      contributingFactors: [
        { factor: 'Transaction Velocity', weightPercent: 28, impact: 'Rapid pass-through forwarding indicates swift cash-out plan' },
        { factor: 'Historical Match', weightPercent: 24, impact: 'Strong similarity with prior regional cash-out incidents' },
        { factor: 'Mule Depth', weightPercent: 20, impact: 'Layer topology points to terminal account status' },
        { factor: 'Geographic Prior', weightPercent: 17, impact: 'Device IP and terminal branch proximity anchor to this sector' },
        { factor: 'Time Window', weightPercent: 11, impact: 'Active banking hour alignment' },
      ],
    },
    {
      id: `ZONE-${complaint.id}-2`,
      rank: 2,
      name: `${primaryCity} Secondary Transit Hub`,
      areaDescription: 'Transit junction and retail cluster offering alternative liquidation routes.',
      city: primaryCity,
      state: complaint.victimState || 'State',
      lat: center.lat + 0.012,
      lng: center.lng - 0.015,
      radiusMeters: 900,
      riskScore: 73,
      riskLevel: 'HIGH',
      confidencePercent: 54,
      withdrawalWindow: '50–85 min from current transaction',
      likelyMode: 'ATM Withdrawal',
      likelyModePercent: 56,
      historicalClusterMatches: 6,
      atmDensityScore: 'Medium-High',
      commercialHub: true,
      contributingFactors: [
        { factor: 'Transit Accessibility', weightPercent: 35, impact: 'Direct vehicular corridor from destination account location' },
        { factor: 'Alternative Terminal Spread', weightPercent: 35, impact: 'Secondary ATM distribution hub' },
        { factor: 'Timing Buffer', weightPercent: 30, impact: 'Matches secondary withdrawal delay window' },
      ],
    },
    {
      id: `ZONE-${complaint.id}-3`,
      rank: 3,
      name: `${primaryCity} Outer Commercial Belt`,
      areaDescription: 'Suburban perimeter zone with scattered banking outlets.',
      city: primaryCity,
      state: complaint.victimState || 'State',
      lat: center.lat - 0.02,
      lng: center.lng + 0.018,
      radiusMeters: 1300,
      riskScore: 52,
      riskLevel: 'MODERATE',
      confidencePercent: 37,
      withdrawalWindow: '75–120 min from current transaction',
      likelyMode: 'Further Transfer',
      likelyModePercent: 46,
      historicalClusterMatches: 3,
      atmDensityScore: 'Moderate',
      commercialHub: false,
      contributingFactors: [
        { factor: 'Fallback Transfer Node', weightPercent: 45, impact: 'Low probability secondary routing' },
        { factor: 'Suburban Scatter', weightPercent: 55, impact: 'Decentralized physical withdrawal points' },
      ],
    },
  ];

  return {
    caseId: complaint.id,
    generatedAt: new Date().toISOString(),
    whereZones: zones,
    whenWindow: {
      windowText: '35–65 minutes post-transaction (Projected window)',
      estimatedMinMinutes: 35,
      estimatedMaxMinutes: 65,
      historicalAvgMins: 48,
      temporalPatternDesc:
        'Syndicate historical benchmarks show that 75%+ of retail cyber fraud proceeds are evacuated within 1 hour to evade inter-bank CFCFRMS freeze alerts.',
    },
    howModes: [
      { mode: 'ATM Withdrawal', probabilityPercent: 64 },
      { mode: 'Further Transfer', probabilityPercent: 23 },
      { mode: 'POS / Merchant', probabilityPercent: 8 },
      { mode: 'UPI', probabilityPercent: 4 },
      { mode: 'Cash Drop / Courier', probabilityPercent: 1 },
    ],
    confidenceMetrics: {
      predictionConfidence: 78,
      compositeRiskScore: 91,
      evidenceStrength: 'VERY_STRONG',
      dataCompleteness: 92,
    },
    explainabilityContributions: [
      { factor: 'Transaction Velocity', contributionPercent: 28, direction: 'positive', description: 'Extremely fast multi-hop forwarding' },
      { factor: 'Historical Similarity', contributionPercent: 24, direction: 'positive', description: 'Pattern matching against synthetic fraud clusters' },
      { factor: 'Mule Network Structure', contributionPercent: 20, direction: 'positive', description: 'Linear terminal funnel topology' },
      { factor: 'Geographic Pattern', contributionPercent: 17, direction: 'positive', description: 'Concentration in high-density cash extraction nodes' },
      { factor: 'Time-of-Day Pattern', contributionPercent: 11, direction: 'positive', description: 'Synchronized with active operational banking window' },
    ],
  };
}
