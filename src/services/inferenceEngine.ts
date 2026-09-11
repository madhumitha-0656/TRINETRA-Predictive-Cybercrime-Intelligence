import {
  CybercrimeComplaint,
  PredictionResult,
  PredictedZone,
  SyntheticAccount,
  SyntheticTransaction,
  RiskLevel,
  CashOutMode,
  HistoricalPatternCase,
  FraudCategory,
} from '../types';
import {
  DEMO_CASE_0042_PREDICTION,
  DEMO_CASE_TRANSACTIONS,
  DEMO_CASE_ACCOUNTS,
  TOP_SIMILAR_CASES_0042,
} from '../data/syntheticDataset';

export interface CaseInferenceOutput {
  prediction: PredictionResult;
  transactions: SyntheticTransaction[];
  accounts: SyntheticAccount[];
  overallRisk: RiskLevel;
  highestRiskMule: {
    name: string;
    accountId: string;
    score: number;
  };
  metrics: {
    transactionsAnalysed: number;
    graphNodes: number;
    hopDepth: number;
    historicalPatternsCompared: number;
  };
  historicalCases: HistoricalPatternCase[];
}

/**
 * Simple deterministic string hashing helper.
 * Produces a stable 32-bit positive integer seed from any input string.
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash >>> 0);
}

/**
 * Generate deterministic, case-dependent prototype prediction and money trail
 * based on the entered complaint features.
 */
export function generateCaseInference(complaint: Partial<CybercrimeComplaint>): CaseInferenceOutput {
  const caseId = complaint.id || 'TRI-2026-0099';

  // 1. TRI-2026-0042 must retain its existing saved result
  if (caseId === 'TRI-2026-0042') {
    return {
      prediction: DEMO_CASE_0042_PREDICTION,
      transactions: DEMO_CASE_TRANSACTIONS,
      accounts: DEMO_CASE_ACCOUNTS,
      overallRisk: 'CRITICAL',
      highestRiskMule: {
        name: 'Mule Account C (Terminal Node)',
        accountId: 'ACC-MULE-C-42',
        score: 87,
      },
      metrics: {
        transactionsAnalysed: 4,
        graphNodes: 5,
        hopDepth: 3,
        historicalPatternsCompared: 1420,
      },
      historicalCases: TOP_SIMILAR_CASES_0042,
    };
  }

  // 2. Extract the 6 deterministic factors required for new-case generation:
  // - fraud type
  // - amount
  // - payment method
  // - complaint time
  // - victim region
  // - entered transaction trail
  const category = (complaint.fraudCategory || 'Investment Scam') as FraudCategory;
  const amount = Number(complaint.fraudAmount) || 125000;
  const paymentMethod = (complaint.paymentMethod || 'IMPS via NetBanking').trim();
  const complaintTime = (complaint.complaintDate || complaint.initialTransactionTime || '2026-09-04 14:00 IST').trim();
  const region = (complaint.victimRegion || 'Chennai (Central)').trim();
  const rawDestAccount = (complaint.destinationAccount || 'ACC-MULE-D1').trim();
  const txnTrail = (
    complaint.transactionReference ||
    rawDestAccount ||
    (complaint.transactions?.map((t) => t.id).join(',')) ||
    'TXN-TRAIL-DEFAULT'
  ).trim();

  // Deterministic seed composed strictly of the 6 required factors:
  const seedString = `${category}#${amount}#${paymentMethod}#${complaintTime}#${region}#${txnTrail}`;
  const seed = hashString(seedString);

  // 3. Calculate Overall Risk Level from amount and category
  let overallRisk: RiskLevel = 'HIGH';
  if (amount >= 250000 || (category === 'Investment Scam' && amount >= 150000)) {
    overallRisk = 'CRITICAL';
  } else if (amount >= 75000 || category === 'Phishing') {
    overallRisk = 'HIGH';
  } else if (amount >= 30000) {
    overallRisk = 'MODERATE';
  } else {
    overallRisk = 'LOW';
  }

  // 2. Select Regional Coordinates & Hubs based on victim region or deterministic city assignment
  const lowerRegion = region.toLowerCase();
  let city = 'Chennai';
  let state = 'Tamil Nadu';
  let baseLat = 13.0418;
  let baseLng = 80.2341;
  let primaryZoneName = 'T. Nagar Commercial Corridor';
  let zone2Name = 'Guindy Industrial & Transit Sector';
  let zone3Name = 'Saidapet Commercial Belt';

  if (lowerRegion.includes('anna nagar') || lowerRegion.includes('roundtana')) {
    primaryZoneName = 'Anna Nagar 2nd Avenue Commercial Hub';
    zone2Name = 'Kilpauk Medical & Banking Cluster';
    zone3Name = 'Koyambedu Wholesale & Transit Terminal';
    baseLat = 13.0850;
    baseLng = 80.2100;
  } else if (lowerRegion.includes('mylapore') || lowerRegion.includes('luz') || lowerRegion.includes('mandaveli')) {
    primaryZoneName = 'Mylapore Kutchery Road & Luz Corner';
    zone2Name = 'Alwarpet TTK Road Corridor';
    zone3Name = 'Royapettah Commercial Strip';
    baseLat = 13.0330;
    baseLng = 80.2690;
  } else if (lowerRegion.includes('velachery') || lowerRegion.includes('taramani')) {
    primaryZoneName = 'Velachery Vijaya Nagar Transit Hub';
    zone2Name = 'Taramani IT Corridor Terminal';
    zone3Name = 'Madipakkam Main Road Commercial Sector';
    baseLat = 12.9815;
    baseLng = 80.2180;
  } else if (lowerRegion.includes('guindy') || lowerRegion.includes('kathipara')) {
    primaryZoneName = 'Guindy Kathipara Interchange Corridor';
    zone2Name = 'Ekkatuthangal Commercial Belt';
    zone3Name = 'Saidapet Anna Salai Axis';
    baseLat = 13.0067;
    baseLng = 80.2025;
  } else if (lowerRegion.includes('tambaram') || lowerRegion.includes('chromepet')) {
    primaryZoneName = 'Tambaram GST Road Commercial Corridor';
    zone2Name = 'Chromepet Station Road Hub';
    zone3Name = 'Sanatorium Transit Interchange';
    baseLat = 12.9250;
    baseLng = 80.1250;
  } else if (lowerRegion.includes('bengaluru') || lowerRegion.includes('bangalore') || lowerRegion.includes('koramangala')) {
    city = 'Bengaluru';
    state = 'Karnataka';
    primaryZoneName = 'Koramangala 80ft Road Commercial Corridor';
    zone2Name = 'Indiranagar 100ft Road Retail Sector';
    zone3Name = 'BTM Layout 2nd Stage Financial Cluster';
    baseLat = 12.9352;
    baseLng = 77.6245;
  } else if (lowerRegion.includes('hyderabad') || lowerRegion.includes('secunderabad')) {
    city = 'Hyderabad';
    state = 'Telangana';
    primaryZoneName = 'Madhapur Cyber Towers Transit Zone';
    zone2Name = 'Ameerpet Commercial & Education Hub';
    zone3Name = 'Banjara Hills Road No. 12 Financial Belt';
    baseLat = 17.4483;
    baseLng = 78.3748;
  } else if (lowerRegion.includes('mumbai') || lowerRegion.includes('pune')) {
    city = 'Mumbai';
    state = 'Maharashtra';
    primaryZoneName = 'BKC Commercial Finance Sector';
    zone2Name = 'Dadar Station Commercial Perimeter';
    zone3Name = 'Andheri East Station Road Hub';
    baseLat = 19.0607;
    baseLng = 72.8644;
  } else {
    // Deterministic selection from 4 curated Chennai hubs based on seed
    const zoneSets = [
      {
        city: 'Chennai',
        state: 'Tamil Nadu',
        z1: 'T. Nagar Commercial Corridor',
        z2: 'Guindy Transit & Metro Axis',
        z3: 'Saidapet Bazaar Perimeter',
        lat: 13.0418,
        lng: 80.2341,
      },
      {
        city: 'Chennai',
        state: 'Tamil Nadu',
        z1: 'Anna Nagar West Commercial Hub',
        z2: 'Shenoy Nagar Metro Perimeter',
        z3: 'Kilpauk Garden Sector',
        lat: 13.0850,
        lng: 80.2100,
      },
      {
        city: 'Chennai',
        state: 'Tamil Nadu',
        z1: 'Adyar Sardar Patel Road Corridor',
        z2: 'Besant Nagar Commercial Beach Road',
        z3: 'Thiruvanmiyur ECR Junction',
        lat: 13.0012,
        lng: 80.2565,
      },
      {
        city: 'Chennai',
        state: 'Tamil Nadu',
        z1: 'Parry\'s Corner Financial District',
        z2: 'George Town Commercial Bazaar',
        z3: 'Royapuram Transit Perimeter',
        lat: 13.0900,
        lng: 80.2880,
      },
    ];
    const chosen = zoneSets[seed % zoneSets.length];
    city = chosen.city;
    state = chosen.state;
    primaryZoneName = chosen.z1;
    zone2Name = chosen.z2;
    zone3Name = chosen.z3;
    baseLat = chosen.lat;
    baseLng = chosen.lng;
  }

  // 4. Time Window Calculation
  // Derived deterministically from complaint time or fallback
  const startOffset = 25 + (seed % 20); // e.g. 25-45 mins
  const windowDuration = 35 + ((seed >> 2) % 25); // 35-60 min window
  const endOffset = startOffset + windowDuration;
  
  // Format window string directly from complaintTime
  let baseHour = 14;
  let baseMin = 0;
  const timeMatch = complaintTime.match(/(\d{1,2}):(\d{2})/);
  if (timeMatch) {
    baseHour = parseInt(timeMatch[1], 10);
    baseMin = parseInt(timeMatch[2], 10);
  } else {
    baseHour = 11 + (seed % 7);
    baseMin = (seed * 7) % 50;
  }

  const startTotalMin = (baseHour * 60 + baseMin + startOffset) % (24 * 60);
  const endTotalMin = (startTotalMin + windowDuration) % (24 * 60);
  const startH = String(Math.floor(startTotalMin / 60)).padStart(2, '0');
  const startM = String(startTotalMin % 60).padStart(2, '0');
  const endH = String(Math.floor(endTotalMin / 60)).padStart(2, '0');
  const endM = String(endTotalMin % 60).padStart(2, '0');
  const windowText = `${startH}:${startM} – ${endH}:${endM} IST`;

  // 4. Cash-Out Mode
  let likelyMode: CashOutMode = 'ATM Withdrawal';
  let modeProbability = 62 + (seed % 18); // 62 - 79%
  if (category === 'Loan Scam' || (category === 'Job Scam' && amount < 40000)) {
    likelyMode = 'Further Transfer';
    modeProbability = 55 + (seed % 15);
  } else if (category === 'Marketplace Fraud') {
    likelyMode = 'POS / Merchant';
    modeProbability = 58 + (seed % 14);
  } else if (category === 'UPI Fraud' && amount < 25000) {
    likelyMode = 'UPI';
    modeProbability = 65 + (seed % 12);
  }

  // 5. Prediction Confidence & Risk Scores
  const confidencePercent = Math.min(88, Math.max(68, 70 + ((seed >> 3) % 17)));
  const primaryRiskScore = overallRisk === 'CRITICAL' ? 91 : overallRisk === 'HIGH' ? 86 : 74;

  // 6. Where Zones Array (Primary + 2 Alternatives)
  const whereZones: PredictedZone[] = [
    {
      id: `ZONE-${caseId}-01`,
      rank: 1,
      name: primaryZoneName,
      areaDescription: `${primaryZoneName} high-density financial perimeter. 18+ active teller kiosks and commercial retail points within 800m.`,
      city,
      state,
      lat: baseLat,
      lng: baseLng,
      radiusMeters: 750,
      riskScore: primaryRiskScore,
      riskLevel: overallRisk,
      confidencePercent,
      withdrawalWindow: `${windowText} (Estimated ${startOffset}–${endOffset} min from current trail)`,
      likelyMode,
      likelyModePercent: modeProbability,
      historicalClusterMatches: 8 + (seed % 9),
      atmDensityScore: 'High density financial sector',
      commercialHub: true,
      contributingFactors: [
        { factor: 'Transaction Velocity', weightPercent: 28, impact: 'Rapid fund hop forwarding matches swift physical extraction' },
        { factor: 'Historical Pattern Recurrence', weightPercent: 25, impact: `High structural match with ${city} historical syndicates` },
        { factor: 'Mule Centrality Structure', weightPercent: 22, impact: 'Terminal aggregator node indicates imminent exit' },
        { factor: 'Geographic Prior', weightPercent: 15, impact: 'Clustered branch registration within targeted municipal sector' },
        { factor: 'Time-of-Day Window', weightPercent: 10, impact: 'Peak banking and market window before clearance audit' },
      ],
    },
    {
      id: `ZONE-${caseId}-02`,
      rank: 2,
      name: zone2Name,
      areaDescription: `Secondary fallback perimeter in ${zone2Name}. Transit interchange corridor.`,
      city,
      state,
      lat: baseLat + 0.015 * ((seed % 2 === 0) ? 1 : -1),
      lng: baseLng + 0.018 * ((seed % 3 === 0) ? 1 : -1),
      radiusMeters: 950,
      riskScore: Math.max(50, primaryRiskScore - 16),
      riskLevel: overallRisk === 'CRITICAL' ? 'HIGH' : 'MODERATE',
      confidencePercent: Math.max(42, confidencePercent - 22),
      withdrawalWindow: `${windowText} (Secondary fallback)`,
      likelyMode: likelyMode === 'ATM Withdrawal' ? 'Further Transfer' : 'ATM Withdrawal',
      likelyModePercent: 48,
      historicalClusterMatches: 4 + (seed % 5),
      atmDensityScore: 'Transit & commercial sector',
      commercialHub: true,
      contributingFactors: [
        { factor: 'Transit Dispersal', weightPercent: 35, impact: 'Interchange hub for secondary movement' },
        { factor: 'Secondary ATM Cluster', weightPercent: 35, impact: 'Alternative withdrawal point' },
        { factor: 'Branch Distance Variance', weightPercent: 30, impact: 'Intermediate fallback sector' },
      ],
    },
    {
      id: `ZONE-${caseId}-03`,
      rank: 3,
      name: zone3Name,
      areaDescription: `Outer perimeter in ${zone3Name}. Commercial retail and merchant hub.`,
      city,
      state,
      lat: baseLat - 0.022 * ((seed % 2 === 0) ? 1 : -1),
      lng: baseLng - 0.019 * ((seed % 3 === 0) ? 1 : -1),
      radiusMeters: 1200,
      riskScore: Math.max(35, primaryRiskScore - 30),
      riskLevel: 'MODERATE',
      confidencePercent: Math.max(32, confidencePercent - 38),
      withdrawalWindow: `${windowText} (Extended window)`,
      likelyMode: 'Further Transfer',
      likelyModePercent: 40,
      historicalClusterMatches: 2 + (seed % 4),
      atmDensityScore: 'Moderate commercial sector',
      commercialHub: false,
      contributingFactors: [
        { factor: 'Fall-Back Node', weightPercent: 45, impact: 'Syndicate secondary dispersion path' },
        { factor: 'Delayed Liquidation', weightPercent: 35, impact: 'Off-peak settlement routing' },
        { factor: 'Merchant Density', weightPercent: 20, impact: 'Retail store point of sale fallback' },
      ],
    },
  ];

  // 7. Prediction Result Object
  const prediction: PredictionResult = {
    caseId,
    generatedAt: new Date().toISOString(),
    whereZones,
    whenWindow: {
      windowText: `${windowText} (Estimated ${startOffset}–${endOffset} mins from last transaction stage)`,
      estimatedMinMinutes: startOffset,
      estimatedMaxMinutes: endOffset,
      historicalAvgMins: Math.round((startOffset + endOffset) / 2),
      temporalPatternDesc: `Across historical synthetic ${category} incidents in ${city}, ${confidencePercent}% of cash-out attempts occurred between ${startOffset} and ${endOffset} minutes post-transfer.`,
    },
    howModes: [
      { mode: likelyMode, probabilityPercent: modeProbability },
      {
        mode: likelyMode === 'ATM Withdrawal' ? 'Further Transfer' : 'ATM Withdrawal',
        probabilityPercent: Math.max(12, 100 - modeProbability - 12),
      },
      { mode: 'POS / Merchant', probabilityPercent: 8 },
      { mode: 'Other', probabilityPercent: 4 },
    ],
    confidenceMetrics: {
      predictionConfidence: confidencePercent,
      compositeRiskScore: primaryRiskScore,
      evidenceStrength: overallRisk === 'CRITICAL' ? 'VERY_STRONG' : 'STRONG',
      dataCompleteness: 92,
    },
    explainabilityContributions: [
      {
        factor: 'Transaction Velocity',
        contributionPercent: 28,
        direction: 'positive',
        description: 'Rapid forwarding through intermediary accounts indicates active automated syndicate routing.',
      },
      {
        factor: 'Historical Pattern Recurrence',
        contributionPercent: 25,
        direction: 'positive',
        description: `89.2% structural and feature similarity with known historical synthetic patterns in ${city}.`,
      },
      {
        factor: 'Mule Network Structure',
        contributionPercent: 22,
        direction: 'positive',
        description: 'High fan-in funneling into a terminal aggregator account without onward transfers.',
      },
      {
        factor: 'Geographic Prior',
        contributionPercent: 15,
        direction: 'positive',
        description: `Terminal account registered within high-density commercial ATM cluster of ${primaryZoneName}.`,
      },
      {
        factor: 'Time-of-Day Pattern',
        contributionPercent: 10,
        direction: 'positive',
        description: 'Mid-session banking hours before standard automated freeze alert triggers.',
      },
    ],
  };

  // 8. Generate Dedicated Money Flow Graph (Accounts & Transactions)
  const victimAccountId = `ACC-VICTIM-${caseId.replace(/[^0-9]/g, '') || '990'}`;
  const muleAId = rawDestAccount.startsWith('ACC-') ? rawDestAccount : `ACC-MULE-A-${caseId.replace(/[^0-9]/g, '') || '991'}`;
  const muleBId = `ACC-MULE-B-${caseId.replace(/[^0-9]/g, '') || '992'}`;
  const muleCId = `ACC-MULE-C-${caseId.replace(/[^0-9]/g, '') || '993'}`;
  const cashOutEndpointId = `ACC-CASHOUT-ENDPOINT-${caseId.replace(/[^0-9]/g, '') || '994'}`;

  const banks = ['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Canara Bank', 'Axis Bank', 'Punjab National Bank'];
  const victimBank = banks[seed % banks.length];
  const muleABank = banks[(seed + 1) % banks.length];
  const muleBBank = banks[(seed + 2) % banks.length];
  const muleCBank = banks[(seed + 3) % banks.length];

  const muleRiskA = 74 + (seed % 10);
  const muleRiskB = 81 + (seed % 9);
  const muleRiskC = 87 + (seed % 7); // Highest terminal mule

  const accounts: SyntheticAccount[] = [
    {
      id: victimAccountId,
      bankName: victimBank,
      accountHolderMasked: 'Complainant (Victim Account)',
      branch: `${city} Central Branch`,
      city,
      state,
      accountType: 'Savings',
      createdDaysAgo: 1420,
      totalReceived: 0,
      totalForwarded: amount,
      avgForwardTimeMinutes: 0,
      fanIn: 1,
      fanOut: 1,
      riskScore: 6,
      riskLevel: 'LOW',
      nodeType: 'Victim',
      linkedSuspiciousCount: 0,
      flagReasons: ['Verified citizen complainant account'],
      historicalMatchesCount: 0,
    },
    {
      id: muleAId,
      bankName: muleABank,
      accountHolderMasked: 'Mule Layer 1 (Direct Recipient)',
      branch: `${city} East Branch`,
      city,
      state,
      accountType: 'Savings',
      createdDaysAgo: 45,
      totalReceived: amount * 1.8,
      totalForwarded: amount * 1.6,
      avgForwardTimeMinutes: 14,
      fanIn: 3,
      fanOut: 2,
      riskScore: muleRiskA,
      riskLevel: 'HIGH',
      nodeType: 'Suspected Mule',
      linkedSuspiciousCount: 3,
      flagReasons: ['Account opened <60 days ago', '92% funds forwarded within 15 minutes', 'Multiple unrelated credits'],
      historicalMatchesCount: 4,
    },
    {
      id: muleBId,
      bankName: muleBBank,
      accountHolderMasked: 'Mule Layer 2 (Intermediary Layer)',
      branch: `${city} South Hub`,
      city,
      state,
      accountType: 'Savings',
      createdDaysAgo: 28,
      totalReceived: amount * 2.4,
      totalForwarded: amount * 2.2,
      avgForwardTimeMinutes: 9,
      fanIn: 4,
      fanOut: 2,
      riskScore: muleRiskB,
      riskLevel: 'CRITICAL',
      nodeType: 'High-Risk Mule',
      linkedSuspiciousCount: 5,
      flagReasons: ['Rapid pass-through forwarding (<10 mins)', 'High betweenness centrality in fraud cluster'],
      historicalMatchesCount: 8,
    },
    {
      id: muleCId,
      bankName: muleCBank,
      accountHolderMasked: 'Mule Layer 3 (Terminal Aggregator)',
      branch: `${primaryZoneName} Branch`,
      city,
      state,
      accountType: 'Current',
      createdDaysAgo: 12,
      totalReceived: amount * 3.1,
      totalForwarded: 0,
      avgForwardTimeMinutes: 0,
      fanIn: 5,
      fanOut: 0,
      riskScore: muleRiskC,
      riskLevel: 'CRITICAL',
      nodeType: 'High-Risk Mule',
      linkedSuspiciousCount: 7,
      flagReasons: [
        'Terminal aggregator account receiving multiple fraud streams',
        'Physical ATM card activation log in target commercial corridor',
        'High similarity score with known synthetic cash-out profiles',
      ],
      historicalMatchesCount: 12,
    },
    {
      id: cashOutEndpointId,
      bankName: 'Inter-Bank ATM / POS Network',
      accountHolderMasked: `${primaryZoneName} Cash-Out Terminal`,
      branch: `${primaryZoneName} Kiosk Hub`,
      city,
      state,
      accountType: 'Savings',
      createdDaysAgo: 3200,
      totalReceived: amount,
      totalForwarded: 0,
      avgForwardTimeMinutes: 0,
      fanIn: 1,
      fanOut: 0,
      riskScore: 92,
      riskLevel: 'CRITICAL',
      nodeType: 'Cash-Out Endpoint',
      linkedSuspiciousCount: 4,
      flagReasons: ['Forecasted Physical Withdrawal Point'],
      historicalMatchesCount: 10,
    },
  ];

  // Transactions between hops
  const amt1 = amount;
  const amt2 = Math.round(amount * 0.92);
  const amt3 = Math.round(amount * 0.86);

  const transactions: SyntheticTransaction[] = [
    {
      id: `TXN-${caseId.replace(/[^0-9]/g, '') || '990'}-01`,
      fromAccountId: victimAccountId,
      toAccountId: muleAId,
      amount: amt1,
      timestamp: complaint.initialTransactionTime || new Date(Date.now() - 42 * 60000).toISOString(),
      minutesFromOrigin: 0,
      channel: (paymentMethod.toLowerCase().includes('upi') ? 'UPI' : 'IMPS') as any,
      hopIndex: 1,
      status: 'FLAGGED_ALERT',
    },
    {
      id: `TXN-${caseId.replace(/[^0-9]/g, '') || '990'}-02`,
      fromAccountId: muleAId,
      toAccountId: muleBId,
      amount: amt2,
      timestamp: new Date(Date.now() - 28 * 60000).toISOString(),
      minutesFromOrigin: 14,
      channel: 'IMPS',
      hopIndex: 2,
      status: 'FLAGGED_ALERT',
    },
    {
      id: `TXN-${caseId.replace(/[^0-9]/g, '') || '990'}-03`,
      fromAccountId: muleBId,
      toAccountId: muleCId,
      amount: amt3,
      timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
      minutesFromOrigin: 28,
      channel: 'RTGS',
      hopIndex: 3,
      status: 'FLAGGED_ALERT',
    },
    {
      id: `TXN-${caseId.replace(/[^0-9]/g, '') || '990'}-04`,
      fromAccountId: muleCId,
      toAccountId: cashOutEndpointId,
      amount: amt3,
      timestamp: `${windowText} (Projected)`,
      minutesFromOrigin: startOffset + 15,
      channel: likelyMode === 'ATM Withdrawal' ? 'AEPS' : 'IMPS',
      hopIndex: 4,
      status: 'FLAGGED_ALERT',
    },
  ];

  // Historical Support Cases
  const historicalCases: HistoricalPatternCase[] = [
    {
      caseId: `TRI-HIST-2025-${String(100 + (seed % 800)).padStart(4, '0')}`,
      similarityPercent: 91.2,
      fraudType: category,
      amount: Math.round(amount * 1.08),
      graphPattern: '3-Hop Linear Funnel with Terminal Mule',
      historicalCashOutRegion: `${primaryZoneName} (ATM Cluster)`,
      cashOutDelayMinutes: startOffset + 5,
      cashOutMethod: likelyMode,
      muleCount: 3,
      outcomeVerified: true,
    },
    {
      caseId: `TRI-HIST-2025-${String(200 + (seed % 700)).padStart(4, '0')}`,
      similarityPercent: 86.4,
      fraudType: category,
      amount: Math.round(amount * 0.94),
      graphPattern: '3-Hop Funnel with 14m Pass-Through Velocity',
      historicalCashOutRegion: `${zone2Name}`,
      cashOutDelayMinutes: startOffset + 12,
      cashOutMethod: likelyMode,
      muleCount: 4,
      outcomeVerified: true,
    },
    {
      caseId: `TRI-HIST-2025-${String(300 + (seed % 600)).padStart(4, '0')}`,
      similarityPercent: 82.1,
      fraudType: category,
      amount: Math.round(amount * 1.25),
      graphPattern: 'Multi-Hop Split Aggregator Path',
      historicalCashOutRegion: `${zone3Name}`,
      cashOutDelayMinutes: startOffset + 24,
      cashOutMethod: likelyMode === 'ATM Withdrawal' ? 'Further Transfer' : 'ATM Withdrawal',
      muleCount: 3,
      outcomeVerified: true,
    },
  ];

  return {
    prediction,
    transactions,
    accounts,
    overallRisk,
    highestRiskMule: {
      name: 'Mule Layer 3 (Terminal Mule)',
      accountId: muleCId,
      score: muleRiskC,
    },
    metrics: {
      transactionsAnalysed: 12 + (seed % 8),
      graphNodes: 5,
      hopDepth: 3,
      historicalPatternsCompared: 118 + (seed % 42),
    },
    historicalCases,
  };
}
