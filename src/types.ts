/**
 * TRINETRA - Predictive Cybercrime Cash-Out Intelligence Network
 * Types and Interfaces definition
 */

export type PrototypeRole =
  | 'Team Lead / Supervising Analyst'
  | 'Cybercrime Investigator'
  | 'Network Intelligence Analyst'
  | 'Financial Fraud Analyst'
  | 'Geospatial Intelligence Analyst'
  | 'Predictive Analytics Analyst'
  | string;

export interface PrototypeUser {
  user_id: string;
  name: string;
  email: string;
  password_hash: string;
  role: PrototypeRole;
  access_level: string;
  last_login: string;
  badge_number?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action:
    | 'LOGIN'
    | 'CASE_OPENED'
    | 'ANALYSIS_REQUESTED'
    | 'PREDICTION_GENERATED'
    | 'REPORT_GENERATED'
    | 'INTELLIGENCE_REVIEWED'
    | 'LOGOUT'
    | 'COMPLAINT_CREATED';
  details: string;
}

export type UserRole =
  | 'INVESTIGATING_OFFICER'
  | 'CYBER_SUPERVISOR'
  | 'BANK_NODAL_OFFICER'
  | 'FIELD_PATROL_LEAD'
  | PrototypeRole;

export type NavigationTab =
  | 'dashboard'
  | 'cases'
  | 'case-overview'
  | 'transaction-network'
  | 'prediction'
  | 'digital-nakabandi'
  | 'reports';

export type FraudCategory =
  | 'Investment Scam'
  | 'UPI Fraud'
  | 'Impersonation Fraud'
  | 'Phishing'
  | 'Marketplace Fraud'
  | 'Job Scam'
  | 'Loan Scam'
  | 'Other';

export type CashOutMode =
  | 'ATM Withdrawal'
  | 'Further Transfer'
  | 'POS / Merchant'
  | 'UPI'
  | 'Cash Drop / Courier'
  | 'Other';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type AccountNodeType =
  | 'Victim'
  | 'Normal Account'
  | 'Suspected Mule'
  | 'High-Risk Mule'
  | 'Cash-Out Endpoint';

export interface SyntheticAccount {
  id: string; // e.g. ACC-SBIN-8921
  bankName: string;
  accountHolderMasked: string;
  branch: string;
  city: string;
  state: string;
  accountType: 'Savings' | 'Current' | 'NRE' | 'Wallets';
  createdDaysAgo: number;
  totalReceived: number;
  totalForwarded: number;
  avgForwardTimeMinutes: number;
  fanIn: number;
  fanOut: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  nodeType: AccountNodeType;
  linkedSuspiciousCount: number;
  flagReasons: string[];
  historicalMatchesCount: number;
}

export interface SyntheticTransaction {
  id: string; // e.g. TXN-2026-90412
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  timestamp: string; // ISO string
  minutesFromOrigin: number;
  channel: 'IMPS' | 'NEFT' | 'RTGS' | 'UPI' | 'AEPS';
  hopIndex: number; // 1 = victim to mule A, 2 = mule A to mule B, etc.
  status: 'COMPLETED' | 'FLAGGED_ALERT' | 'SETTLED';
}

export interface PredictedZone {
  id: string;
  rank: 1 | 2 | 3;
  name: string;
  areaDescription: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  confidencePercent: number; // 0 - 100
  withdrawalWindow: string; // e.g. "14:20 - 15:05" or "35-55 mins from last hop"
  likelyMode: CashOutMode;
  likelyModePercent: number;
  historicalClusterMatches: number;
  atmDensityScore: string;
  commercialHub: boolean;
  contributingFactors: {
    factor: string;
    weightPercent: number;
    impact: string;
  }[];
}

export interface PredictionResult {
  caseId: string;
  generatedAt: string;
  whereZones: PredictedZone[];
  whenWindow: {
    windowText: string;
    estimatedMinMinutes: number;
    estimatedMaxMinutes: number;
    historicalAvgMins: number;
    temporalPatternDesc: string;
  };
  howModes: {
    mode: CashOutMode;
    probabilityPercent: number;
  }[];
  confidenceMetrics: {
    predictionConfidence: number; // e.g. 78%
    compositeRiskScore: number; // e.g. 89
    evidenceStrength: 'MODERATE' | 'STRONG' | 'VERY_STRONG';
    dataCompleteness: number; // e.g. 92%
  };
  explainabilityContributions: {
    factor: string;
    contributionPercent: number;
    direction: 'positive' | 'negative';
    description: string;
  }[];
}

export interface CybercrimeComplaint {
  id: string; // e.g. TRI-2026-0042
  complaintDate: string;
  fraudCategory: FraudCategory;
  fraudAmount: number;
  paymentMethod: string;
  initialTransactionTime: string;
  victimRegion: string;
  victimState: string;
  destinationAccount: string;
  transactionReference: string;
  complaintNarrative: string;
  currentLayer: number; // hop count reached
  status: 'NEW' | 'ANALYSING' | 'INTELLIGENCE_READY' | 'UNDER_REVIEW' | 'ESCALATED' | 'RESOLVED';
  analysisStatus?: 'NOT STARTED' | 'COMPLETED' | 'IN_PROGRESS';
  overallRisk: RiskLevel;
  muleAccountIds: string[];
  transactions: SyntheticTransaction[];
  prediction?: PredictionResult;
  assignedOfficer?: string;
  investigatorNotes?: string[];
  acknowledged?: boolean;
}

export interface HistoricalPatternCase {
  caseId: string;
  similarityPercent: number;
  fraudType: FraudCategory;
  amount: number;
  graphPattern: string; // e.g. "3-Hop Linear Fan-out"
  historicalCashOutRegion: string;
  cashOutDelayMinutes: number;
  cashOutMethod: CashOutMode;
  muleCount: number;
  outcomeVerified: boolean;
}

export interface InvestigatorSession {
  officerId: string;
  officerName: string;
  badgeNumber: string;
  department: string;
  designation: string;
  unit: string;
  isDemoUser: boolean;
}

export interface FeedbackOutcomeRecord {
  caseId: string;
  recordedAt: string;
  cashOutOccurred: boolean;
  actualRegion: string;
  actualTime: string;
  actualMethod: CashOutMode;
  predictionUseful: boolean;
  notes: string;
  investigatorId: string;
}

export interface ModelMetricData {
  top1ZoneAccuracy: string;
  top3ZoneAccuracy: string;
  medianLocationErrorKm: string;
  timePredictionMaeMinutes: string;
  muleDetectionPrecision: string;
  muleDetectionRecall: string;
  f1Score: string;
  avgInferenceLatencyMs: string;
  totalEvaluatedSyntheticCases: number;
  testSetDate: string;
}
