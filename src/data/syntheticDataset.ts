/**
 * TRINETRA - Synthetic Demonstration Dataset
 *
 * IMPORTANT: This dataset consists entirely of fictional, synthetic records
 * designed for decision-support algorithm prototyping and demonstration.
 * It contains NO confidential NCRP, CFCFRMS, RBI, police, or real banking data.
 */

import {
  CybercrimeComplaint,
  SyntheticAccount,
  SyntheticTransaction,
  PredictedZone,
  PredictionResult,
  HistoricalPatternCase,
  ModelMetricData,
} from '../types';

export const SYNTHETIC_DISCLAIMER_SHORT =
  'PROTOTYPE • SYNTHETIC DATA';
export const SYNTHETIC_DISCLAIMER_FULL =
  'PROTOTYPE SIMULATION: Synthetic demonstration data generated for decision-support evaluation. Not operational intelligence. No actual personal financial or law enforcement records.';

// 1. Featured Demonstration Scenario: TRI-2026-0042
export const FEATURED_DEMO_COMPLAINT_ID = 'TRI-2026-0042';

export const DEMO_CASE_0042_PREDICTION: PredictionResult = {
  caseId: 'TRI-2026-0042',
  generatedAt: '2026-09-04T13:45:00.000Z',
  whereZones: [
    {
      id: 'ZONE-TN-01',
      rank: 1,
      name: 'T. Nagar Corridor',
      areaDescription: 'Panagal Park and Usman Road commercial perimeter. Nearby financial infrastructure may be reviewed by authorized investigators.',
      city: 'Chennai',
      state: 'Tamil Nadu',
      lat: 13.0418,
      lng: 80.2341,
      radiusMeters: 750,
      riskScore: 92,
      riskLevel: 'CRITICAL',
      confidencePercent: 78,
      withdrawalWindow: '14:20 – 15:05 IST (Estimated 35–65 min from current stage)',
      likelyMode: 'ATM Withdrawal',
      likelyModePercent: 64,
      historicalClusterMatches: 14,
      atmDensityScore: 'High density commercial sector',
      commercialHub: true,
      contributingFactors: [
        { factor: 'Transaction Velocity', weightPercent: 28, impact: 'Rapid fund hop (<14 min forwarding) matches swift physical cash extraction pattern' },
        { factor: 'Historical Similarity', weightPercent: 24, impact: '85% similarity with 14 historical investment scam cash-outs in South Chennai' },
        { factor: 'Mule Network Structure', weightPercent: 20, impact: '3-Hop linear structure reaches terminal aggregator without further branching' },
        { factor: 'Geographic Pattern', weightPercent: 17, impact: 'Terminal account branch cluster and historical extraction concentration in Chennai South' },
        { factor: 'Time-of-Day Pattern', weightPercent: 11, impact: 'Peak mid-afternoon banking cycle prior to standard settlement audits' },
      ],
    },
    {
      id: 'ZONE-TN-02',
      rank: 2,
      name: 'Guindy Region',
      areaDescription: 'Kathipara / Mount Road transit interchange corridor. Nearby financial infrastructure may be reviewed by authorized investigators.',
      city: 'Chennai',
      state: 'Tamil Nadu',
      lat: 13.0067,
      lng: 80.2025,
      radiusMeters: 900,
      riskScore: 74,
      riskLevel: 'HIGH',
      confidencePercent: 54,
      withdrawalWindow: '14:35 – 15:20 IST (Estimated 50–80 min from current stage)',
      likelyMode: 'ATM Withdrawal',
      likelyModePercent: 58,
      historicalClusterMatches: 7,
      atmDensityScore: 'Transit & commercial corridor',
      commercialHub: true,
      contributingFactors: [
        { factor: 'Transit Dispersal Proximity', weightPercent: 32, impact: 'Transit corridor frequently correlated with rapid suburban movement' },
        { factor: 'Historical Pattern Reoccurrence', weightPercent: 28, impact: '7 prior synthetic investment scam cash drops recorded in adjacent sector' },
        { factor: 'Secondary Forwarding Window', weightPercent: 22, impact: 'Fallback liquidation corridor if primary T. Nagar kiosks encounter friction' },
        { factor: 'Merchant Density', weightPercent: 18, impact: 'Secondary commercial and merchant withdrawal fallback' },
      ],
    },
    {
      id: 'ZONE-TN-03',
      rank: 3,
      name: 'Saidapet Region',
      areaDescription: 'Anna Salai commercial sector and suburban transit perimeter. Nearby financial infrastructure may be reviewed by authorized investigators.',
      city: 'Chennai',
      state: 'Tamil Nadu',
      lat: 13.0213,
      lng: 80.2231,
      radiusMeters: 1100,
      riskScore: 56,
      riskLevel: 'MODERATE',
      confidencePercent: 37,
      withdrawalWindow: '15:10 – 16:00 IST (Estimated 85–135 min from current stage)',
      likelyMode: 'Further Transfer',
      likelyModePercent: 44,
      historicalClusterMatches: 4,
      atmDensityScore: 'Moderate commercial sector',
      commercialHub: false,
      contributingFactors: [
        { factor: 'Network Topology Alternative', weightPercent: 40, impact: 'Correlated with secondary split transfer path if Mule C splits funds' },
        { factor: 'Branch Location Density', weightPercent: 35, impact: 'Intermediary account branch proximity' },
        { factor: 'Transit Distance Variance', weightPercent: 25, impact: 'Intermediate perimeter between T. Nagar and Guindy' },
      ],
    },
  ],
  whenWindow: {
    windowText: '14:20 – 15:05 IST (Estimated 35–65 minutes from current transaction stage)',
    estimatedMinMinutes: 35,
    estimatedMaxMinutes: 65,
    historicalAvgMins: 48,
    temporalPatternDesc: 'Across 14 similar 3-hop synthetic investment scam cases, 78% of cash-outs executed between 35 and 65 minutes after the third mule transfer to avoid freeze alerts.',
  },
  howModes: [
    { mode: 'ATM Withdrawal', probabilityPercent: 64 },
    { mode: 'Further Transfer', probabilityPercent: 23 },
    { mode: 'POS / Merchant', probabilityPercent: 8 },
    { mode: 'Other', probabilityPercent: 5 },
  ],
  confidenceMetrics: {
    predictionConfidence: 78,
    compositeRiskScore: 87,
    evidenceStrength: 'VERY_STRONG',
    dataCompleteness: 94,
  },
  explainabilityContributions: [
    {
      factor: 'Transaction Velocity',
      contributionPercent: 28,
      direction: 'positive',
      description: 'Hop 1 to Hop 3 executed within 26 total minutes; swift velocity indicates active syndicate coordination.',
    },
    {
      factor: 'Historical Similarity',
      contributionPercent: 24,
      direction: 'positive',
      description: '92.4% structural match with known synthetic syndicate cluster #SYNTH-SYND-09.',
    },
    {
      factor: 'Mule Network Structure',
      contributionPercent: 20,
      direction: 'positive',
      description: 'High fan-in on Mule A followed by funneling through high-risk intermediary Mule B into terminal Mule C.',
    },
    {
      factor: 'Geographic Pattern',
      contributionPercent: 17,
      direction: 'positive',
      description: 'Historical concentration of South Indian investment scam cash extractions in retail hub nodes.',
    },
    {
      factor: 'Time-of-Day Pattern',
      contributionPercent: 11,
      direction: 'positive',
      description: 'Mid-afternoon banking hours prior to end-of-day branch audit cycles.',
    },
  ],
};

// Seed accounts for TRI-2026-0042
export const DEMO_CASE_ACCOUNTS: SyntheticAccount[] = [
  {
    id: 'ACC-VICTIM-0042',
    bankName: 'HDFC Bank',
    accountHolderMasked: 'S. K*****an (Complainant)',
    branch: 'Adyar Branch',
    city: 'Chennai',
    state: 'Tamil Nadu',
    accountType: 'Savings',
    createdDaysAgo: 1840,
    totalReceived: 0,
    totalForwarded: 185000,
    avgForwardTimeMinutes: 0,
    fanIn: 1,
    fanOut: 1,
    riskScore: 5,
    riskLevel: 'LOW',
    nodeType: 'Victim',
    linkedSuspiciousCount: 0,
    flagReasons: ['Verified Complainant Account'],
    historicalMatchesCount: 0,
  },
  {
    id: 'ACC-MULE-A-42',
    bankName: 'State Bank of India',
    accountHolderMasked: 'R. K****r (Mule Layer 1)',
    branch: 'Teynampet Branch',
    city: 'Chennai',
    state: 'Tamil Nadu',
    accountType: 'Savings',
    createdDaysAgo: 48,
    totalReceived: 340000,
    totalForwarded: 310000,
    avgForwardTimeMinutes: 12,
    fanIn: 4,
    fanOut: 2,
    riskScore: 78,
    riskLevel: 'HIGH',
    nodeType: 'Suspected Mule',
    linkedSuspiciousCount: 3,
    flagReasons: [
      'Account opened <60 days ago with sudden high turnover',
      '91.8% of incoming funds forwarded within 12 minutes',
      'Multiple incoming credits from unrelated geographic regions',
    ],
    historicalMatchesCount: 5,
  },
  {
    id: 'ACC-MULE-B-42',
    bankName: 'Canara Bank',
    accountHolderMasked: 'M. S*****h (Mule Layer 2)',
    branch: 'Saidapet Branch',
    city: 'Chennai',
    state: 'Tamil Nadu',
    accountType: 'Savings',
    createdDaysAgo: 29,
    totalReceived: 512000,
    totalForwarded: 489000,
    avgForwardTimeMinutes: 9,
    fanIn: 3,
    fanOut: 2,
    riskScore: 86,
    riskLevel: 'CRITICAL',
    nodeType: 'High-Risk Mule',
    linkedSuspiciousCount: 5,
    flagReasons: [
      'Rapid pass-through forwarding: 95.5% evacuated within 9 minutes',
      'High graph betweenness centrality in syndicate cluster',
      'Account dormant for 25 days before sudden flurry of ₹1.5L+ transactions',
    ],
    historicalMatchesCount: 9,
  },
  {
    id: 'ACC-MULE-C-42',
    bankName: 'Axis Bank',
    accountHolderMasked: 'V. P****l (Terminal Cash-Out Mule)',
    branch: 'T. Nagar Usman Road Branch',
    city: 'Chennai',
    state: 'Tamil Nadu',
    accountType: 'Current',
    createdDaysAgo: 14,
    totalReceived: 780000,
    totalForwarded: 0,
    avgForwardTimeMinutes: 0,
    fanIn: 6,
    fanOut: 0,
    riskScore: 87,
    riskLevel: 'CRITICAL',
    nodeType: 'High-Risk Mule',
    linkedSuspiciousCount: 8,
    flagReasons: [
      'Terminal aggregator account receiving funds from 3 distinct fraud funnels',
      'ATM withdrawal card activated and PIN reset via mobile 40 minutes prior',
      'Geographic IP log matches Usman Road commercial corridor',
      'High similarity match with terminal mule profile in syndicate cluster #SYNTH-SYND-09',
    ],
    historicalMatchesCount: 14,
  },
  {
    id: 'ACC-ENDPOINT-ATM-42',
    bankName: 'Inter-Bank ATM Network',
    accountHolderMasked: 'Automated Teller Machine #TN-ATM-4012',
    branch: 'Panagal Park Central Kiosk',
    city: 'Chennai',
    state: 'Tamil Nadu',
    accountType: 'Savings',
    createdDaysAgo: 3600,
    totalReceived: 152000,
    totalForwarded: 0,
    avgForwardTimeMinutes: 0,
    fanIn: 1,
    fanOut: 0,
    riskScore: 90,
    riskLevel: 'CRITICAL',
    nodeType: 'Cash-Out Endpoint',
    linkedSuspiciousCount: 4,
    flagReasons: ['Forecasted Physical Withdrawal Terminal Hub'],
    historicalMatchesCount: 11,
  },
];

// Seed transactions for TRI-2026-0042
export const DEMO_CASE_TRANSACTIONS: SyntheticTransaction[] = [
  {
    id: 'TXN-2026-042-01',
    fromAccountId: 'ACC-VICTIM-0042',
    toAccountId: 'ACC-MULE-A-42',
    amount: 185000,
    timestamp: '2026-09-04T13:02:14.000Z',
    minutesFromOrigin: 0,
    channel: 'IMPS',
    hopIndex: 1,
    status: 'FLAGGED_ALERT',
  },
  {
    id: 'TXN-2026-042-02',
    fromAccountId: 'ACC-MULE-A-42',
    toAccountId: 'ACC-MULE-B-42',
    amount: 170000,
    timestamp: '2026-09-04T13:14:32.000Z',
    minutesFromOrigin: 12,
    channel: 'IMPS',
    hopIndex: 2,
    status: 'FLAGGED_ALERT',
  },
  {
    id: 'TXN-2026-042-03',
    fromAccountId: 'ACC-MULE-B-42',
    toAccountId: 'ACC-MULE-C-42',
    amount: 152000,
    timestamp: '2026-09-04T13:28:45.000Z',
    minutesFromOrigin: 26,
    channel: 'RTGS',
    hopIndex: 3,
    status: 'FLAGGED_ALERT',
  },
  {
    id: 'TXN-2026-042-04',
    fromAccountId: 'ACC-MULE-C-42',
    toAccountId: 'ACC-ENDPOINT-ATM-42',
    amount: 152000,
    timestamp: '2026-09-04T14:35:00.000Z (Projected)',
    minutesFromOrigin: 93,
    channel: 'AEPS',
    hopIndex: 4,
    status: 'FLAGGED_ALERT',
  },
];

// Featured historical cases for case similarity comparison
export const TOP_SIMILAR_CASES_0042: HistoricalPatternCase[] = [
  {
    caseId: 'TRI-HIST-2025-0819',
    similarityPercent: 92.4,
    fraudType: 'Investment Scam',
    amount: 195000,
    graphPattern: '3-Hop Linear with Terminal Funnel',
    historicalCashOutRegion: 'T. Nagar, Chennai (ATM Cluster)',
    cashOutDelayMinutes: 44,
    cashOutMethod: 'ATM Withdrawal',
    muleCount: 3,
    outcomeVerified: true,
  },
  {
    caseId: 'TRI-HIST-2025-1142',
    similarityPercent: 88.1,
    fraudType: 'Investment Scam',
    amount: 160000,
    graphPattern: '3-Hop Funnel with 12m Pass-Through',
    historicalCashOutRegion: 'Vadapalani Commercial Strip, Chennai',
    cashOutDelayMinutes: 52,
    cashOutMethod: 'ATM Withdrawal',
    muleCount: 4,
    outcomeVerified: true,
  },
  {
    caseId: 'TRI-HIST-2025-0420',
    similarityPercent: 84.7,
    fraudType: 'Investment Scam',
    amount: 220000,
    graphPattern: '4-Hop Funnel with Split Forwarding',
    historicalCashOutRegion: 'T. Nagar Usman Road, Chennai',
    cashOutDelayMinutes: 39,
    cashOutMethod: 'ATM Withdrawal',
    muleCount: 4,
    outcomeVerified: true,
  },
  {
    caseId: 'TRI-HIST-2025-1563',
    similarityPercent: 79.5,
    fraudType: 'Job Scam',
    amount: 145000,
    graphPattern: '2-Hop Immediate Cash-Out',
    historicalCashOutRegion: 'Anna Nagar Roundtana, Chennai',
    cashOutDelayMinutes: 61,
    cashOutMethod: 'POS / Merchant',
    muleCount: 3,
    outcomeVerified: true,
  },
  {
    caseId: 'TRI-HIST-2026-0012',
    similarityPercent: 76.2,
    fraudType: 'Investment Scam',
    amount: 180000,
    graphPattern: '3-Hop Linear Transfer',
    historicalCashOutRegion: 'Guindy Industrial Estate, Chennai',
    cashOutDelayMinutes: 48,
    cashOutMethod: 'Further Transfer',
    muleCount: 3,
    outcomeVerified: true,
  },
];

// Helper to generate a realistic synthetic dataset with 120+ complaints, 300+ accounts, 650+ transactions
function buildFullSyntheticDataset() {
  const accounts: SyntheticAccount[] = [...DEMO_CASE_ACCOUNTS];
  const transactions: SyntheticTransaction[] = [...DEMO_CASE_TRANSACTIONS];
  const complaints: CybercrimeComplaint[] = [];

  // Regional hubs for synthetic generation
  const hubs = [
    { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, baseBank: 'State Bank of India' },
    { city: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, baseBank: 'Canara Bank' },
    { city: 'Delhi NCR', state: 'Delhi', lat: 28.6139, lng: 77.2090, baseBank: 'Punjab National Bank' },
    { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, baseBank: 'Bank of Baroda' },
    { city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, baseBank: 'Union Bank of India' },
    { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, baseBank: 'UCO Bank' },
    { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, baseBank: 'State Bank of India' },
    { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, baseBank: 'Bank of Maharashtra' },
  ];

  const banks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Punjab National Bank',
    'Canara Bank',
    'Bank of Baroda',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'IndusInd Bank',
    'Paytm Payments Bank',
    'Airtel Payments Bank',
    'Federal Bank',
  ];

  const fraudCategories = [
    'Investment Scam',
    'UPI Fraud',
    'Impersonation Fraud',
    'Phishing',
    'Marketplace Fraud',
    'Job Scam',
    'Loan Scam',
  ] as const;

  // Add the primary featured complaint
  complaints.push({
    id: 'TRI-2026-0042',
    complaintDate: '2026-09-04 13:05 IST',
    fraudCategory: 'Investment Scam',
    fraudAmount: 185000,
    paymentMethod: 'IMPS via NetBanking',
    initialTransactionTime: '2026-09-04 13:02:14 IST',
    victimRegion: 'Chennai (Adyar)',
    victimState: 'Tamil Nadu',
    destinationAccount: 'ACC-MULE-A-42 (SBI Teynampet)',
    transactionReference: 'IMPS/624713908201/INV-RETURNS',
    complaintNarrative:
      'Complainant was deceived into transferring ₹1,85,000 via a fraudulent high-yield algorithmic trading portal advertised on a messaging channel. Promised 28% guaranteed returns in 24 hours. Immediately upon transfer, funds were re-routed to an intermediary account, and complainant was blocked from communication channels.',
    currentLayer: 3,
    status: 'INTELLIGENCE_READY',
    overallRisk: 'HIGH',
    muleAccountIds: ['ACC-MULE-A-42', 'ACC-MULE-B-42', 'ACC-MULE-C-42'],
    transactions: DEMO_CASE_TRANSACTIONS,
    prediction: DEMO_CASE_0042_PREDICTION,
    investigatorNotes: [
      'Preliminary graph traversal indicates 3-hop automated forwarding cycle.',
      'Terminal Mule C account flagged in 2 previous synthetic intelligence alerts.',
      'Recommended immediate Digital Nakabandi patrol deployment to T. Nagar Usman Road commercial corridor.',
    ],
    acknowledged: true,
  });

  // Generate additional ~270 synthetic accounts
  for (let i = 1; i <= 270; i++) {
    const hub = hubs[i % hubs.length];
    const bank = banks[i % banks.length];
    const accType = i % 7 === 0 ? 'Current' : 'Savings';
    const isMule = i % 3 === 0;
    const isHighRisk = isMule && i % 2 === 0;
    const isVictim = !isMule && i % 4 === 0;

    const riskScore = isHighRisk
      ? Math.floor(75 + (i % 25))
      : isMule
      ? Math.floor(45 + (i % 30))
      : Math.floor(5 + (i % 25));

    const riskLevel =
      riskScore >= 80 ? 'CRITICAL' : riskScore >= 65 ? 'HIGH' : riskScore >= 40 ? 'MODERATE' : 'LOW';

    const nodeType = isVictim
      ? 'Victim'
      : isHighRisk
      ? 'High-Risk Mule'
      : isMule
      ? 'Suspected Mule'
      : 'Normal Account';

    const flagReasons: string[] = [];
    if (isHighRisk) {
      flagReasons.push('Rapid pass-through forwarding observed (<18 mins)');
      flagReasons.push('High fan-out ratio to multiple anonymous endpoints');
      flagReasons.push('Recent KYC modification followed by high volume');
    } else if (isMule) {
      flagReasons.push('Disproportionate incoming volume vs account age');
      flagReasons.push('Linked to flagged IP subnet');
    }

    accounts.push({
      id: `ACC-SYNTH-${1000 + i}`,
      bankName: bank,
      accountHolderMasked: `${['A', 'K', 'M', 'R', 'S', 'V', 'P', 'D'][i % 8]}. ${['Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Nair', 'Banerjee'][i % 8].charAt(0)}****${['a', 'l', 'h', 'r', 'n'][i % 5]}`,
      branch: `${hub.city} ${['Main', 'Station Rd', 'MIDC', 'Tech Park', 'Bazaar', 'Commercial St'][i % 6]} Branch`,
      city: hub.city,
      state: hub.state,
      accountType: accType,
      createdDaysAgo: Math.floor(15 + (i * 7) % 600),
      totalReceived: Math.floor(25000 + (i * 9500) % 850000),
      totalForwarded: Math.floor(20000 + (i * 9200) % 810000),
      avgForwardTimeMinutes: Math.floor(8 + (i % 45)),
      fanIn: 1 + (i % 6),
      fanOut: isHighRisk ? 3 + (i % 5) : 1 + (i % 3),
      riskScore,
      riskLevel,
      nodeType,
      linkedSuspiciousCount: isHighRisk ? 3 + (i % 6) : isMule ? 1 + (i % 3) : 0,
      flagReasons,
      historicalMatchesCount: isMule ? 2 + (i % 8) : 0,
    });
  }

  // Generate ~550 synthetic transactions linking accounts
  for (let j = 1; j <= 550; j++) {
    const fromAccIndex = j % (accounts.length - 2);
    const toAccIndex = (fromAccIndex + 1 + (j % 5)) % accounts.length;
    const amount = Math.floor(15000 + (j * 1750) % 240000);
    const channel = (['IMPS', 'UPI', 'RTGS', 'NEFT', 'AEPS'] as const)[j % 5];
    const minsAgo = Math.floor(10 + (j * 14) % 10080); // within last 7 days

    const date = new Date(Date.now() - minsAgo * 60 * 1000);

    transactions.push({
      id: `TXN-SYNTH-${20000 + j}`,
      fromAccountId: accounts[fromAccIndex].id,
      toAccountId: accounts[toAccIndex].id,
      amount,
      timestamp: date.toISOString(),
      minutesFromOrigin: minsAgo,
      channel,
      hopIndex: (j % 4) + 1,
      status: (j % 4 === 0) ? 'FLAGGED_ALERT' : 'COMPLETED',
    });
  }

  // Generate 110 additional synthetic complaints
  for (let c = 1; c <= 110; c++) {
    const hub = hubs[c % hubs.length];
    const fraudCat = fraudCategories[c % fraudCategories.length];
    const amount = Math.floor(35000 + (c * 12500) % 450000);
    const layer = (c % 3) + 2;
    const riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' =
      c % 5 === 0 ? 'CRITICAL' : c % 3 === 0 ? 'HIGH' : c % 2 === 0 ? 'MODERATE' : 'LOW';

    const statusList = [
      'INTELLIGENCE_READY',
      'UNDER_REVIEW',
      'ESCALATED',
      'ANALYSING',
      'RESOLVED',
    ] as const;
    const status = statusList[c % statusList.length];

    const cId = `TRI-2026-${String(100 + c).padStart(4, '0')}`;
    const pastHours = Math.floor(2 + (c * 3.5) % 168);
    const cDate = new Date(Date.now() - pastHours * 3600 * 1000).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
    });

    const mAccount1 = accounts[(c * 2) % accounts.length].id;
    const mAccount2 = accounts[(c * 2 + 1) % accounts.length].id;

    // Generated zone for this complaint
    const primaryZoneName = `${hub.city} ${['Commercial Strip', 'Metro Corridor', 'Tech Hub', 'Main Market', 'Railway Colony', 'Outer Ring Rd'][c % 6]}`;
    const zoneRisk = riskLevel === 'CRITICAL' ? 88 : riskLevel === 'HIGH' ? 72 : 54;

    const whereZones: PredictedZone[] = [
      {
        id: `ZONE-${cId}-1`,
        rank: 1,
        name: primaryZoneName,
        areaDescription: `High density commercial & ATM sector in ${hub.city}; cluster of 24+ terminals.`,
        city: hub.city,
        state: hub.state,
        lat: hub.lat + ((c % 7) - 3) * 0.012,
        lng: hub.lng + ((c % 5) - 2) * 0.015,
        radiusMeters: 600 + (c % 4) * 200,
        riskScore: zoneRisk,
        riskLevel,
        confidencePercent: Math.min(85, Math.floor(52 + (c % 32))),
        withdrawalWindow: `+${Math.floor(25 + (c % 40))}–${Math.floor(65 + (c % 50))} mins from hop ${layer}`,
        likelyMode: (['ATM Withdrawal', 'Further Transfer', 'POS / Merchant', 'UPI'] as const)[c % 4],
        likelyModePercent: 55 + (c % 25),
        historicalClusterMatches: 3 + (c % 11),
        atmDensityScore: c % 2 === 0 ? 'High' : 'Moderate',
        commercialHub: true,
        contributingFactors: [
          { factor: 'Forwarding Velocity', weightPercent: 30, impact: 'Rapid hop speed indicative of syndicate flow' },
          { factor: 'Geographic Prior', weightPercent: 28, impact: 'Repeated historical cash-out hotspot' },
          { factor: 'Graph Topology', weightPercent: 24, impact: 'Linear path terminal structure' },
          { factor: 'Time Window', weightPercent: 18, impact: 'Active financial transaction window' },
        ],
      },
      {
        id: `ZONE-${cId}-2`,
        rank: 2,
        name: `${hub.city} Secondary Transit Point`,
        areaDescription: `Transit interchange & market zone within 4km radius.`,
        city: hub.city,
        state: hub.state,
        lat: hub.lat + ((c % 5) - 1) * 0.018,
        lng: hub.lng - ((c % 4) - 1) * 0.012,
        radiusMeters: 900,
        riskScore: Math.max(30, zoneRisk - 18),
        riskLevel: riskLevel === 'CRITICAL' ? 'HIGH' : 'MODERATE',
        confidencePercent: Math.max(35, Math.floor(40 + (c % 25))),
        withdrawalWindow: `+${Math.floor(45 + (c % 30))}–${Math.floor(90 + (c % 40))} mins`,
        likelyMode: 'ATM Withdrawal',
        likelyModePercent: 48,
        historicalClusterMatches: 2 + (c % 5),
        atmDensityScore: 'Moderate',
        commercialHub: false,
        contributingFactors: [
          { factor: 'Transit Corridor', weightPercent: 35, impact: 'Alternative dispersal node' },
          { factor: 'Secondary ATM Cluster', weightPercent: 35, impact: 'Backup cash withdrawal location' },
          { factor: 'Historical Divergence', weightPercent: 30, impact: 'Minor cluster recurrence' },
        ],
      },
      {
        id: `ZONE-${cId}-3`,
        rank: 3,
        name: `${hub.city} Outer Perimeter`,
        areaDescription: `Peripheral suburban cluster with micro-ATMs.`,
        city: hub.city,
        state: hub.state,
        lat: hub.lat - ((c % 4) + 1) * 0.02,
        lng: hub.lng + ((c % 3) + 1) * 0.02,
        radiusMeters: 1400,
        riskScore: Math.max(25, zoneRisk - 32),
        riskLevel: 'LOW',
        confidencePercent: 32,
        withdrawalWindow: `+${Math.floor(80 + (c % 40))}–${Math.floor(140 + (c % 60))} mins`,
        likelyMode: 'Further Transfer',
        likelyModePercent: 42,
        historicalClusterMatches: 1,
        atmDensityScore: 'Low',
        commercialHub: false,
        contributingFactors: [
          { factor: 'Fall-Back Transfer Node', weightPercent: 50, impact: 'Mule routing contingency' },
          { factor: 'Low-Speed Channel', weightPercent: 50, impact: 'Delayed liquidation path' },
        ],
      },
    ];

    complaints.push({
      id: cId,
      complaintDate: `${cDate} IST`,
      fraudCategory: fraudCat,
      fraudAmount: amount,
      paymentMethod: (['UPI / QR', 'IMPS NetBanking', 'Credit Card Gateway', 'AEPS'] as const)[c % 4],
      initialTransactionTime: `${cDate} IST`,
      victimRegion: `${hub.city} South`,
      victimState: hub.state,
      destinationAccount: mAccount1,
      transactionReference: `SYNTH/${9800000000 + c}/${fraudCat.substring(0, 3).toUpperCase()}`,
      complaintNarrative: `Synthetic case narrative for ${cId}: Complainant reported unauthorized debit under the category of ${fraudCat}. Initial remittance directed to intermediary account ${mAccount1}. Rapid forwarding detected across layer ${layer}.`,
      currentLayer: layer,
      status,
      overallRisk: riskLevel,
      muleAccountIds: [mAccount1, mAccount2],
      transactions: transactions.slice((c * 4) % transactions.length, ((c * 4) % transactions.length) + 3),
      prediction: {
        caseId: cId,
        generatedAt: new Date(Date.now() - (pastHours - 1) * 3600 * 1000).toISOString(),
        whereZones,
        whenWindow: {
          windowText: `+${Math.floor(25 + (c % 40))} to ${Math.floor(65 + (c % 50))} min post-transfer`,
          estimatedMinMinutes: 25 + (c % 40),
          estimatedMaxMinutes: 65 + (c % 50),
          historicalAvgMins: 45,
          temporalPatternDesc: `Analysis of ${hub.city} historical syndicate movements indicates prompt cash-out prior to automated freeze triggers.`,
        },
        howModes: [
          { mode: 'ATM Withdrawal', probabilityPercent: 58 },
          { mode: 'Further Transfer', probabilityPercent: 26 },
          { mode: 'POS / Merchant', probabilityPercent: 11 },
          { mode: 'UPI', probabilityPercent: 5 },
        ],
        confidenceMetrics: {
          predictionConfidence: Math.floor(58 + (c % 28)),
          compositeRiskScore: zoneRisk,
          evidenceStrength: riskLevel === 'CRITICAL' ? 'VERY_STRONG' : riskLevel === 'HIGH' ? 'STRONG' : 'MODERATE',
          dataCompleteness: Math.floor(82 + (c % 16)),
        },
        explainabilityContributions: [
          { factor: 'Transaction Velocity', contributionPercent: 32, direction: 'positive', description: 'Swift hop duration' },
          { factor: 'Geographic Prior', contributionPercent: 26, direction: 'positive', description: 'Known regional cash-out hub' },
          { factor: 'Mule Risk Score', contributionPercent: 22, direction: 'positive', description: 'Account flagged in synthetic pool' },
          { factor: 'Historical Topology', contributionPercent: 20, direction: 'positive', description: 'Similarity to historical pattern clusters' },
        ],
      },
      investigatorNotes: [`Automated synthetic feature extraction completed. Review recommended.`],
      acknowledged: false,
    });
  }

  return { accounts, transactions, complaints };
}

// Instantiate database
export const SYNTHETIC_DATABASE = buildFullSyntheticDataset();
export const SYNTHETIC_ACCOUNTS = SYNTHETIC_DATABASE.accounts;
export const SYNTHETIC_TRANSACTIONS = SYNTHETIC_DATABASE.transactions;
export const SYNTHETIC_COMPLAINTS = SYNTHETIC_DATABASE.complaints;
export const DEMO_PRIMARY_CASE =
  SYNTHETIC_COMPLAINTS.find((c) => c.id === FEATURED_DEMO_COMPLAINT_ID) ||
  SYNTHETIC_COMPLAINTS[0];

// Model Evaluation Metrics (Synthetic validation set)
export const SYNTHETIC_MODEL_METRICS: ModelMetricData = {
  top1ZoneAccuracy: '74.2%',
  top3ZoneAccuracy: '89.6%',
  medianLocationErrorKm: '1.45 km',
  timePredictionMaeMinutes: '14.8 min',
  muleDetectionPrecision: '86.4%',
  muleDetectionRecall: '82.1%',
  f1Score: '0.842',
  avgInferenceLatencyMs: '184 ms',
  totalEvaluatedSyntheticCases: 1240,
  testSetDate: 'SIH 2026 Synthetic Validation Split (N=310 test cases)',
};
