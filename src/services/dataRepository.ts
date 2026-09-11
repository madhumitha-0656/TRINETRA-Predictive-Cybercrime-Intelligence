/**
 * TRINETRA - Prototype Data Repository Service
 *
 * REPOSITORY ARCHITECTURE ABSTRACTION:
 * This service implements the Data Access Object (DAO) pattern representing
 * the repository interface to the persistent backend storage.
 *
 * PRODUCTION TARGET ARCHITECTURE:
 * - PostgreSQL: Primary relational storage (Complaints, Cases, Accounts, Audit Logs)
 * - PostGIS: Geospatial indexing & spatial perimeters (Risk Zones, ATM clusters)
 * - NetworkX / Neo4j: Graph topology traversal & mule centrality metrics
 *
 * PROTOTYPE MODE:
 * Operates on fully typed, privacy-preserving synthetic records in client memory
 * with localStorage synchronization for created complaints.
 */

import {
  CybercrimeComplaint,
  SyntheticAccount,
  SyntheticTransaction,
  FraudCategory,
  RiskLevel,
  PredictedZone,
} from '../types';
import {
  SYNTHETIC_COMPLAINTS,
  SYNTHETIC_ACCOUNTS,
  SYNTHETIC_TRANSACTIONS,
  FEATURED_DEMO_COMPLAINT_ID,
  DEMO_CASE_0042_PREDICTION,
  DEMO_CASE_TRANSACTIONS,
} from '../data/syntheticDataset';
import { generateCaseInference, CaseInferenceOutput } from './inferenceEngine';

const STORAGE_CUSTOM_CASES_KEY = 'trinetra_custom_complaints';

// 12 Explicit Searchable Synthetic Cases required by Requirement 6
const CORE_12_SYNTHETIC_CASES: Partial<CybercrimeComplaint>[] = [
  {
    id: 'TRI-2026-0042', // FLAGSHIP DEMO CASE
    complaintDate: '2026-09-04 13:05 IST',
    fraudCategory: 'Investment Scam',
    fraudAmount: 185000,
    paymentMethod: 'IMPS via NetBanking',
    initialTransactionTime: '2026-09-04 13:02:14 IST',
    victimRegion: 'Chennai (Adyar)',
    victimState: 'Tamil Nadu',
    destinationAccount: 'ACC-MULE-A-42',
    transactionReference: 'IMPS/624713908201/INV-RETURNS',
    complaintNarrative:
      'Victim deceived via fraudulent high-yield algorithmic trading channel promising 28% daily returns. Funds routed through 3 mule hops within 26 minutes towards terminal cash-out.',
    currentLayer: 3,
    status: 'INTELLIGENCE_READY',
    overallRisk: 'HIGH',
    muleAccountIds: ['ACC-MULE-A-42', 'ACC-MULE-B-42', 'ACC-MULE-C-42'],
    transactions: DEMO_CASE_TRANSACTIONS,
    prediction: DEMO_CASE_0042_PREDICTION,
  },
  {
    id: 'TRI-2026-0041',
    complaintDate: '2026-09-04 12:15 IST',
    fraudCategory: 'UPI Fraud',
    fraudAmount: 64000,
    paymentMethod: 'UPI Collect Request',
    initialTransactionTime: '2026-09-04 12:11:00 IST',
    victimRegion: 'Bengaluru (Koramangala)',
    victimState: 'Karnataka',
    destinationAccount: 'ACC-SYNTH-1024',
    transactionReference: 'UPI/9842105421/REQ-REFUND',
    complaintNarrative: 'Unauthorized collect request masquerading as bill refund reversal.',
    currentLayer: 2,
    status: 'INTELLIGENCE_READY',
    overallRisk: 'HIGH',
    muleAccountIds: ['ACC-SYNTH-1024', 'ACC-SYNTH-1025'],
  },
  {
    id: 'TRI-2026-0039',
    complaintDate: '2026-09-04 11:40 IST',
    fraudCategory: 'Impersonation Fraud',
    fraudAmount: 320000,
    paymentMethod: 'RTGS',
    initialTransactionTime: '2026-09-04 11:32:00 IST',
    victimRegion: 'Mumbai (Andheri West)',
    victimState: 'Maharashtra',
    destinationAccount: 'ACC-SYNTH-1052',
    transactionReference: 'RTGS/MUM491823/VERIF-ESCROW',
    complaintNarrative: 'Digital arrest coercion scam impersonating law enforcement officers.',
    currentLayer: 4,
    status: 'UNDER_REVIEW',
    overallRisk: 'CRITICAL',
    muleAccountIds: ['ACC-SYNTH-1052', 'ACC-SYNTH-1053', 'ACC-SYNTH-1054'],
  },
  {
    id: 'TRI-2026-0037',
    complaintDate: '2026-09-04 10:20 IST',
    fraudCategory: 'Job Scam',
    fraudAmount: 92500,
    paymentMethod: 'IMPS',
    initialTransactionTime: '2026-09-04 10:14:00 IST',
    victimRegion: 'Hyderabad (Madhapur)',
    victimState: 'Telangana',
    destinationAccount: 'ACC-SYNTH-1081',
    transactionReference: 'IMPS/HYD721908/JOB-DEPOSIT',
    complaintNarrative: 'Telegram tasks scam requiring security deposits for high-ticket ratings.',
    currentLayer: 3,
    status: 'INTELLIGENCE_READY',
    overallRisk: 'HIGH',
    muleAccountIds: ['ACC-SYNTH-1081', 'ACC-SYNTH-1082'],
  },
  {
    id: 'TRI-2026-0034',
    complaintDate: '2026-09-03 18:30 IST',
    fraudCategory: 'Phishing',
    fraudAmount: 48000,
    paymentMethod: 'NetBanking',
    initialTransactionTime: '2026-09-03 18:24:00 IST',
    victimRegion: 'Delhi NCR (Noida)',
    victimState: 'Delhi',
    destinationAccount: 'ACC-SYNTH-1105',
    transactionReference: 'NET/DL512891/KYC-UPDATE',
    complaintNarrative: 'Fake SMS phishing portal prompting bank KYC renewal OTP capture.',
    currentLayer: 2,
    status: 'RESOLVED',
    overallRisk: 'MODERATE',
    muleAccountIds: ['ACC-SYNTH-1105'],
  },
  {
    id: 'TRI-2026-0031',
    complaintDate: '2026-09-03 16:15 IST',
    fraudCategory: 'Loan Scam',
    fraudAmount: 115000,
    paymentMethod: 'UPI',
    initialTransactionTime: '2026-09-03 16:08:00 IST',
    victimRegion: 'Pune (Kothrud)',
    victimState: 'Maharashtra',
    destinationAccount: 'ACC-SYNTH-1132',
    transactionReference: 'UPI/PN682019/LOAN-PROC',
    complaintNarrative: 'Instant micro-loan app extorting processing fees prior to sanction.',
    currentLayer: 3,
    status: 'INTELLIGENCE_READY',
    overallRisk: 'HIGH',
    muleAccountIds: ['ACC-SYNTH-1132', 'ACC-SYNTH-1133'],
  },
  {
    id: 'TRI-2026-0028',
    complaintDate: '2026-09-03 14:00 IST',
    fraudCategory: 'Marketplace Fraud',
    fraudAmount: 38000,
    paymentMethod: 'UPI QR Code',
    initialTransactionTime: '2026-09-03 13:54:00 IST',
    victimRegion: 'Jaipur (Vaishali Nagar)',
    victimState: 'Rajasthan',
    destinationAccount: 'ACC-SYNTH-1158',
    transactionReference: 'UPI/JP301928/ARMY-ADVANCE',
    complaintNarrative: 'Fake buyer posing as defense personnel sending reverse payment QR codes.',
    currentLayer: 1,
    status: 'UNDER_REVIEW',
    overallRisk: 'MODERATE',
    muleAccountIds: ['ACC-SYNTH-1158'],
  },
  {
    id: 'TRI-2026-0025',
    complaintDate: '2026-09-03 11:10 IST',
    fraudCategory: 'Investment Scam',
    fraudAmount: 450000,
    paymentMethod: 'RTGS',
    initialTransactionTime: '2026-09-03 11:02:00 IST',
    victimRegion: 'Chennai (Anna Nagar)',
    victimState: 'Tamil Nadu',
    destinationAccount: 'ACC-SYNTH-1184',
    transactionReference: 'RTGS/CHN910283/CRYPTO-POOL',
    complaintNarrative: 'Arbitrage cryptocurrency pool promising 35% weekly returns via bot trading.',
    currentLayer: 4,
    status: 'ESCALATED',
    overallRisk: 'CRITICAL',
    muleAccountIds: ['ACC-SYNTH-1184', 'ACC-SYNTH-1185', 'ACC-SYNTH-1186'],
  },
  {
    id: 'TRI-2026-0022',
    complaintDate: '2026-09-02 17:45 IST',
    fraudCategory: 'UPI Fraud',
    fraudAmount: 25000,
    paymentMethod: 'UPI',
    initialTransactionTime: '2026-09-02 17:39:00 IST',
    victimRegion: 'Kolkata (Salt Lake)',
    victimState: 'West Bengal',
    destinationAccount: 'ACC-SYNTH-1210',
    transactionReference: 'UPI/KOL819203/CASHBACK-REF',
    complaintNarrative: 'Phony scratch-card cashback link requesting UPI PIN to receive funds.',
    currentLayer: 1,
    status: 'RESOLVED',
    overallRisk: 'LOW',
    muleAccountIds: ['ACC-SYNTH-1210'],
  },
  {
    id: 'TRI-2026-0019',
    complaintDate: '2026-09-02 15:20 IST',
    fraudCategory: 'Phishing',
    fraudAmount: 76000,
    paymentMethod: 'IMPS',
    initialTransactionTime: '2026-09-02 15:12:00 IST',
    victimRegion: 'Ahmedabad (Navrangpura)',
    victimState: 'Gujarat',
    destinationAccount: 'ACC-SYNTH-1236',
    transactionReference: 'IMPS/AHM401928/DISCOM-DUE',
    complaintNarrative: 'Spoofed electricity board notice threatening imminent power cut.',
    currentLayer: 2,
    status: 'INTELLIGENCE_READY',
    overallRisk: 'HIGH',
    muleAccountIds: ['ACC-SYNTH-1236', 'ACC-SYNTH-1237'],
  },
  {
    id: 'TRI-2026-0015',
    complaintDate: '2026-09-02 11:30 IST',
    fraudCategory: 'Job Scam',
    fraudAmount: 140000,
    paymentMethod: 'NEFT',
    initialTransactionTime: '2026-09-02 11:18:00 IST',
    victimRegion: 'Coimbatore (RS Puram)',
    victimState: 'Tamil Nadu',
    destinationAccount: 'ACC-SYNTH-1262',
    transactionReference: 'NEFT/CBE918230/VISA-DEPOSIT',
    complaintNarrative: 'Bogus overseas hospitality placement demanding visa processing clearance.',
    currentLayer: 3,
    status: 'UNDER_REVIEW',
    overallRisk: 'HIGH',
    muleAccountIds: ['ACC-SYNTH-1262', 'ACC-SYNTH-1263'],
  },
  {
    id: 'TRI-2026-0012',
    complaintDate: '2026-09-01 16:50 IST',
    fraudCategory: 'Impersonation Fraud',
    fraudAmount: 210000,
    paymentMethod: 'IMPS',
    initialTransactionTime: '2026-09-01 16:42:00 IST',
    victimRegion: 'Kochi (Edappally)',
    victimState: 'Kerala',
    destinationAccount: 'ACC-SYNTH-1288',
    transactionReference: 'IMPS/KOC719283/CUSTOMS-DUTY',
    complaintNarrative: 'Airport parcel scam demanding penalty clearance for detained gift package.',
    currentLayer: 3,
    status: 'INTELLIGENCE_READY',
    overallRisk: 'CRITICAL',
    muleAccountIds: ['ACC-SYNTH-1288', 'ACC-SYNTH-1289'],
  },
];

class DataRepository {
  private complaints: CybercrimeComplaint[] = [];
  private accounts: SyntheticAccount[] = [];
  private transactions: SyntheticTransaction[] = [];

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.accounts = [...SYNTHETIC_ACCOUNTS];
    this.transactions = [...SYNTHETIC_TRANSACTIONS];

    // Build the master complaints list:
    // 1. Seeded 12 core cases first
    const fullComplaintsMap = new Map<string, CybercrimeComplaint>();

    // Add all from SYNTHETIC_COMPLAINTS first
    SYNTHETIC_COMPLAINTS.forEach((c) => {
      fullComplaintsMap.set(c.id, c);
    });

    // Ensure the 12 explicit cases exist and have rich data
    CORE_12_SYNTHETIC_CASES.forEach((seed) => {
      const existing = fullComplaintsMap.get(seed.id!);
      let caseObj: CybercrimeComplaint;
      if (existing) {
        caseObj = {
          ...existing,
          ...seed,
        } as CybercrimeComplaint;
      } else {
        caseObj = {
          id: seed.id!,
          complaintDate: seed.complaintDate || '2026-09-04 12:00 IST',
          fraudCategory: seed.fraudCategory || 'Investment Scam',
          fraudAmount: seed.fraudAmount || 125000,
          paymentMethod: seed.paymentMethod || 'IMPS via NetBanking',
          initialTransactionTime: seed.initialTransactionTime || '2026-09-04 11:55 IST',
          victimRegion: seed.victimRegion || 'Chennai',
          victimState: seed.victimState || 'Tamil Nadu',
          destinationAccount: seed.destinationAccount || 'ACC-SYNTH-1001',
          transactionReference: seed.transactionReference || 'TXN-REF-SYNTH',
          complaintNarrative: seed.complaintNarrative || 'Synthetic incident record for prototype evaluation.',
          currentLayer: seed.currentLayer || 2,
          status: seed.status || 'INTELLIGENCE_READY',
          analysisStatus: seed.analysisStatus || (seed.status === 'NEW' ? 'NOT STARTED' : 'COMPLETED'),
          overallRisk: seed.overallRisk || 'HIGH',
          muleAccountIds: seed.muleAccountIds || ['ACC-SYNTH-1001', 'ACC-SYNTH-1002'],
          transactions: seed.transactions || [],
          prediction: seed.prediction,
          acknowledged: false,
        };
      }

      // If marked COMPLETED or INTELLIGENCE_READY, ensure consistent prediction and transactions exist
      if (caseObj.id !== 'TRI-2026-0042' && caseObj.status !== 'NEW' && !caseObj.prediction) {
        const inf = generateCaseInference(caseObj);
        caseObj.prediction = inf.prediction;
        caseObj.transactions = inf.transactions;
        caseObj.overallRisk = inf.overallRisk;
        caseObj.analysisStatus = 'COMPLETED';
        // Add synthesized accounts/transactions
        inf.accounts.forEach((acc) => {
          if (!this.accounts.some((a) => a.id === acc.id)) {
            this.accounts.push(acc);
          }
        });
        inf.transactions.forEach((tx) => {
          if (!this.transactions.some((t) => t.id === tx.id)) {
            this.transactions.push(tx);
          }
        });
      } else if (caseObj.status === 'NEW') {
        caseObj.analysisStatus = 'NOT STARTED';
        caseObj.prediction = undefined;
        caseObj.transactions = [];
      }

      fullComplaintsMap.set(seed.id!, caseObj);
    });

    // Load any user-created custom complaints from localStorage
    try {
      const storedCustom = localStorage.getItem(STORAGE_CUSTOM_CASES_KEY);
      if (storedCustom) {
        const parsed = JSON.parse(storedCustom);
        if (Array.isArray(parsed)) {
          parsed.forEach((customC: CybercrimeComplaint) => {
            if (customC && customC.id) {
              fullComplaintsMap.set(customC.id, customC);
              if (customC.transactions && customC.transactions.length > 0) {
                customC.transactions.forEach((t) => {
                  if (!this.transactions.some((tx) => tx.id === t.id)) {
                    this.transactions.push(t);
                  }
                });
              }
            }
          });
        }
      }
    } catch {
      // ignore
    }

    // Deduplicate and ensure strictly unique complaint records
    const seenIds = new Set<string>();
    const uniqueComplaints: CybercrimeComplaint[] = [];
    for (const c of fullComplaintsMap.values()) {
      if (c && c.id && !seenIds.has(c.id)) {
        seenIds.add(c.id);
        uniqueComplaints.push(c);
      }
    }

    this.complaints = uniqueComplaints;
  }

  public getAllComplaints(): CybercrimeComplaint[] {
    return [...this.complaints];
  }

  public generateNextComplaintId(): string {
    let maxNum = 220;
    this.complaints.forEach((c) => {
      const match = c.id.match(/TRI-2026-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) {
          maxNum = num;
        }
      }
    });
    return `TRI-2026-${String(maxNum + 1).padStart(4, '0')}`;
  }

  public getComplaintById(id: string): CybercrimeComplaint | undefined {
    return this.complaints.find(
      (c) => c.id.toLowerCase() === id.trim().toLowerCase()
    );
  }

  public searchCases(query: string): CybercrimeComplaint[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.complaints.slice(0, 15);

    return this.complaints.filter((c) => {
      const matchId = c.id.toLowerCase().includes(q);
      const matchCat = c.fraudCategory.toLowerCase().includes(q);
      const matchDest = c.destinationAccount.toLowerCase().includes(q);
      const matchRef = c.transactionReference.toLowerCase().includes(q);
      const matchMule = c.muleAccountIds?.some((m) => m.toLowerCase().includes(q));
      const matchTxn = c.transactions?.some((t) => t.id.toLowerCase().includes(q));

      return matchId || matchCat || matchDest || matchRef || matchMule || matchTxn;
    });
  }

  public getAllAccounts(): SyntheticAccount[] {
    return this.accounts;
  }

  public getAllTransactions(): SyntheticTransaction[] {
    return this.transactions;
  }

  public createComplaint(data: {
    id?: string;
    fraudCategory: FraudCategory;
    fraudAmount: number;
    paymentMethod: string;
    complaintTime?: string;
    victimRegion: string;
    destinationAccount?: string;
    transactionReference?: string;
    complaintNarrative?: string;
  }): CybercrimeComplaint {
    let newId = data.id?.trim();
    if (!newId || this.complaints.some((c) => c.id === newId)) {
      newId = this.generateNextComplaintId();
    }
    const nextNum = 50 + this.complaints.length;
    const nowStr =
      data.complaintTime ||
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';

    const newComplaint: CybercrimeComplaint = {
      id: newId,
      complaintDate: nowStr,
      fraudCategory: data.fraudCategory,
      fraudAmount: data.fraudAmount,
      paymentMethod: data.paymentMethod,
      initialTransactionTime: nowStr,
      victimRegion: data.victimRegion,
      victimState: data.victimRegion.includes('Chennai') ? 'Tamil Nadu' : 'State Jurisdiction',
      destinationAccount: data.destinationAccount || `ACC-SYNTH-${2000 + nextNum}`,
      transactionReference: data.transactionReference || `TXN-SYNTH-${Date.now().toString().slice(-8)}`,
      complaintNarrative:
        data.complaintNarrative ||
        'Newly reported citizen cybercrime complaint logged into TRINETRA decision support pipeline.',
      currentLayer: 1,
      status: 'NEW',
      analysisStatus: 'NOT STARTED',
      overallRisk: data.fraudAmount > 100000 ? 'HIGH' : 'MODERATE',
      muleAccountIds: [
        data.destinationAccount || `ACC-SYNTH-${2000 + nextNum}`,
      ],
      transactions: [],
      prediction: undefined,
      acknowledged: false,
    };

    // Filter out any existing case with identical ID, then unshift
    this.complaints = [newComplaint, ...this.complaints.filter((c) => c.id !== newComplaint.id)];

    // Save custom complaints to localStorage
    this.persistCustomComplaints();

    return newComplaint;
  }

  public saveOrUpdateComplaint(complaint: CybercrimeComplaint): void {
    const idx = this.complaints.findIndex((c) => c.id === complaint.id);
    if (idx >= 0) {
      this.complaints[idx] = complaint;
    } else {
      this.complaints = [complaint, ...this.complaints.filter((c) => c.id !== complaint.id)];
    }
    this.persistCustomComplaints();
  }

  public saveCaseInference(caseId: string, inference: CaseInferenceOutput): CybercrimeComplaint | undefined {
    const target = this.complaints.find((c) => c.id === caseId);
    if (!target) return undefined;

    target.status = 'INTELLIGENCE_READY';
    target.analysisStatus = 'COMPLETED';
    target.overallRisk = inference.overallRisk;
    target.prediction = inference.prediction;
    target.transactions = inference.transactions;
    target.currentLayer = 3;
    target.muleAccountIds = [
      inference.accounts[1]?.id || 'ACC-MULE-1',
      inference.accounts[2]?.id || 'ACC-MULE-2',
      inference.accounts[3]?.id || 'ACC-MULE-3',
    ];

    // Merge accounts and transactions
    inference.accounts.forEach((acc) => {
      const idx = this.accounts.findIndex((a) => a.id === acc.id);
      if (idx >= 0) {
        this.accounts[idx] = acc;
      } else {
        this.accounts.push(acc);
      }
    });

    inference.transactions.forEach((tx) => {
      const idx = this.transactions.findIndex((t) => t.id === tx.id);
      if (idx >= 0) {
        this.transactions[idx] = tx;
      } else {
        this.transactions.push(tx);
      }
    });

    this.persistCustomComplaints();
    return target;
  }

  public reRunCaseAnalysis(caseId: string): CaseInferenceOutput | undefined {
    const target = this.complaints.find((c) => c.id === caseId);
    if (!target) return undefined;

    const inference = generateCaseInference({
      id: target.id,
      fraudCategory: target.fraudCategory,
      fraudAmount: target.fraudAmount,
      complaintDate: target.complaintDate || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST',
      victimRegion: target.victimRegion,
      destinationAccount: target.destinationAccount,
      transactionReference: target.transactionReference,
      paymentMethod: target.paymentMethod,
    });

    this.saveCaseInference(caseId, inference);
    return inference;
  }

  public getAccountsForCase(caseId: string): SyntheticAccount[] {
    const caseItem = this.complaints.find((c) => c.id === caseId);
    if (caseItem?.muleAccountIds && caseItem.muleAccountIds.length > 0) {
      const related = this.accounts.filter(
        (a) =>
          caseItem.muleAccountIds.includes(a.id) ||
          a.id === caseItem.destinationAccount ||
          (caseItem.transactions &&
            caseItem.transactions.some((t) => t.fromAccountId === a.id || t.toAccountId === a.id))
      );
      if (related.length > 0) return related;
    }
    return this.accounts;
  }

  public getTransactionsForCase(caseId: string): SyntheticTransaction[] {
    const caseItem = this.complaints.find((c) => c.id === caseId);
    if (caseItem?.transactions && caseItem.transactions.length > 0) {
      return caseItem.transactions;
    }
    return this.transactions;
  }

  private persistCustomComplaints(): void {
    try {
      const customOnes = this.complaints.filter((c) =>
        !CORE_12_SYNTHETIC_CASES.some((base) => base.id === c.id)
      );
      // Deduplicate before saving to localStorage
      const seen = new Set<string>();
      const uniqueCustom: CybercrimeComplaint[] = [];
      for (const c of customOnes) {
        if (c && c.id && !seen.has(c.id)) {
          seen.add(c.id);
          uniqueCustom.push(c);
        }
      }
      localStorage.setItem(STORAGE_CUSTOM_CASES_KEY, JSON.stringify(uniqueCustom));
    } catch {
      // ignore
    }
  }

  public updateCaseStatus(id: string, status: CybercrimeComplaint['status']): void {
    const target = this.complaints.find((c) => c.id === id);
    if (target) {
      target.status = status;
      this.persistCustomComplaints();
    }
  }

  public getDatabaseStats() {
    const activeCases = this.complaints.length;
    const highRiskMules = this.accounts.filter(
      (a) => a.riskLevel === 'HIGH' || a.riskLevel === 'CRITICAL'
    ).length;
    const totalPredictions = this.complaints.filter((c) => !!c.prediction).length + 45;
    const activeRiskZones = 28;

    return {
      activeCases,
      highRiskMules,
      totalPredictions,
      activeRiskZones,
    };
  }
}

export const dataRepository = new DataRepository();
