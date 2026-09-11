import React, { useState } from 'react';
import {
  FilePlus,
  Zap,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { CybercrimeComplaint, FraudCategory } from '../types';
import { generateCaseInference } from '../services/inferenceEngine';
import { dataRepository } from '../services/dataRepository';

interface NewComplaintViewProps {
  onCreateComplaint?: (complaint: CybercrimeComplaint) => void;
  onComplaintCreated?: (complaint: CybercrimeComplaint) => void;
  onNavigate: (viewId: any) => void;
}

export const NewComplaintView: React.FC<NewComplaintViewProps> = ({
  onCreateComplaint,
  onComplaintCreated,
  onNavigate,
}) => {
  const [complaintId, setComplaintId] = useState(() => dataRepository.generateNextComplaintId());
  const [complaintDateTime, setComplaintDateTime] = useState('2026-09-04 13:05 IST');
  const [fraudCategory, setFraudCategory] = useState<FraudCategory>('Investment Scam');
  const [fraudAmount, setFraudAmount] = useState('185000');
  const [paymentMethod, setPaymentMethod] = useState('IMPS via NetBanking');
  const [initialTxnTime, setInitialTxnTime] = useState('2026-09-04 13:02:14 IST');
  const [victimRegion, setVictimRegion] = useState('Chennai (Adyar)');
  const [destinationAccount, setDestinationAccount] = useState('ACC-MULE-A-42 (SBI Teynampet)');
  const [transactionRef, setTransactionRef] = useState('IMPS/624713908201/INV-RETURNS');
  const [narrative, setNarrative] = useState(
    'Complainant was deceived into transferring ₹1,85,000 via a fraudulent high-yield algorithmic trading portal advertised on a messaging channel. Promised 28% guaranteed returns in 24 hours. Immediately upon transfer, funds were re-routed to an intermediary account, and complainant was blocked from communication channels.'
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);

  const pipelineStages = [
    { title: 'Complaint Received', desc: 'Synthesizing intake payload and complainant entity verification' },
    { title: 'Features Extracted', desc: 'Identification of amount, velocity timestamp, and initial destination account' },
    { title: 'Transaction Network Built', desc: 'Graph traversal mapping multi-hop mule forwarding paths' },
    { title: 'Mule Risk Analysed', desc: 'Scoring pass-through velocity, fan-in/fan-out, and account age anomalies' },
    { title: 'Historical Patterns Matched', desc: 'Cosine similarity against known synthetic syndicate cash-out clusters' },
    { title: 'Spatio-Temporal Prediction Generated', desc: 'Calculating WHERE (Top 3 zones), WHEN (time window), and HOW (modes)' },
    { title: 'Intelligence Ready', desc: 'Digital Nakabandi perimeter and actionable intelligence report prepared' },
  ];

  const handleLoadDemo = () => {
    setComplaintId('TRI-2026-0042');
    setComplaintDateTime('2026-09-04 13:05 IST');
    setFraudCategory('Investment Scam');
    setFraudAmount('185000');
    setPaymentMethod('IMPS via NetBanking');
    setInitialTxnTime('2026-09-04 13:02:14 IST');
    setVictimRegion('Chennai (Adyar)');
    setDestinationAccount('ACC-MULE-A-42 (SBI Teynampet)');
    setTransactionRef('IMPS/624713908201/INV-RETURNS');
    setNarrative(
      'Complainant was deceived into transferring ₹1,85,000 via a fraudulent high-yield algorithmic trading portal advertised on a messaging channel. Promised 28% guaranteed returns in 24 hours. Immediately upon transfer, funds were re-routed to an intermediary account, and complainant was blocked from communication channels.'
    );
  };

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setPipelineStep(1);

    const interval = setInterval(() => {
      setPipelineStep((prev) => {
        if (prev >= pipelineStages.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 450);
  };

  const handleCompleteAndProceed = () => {
    const draftCase: Partial<CybercrimeComplaint> = {
      id: complaintId,
      complaintDate: complaintDateTime,
      fraudCategory,
      fraudAmount: parseFloat(fraudAmount) || 185000,
      paymentMethod,
      initialTransactionTime: initialTxnTime,
      victimRegion,
      destinationAccount,
      transactionReference: transactionRef,
    };

    const inference = generateCaseInference(draftCase);

    const newCase: CybercrimeComplaint = {
      id: complaintId,
      complaintDate: complaintDateTime,
      fraudCategory,
      fraudAmount: parseFloat(fraudAmount) || 185000,
      paymentMethod,
      initialTransactionTime: initialTxnTime,
      victimRegion,
      victimState: victimRegion.includes('Chennai') ? 'Tamil Nadu' : 'State Jurisdiction',
      destinationAccount,
      transactionReference: transactionRef,
      complaintNarrative: narrative,
      currentLayer: 3,
      status: 'INTELLIGENCE_READY',
      analysisStatus: 'COMPLETED',
      overallRisk: inference.overallRisk,
      muleAccountIds: [
        inference.accounts[1]?.id || 'ACC-MULE-1',
        inference.accounts[2]?.id || 'ACC-MULE-2',
        inference.accounts[3]?.id || 'ACC-MULE-3',
      ],
      transactions: inference.transactions,
      prediction: inference.prediction,
      investigatorNotes: [
        'Automated TRINETRA feature extraction and topology analysis completed.',
        'High-velocity mule chain identified based on transaction parameters.',
        'Digital Nakabandi perimeter calculated for authorized investigator verification.',
      ],
      acknowledged: false,
    };

    dataRepository.saveOrUpdateComplaint(newCase);

    if (onCreateComplaint) {
      onCreateComplaint(newCase);
    } else if (onComplaintCreated) {
      onComplaintCreated(newCase);
    }

    setComplaintId(dataRepository.generateNextComplaintId());
    onNavigate('case-intelligence');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header Banner */}
      <div className="bg-white border border-[#DCE4EA] rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-[#EAF4FB] text-[#1769AA] text-xs font-bold uppercase border border-[#1769AA]/30">
              Module 02
            </span>
            <span className="text-xs text-[#5F6B76]">
              Intake & Multi-Modal Feature Extraction
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0D4778] tracking-tight">
            Ingest Cybercrime Complaint
          </h1>
          <p className="text-xs text-[#5F6B76] mt-0.5">
            Extract entities, map multi-hop mule trail, and initiate predictive cash-out intelligence.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadDemo}
          className="px-3.5 py-2 bg-[#FFF3E8] hover:bg-[#F58220]/20 text-[#B45309] border border-[#F58220]/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-[#F58220]" />
          <span>Load Benchmark Case (TRI-2026-0042)</span>
        </button>
      </div>

      {/* Main Intake Form */}
      <div className="bg-white border border-[#DCE4EA] rounded-xl p-5 shadow-xs">
        <form onSubmit={handleStartAnalysis} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Complaint ID */}
            <div>
              <label className="block text-[#172B3A] font-semibold text-xs mb-1">
                Complaint ID
              </label>
              <input
                type="text"
                value={complaintId}
                onChange={(e) => setComplaintId(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs font-mono font-bold text-[#0D4778] focus:outline-none focus:border-[#1769AA] focus:bg-white"
                required
              />
            </div>

            {/* Date Time */}
            <div>
              <label className="block text-[#172B3A] font-semibold text-xs mb-1">
                Complaint Date / Time
              </label>
              <input
                type="text"
                value={complaintDateTime}
                onChange={(e) => setComplaintDateTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs text-[#172B3A] focus:outline-none focus:border-[#1769AA] focus:bg-white"
                required
              />
            </div>

            {/* Fraud Category */}
            <div>
              <label className="block text-[#172B3A] font-semibold text-xs mb-1">
                Fraud Category
              </label>
              <select
                value={fraudCategory}
                onChange={(e) => setFraudCategory(e.target.value as FraudCategory)}
                className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#1769AA] focus:bg-white"
              >
                <option value="Investment Scam">Investment Scam</option>
                <option value="UPI Fraud">UPI Fraud</option>
                <option value="Impersonation Fraud">Impersonation Fraud</option>
                <option value="Phishing">Phishing</option>
                <option value="Marketplace Fraud">Marketplace Fraud</option>
                <option value="Job Scam">Job Scam</option>
                <option value="Loan Scam">Loan Scam</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Fraud Amount */}
            <div>
              <label className="block text-[#172B3A] font-semibold text-xs mb-1">
                Defrauded Amount (₹)
              </label>
              <input
                type="number"
                value={fraudAmount}
                onChange={(e) => setFraudAmount(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs font-mono font-bold text-rose-700 focus:outline-none focus:border-[#1769AA] focus:bg-white"
                required
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-[#172B3A] font-semibold text-xs mb-1">
                Payment Channel / Method
              </label>
              <input
                type="text"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs text-[#172B3A] focus:outline-none focus:border-[#1769AA] focus:bg-white"
                required
              />
            </div>

            {/* Initial Txn Time */}
            <div>
              <label className="block text-[#172B3A] font-semibold text-xs mb-1">
                Initial Transaction Time
              </label>
              <input
                type="text"
                value={initialTxnTime}
                onChange={(e) => setInitialTxnTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs text-[#172B3A] focus:outline-none focus:border-[#1769AA] focus:bg-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Victim Region */}
            <div>
              <label className="block text-[#172B3A] font-semibold text-xs mb-1">
                Victim Location / Region
              </label>
              <input
                type="text"
                value={victimRegion}
                onChange={(e) => setVictimRegion(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs text-[#172B3A] focus:outline-none focus:border-[#1769AA] focus:bg-white"
                required
              />
            </div>

            {/* Destination Account */}
            <div>
              <label className="block text-[#172B3A] font-semibold text-xs mb-1">
                First Destination Account (Layer 1)
              </label>
              <input
                type="text"
                value={destinationAccount}
                onChange={(e) => setDestinationAccount(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs font-mono text-[#0D4778] focus:outline-none focus:border-[#1769AA] focus:bg-white"
                required
              />
            </div>

            {/* Transaction Reference */}
            <div>
              <label className="block text-[#172B3A] font-semibold text-xs mb-1">
                Transaction Reference / UTR
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs font-mono text-[#172B3A] focus:outline-none focus:border-[#1769AA] focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Narrative */}
          <div>
            <label className="block text-[#172B3A] font-semibold text-xs mb-1">
              Complaint Narrative & Modus Operandi
            </label>
            <textarea
              rows={3}
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs text-[#172B3A] focus:outline-none focus:border-[#1769AA] focus:bg-white leading-relaxed"
              required
            />
          </div>

          {/* Action Trigger */}
          <div className="pt-3 border-t border-[#DCE4EA] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-[#5F6B76] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#138A44]" />
              <span>Multi-Layer Predictive Engine • Explainable Features</span>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-5 py-2.5 bg-[#1769AA] hover:bg-[#0D4778] text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Run Intelligence Analysis</span>
            </button>
          </div>
        </form>
      </div>

      {/* Progress Pipeline Section */}
      {isAnalyzing && (
        <div className="bg-white border-2 border-[#1769AA]/40 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0D4778] flex items-center gap-2 uppercase tracking-wide">
                <RefreshCw className={`w-4 h-4 text-[#1769AA] ${pipelineStep < 7 ? 'animate-spin' : ''}`} />
                TRINETRA Intelligence Extraction Pipeline
              </h3>
              <p className="text-xs text-[#5F6B76]">
                Executing multi-layer decision pipeline for Complaint #{complaintId}
              </p>
            </div>
            <span className="text-xs font-bold text-[#1769AA] bg-[#EAF4FB] px-2.5 py-1 rounded-md border border-[#1769AA]/30">
              {pipelineStep} of {pipelineStages.length} Completed
            </span>
          </div>

          {/* Stepper items */}
          <div className="space-y-2">
            {pipelineStages.map((stage, idx) => {
              const isCompleted = idx < pipelineStep;
              const isCurrent = idx === pipelineStep - 1 && pipelineStep < 7;

              return (
                <div
                  key={stage.title}
                  className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                    isCompleted
                      ? 'bg-[#EAF7EF] border-[#138A44]/30 text-[#065F46]'
                      : isCurrent
                      ? 'bg-[#EAF4FB] border-[#1769AA]/50 text-[#0D4778]'
                      : 'bg-[#F7F9FB] border-[#DCE4EA] opacity-60 text-[#5F6B76]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted
                          ? 'bg-[#138A44] text-white'
                          : isCurrent
                          ? 'bg-[#1769AA] text-white animate-pulse'
                          : 'bg-[#DCE4EA] text-[#5F6B76]'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#172B3A]">{stage.title}</div>
                      <div className="text-[11px] text-[#5F6B76]">{stage.desc}</div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold">
                    {isCompleted ? (
                      <span className="text-[#138A44]">Completed</span>
                    ) : isCurrent ? (
                      <span className="text-[#1769AA]">Processing...</span>
                    ) : (
                      <span className="text-[#5F6B76]">Queued</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Proceed Button when pipeline finishes */}
          {pipelineStep >= 7 && (
            <div className="mt-4 p-4 rounded-xl bg-[#EAF7EF] border border-[#138A44]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#138A44] shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-[#065F46]">
                    Decision Intelligence & Digital Nakabandi Ready
                  </h4>
                  <p className="text-[11px] text-[#138A44]">
                    3 cash-out risk zones forecasted. High-risk terminal mule (ACC-MULE-C-42) flagged.
                  </p>
                </div>
              </div>

              <button
                onClick={handleCompleteAndProceed}
                className="px-4 py-2 bg-[#138A44] hover:bg-[#065F46] text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>View Actionable Intelligence Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
