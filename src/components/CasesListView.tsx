import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  X,
  FileText,
  Play,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { CybercrimeComplaint, FraudCategory, RiskLevel } from '../types';
import { dataRepository } from '../services/dataRepository';
import { authService } from '../services/authService';

interface CasesListViewProps {
  complaints: CybercrimeComplaint[];
  activeCase: CybercrimeComplaint;
  onSelectCase: (c: CybercrimeComplaint) => void;
  onNavigate: (viewId: any) => void;
  onComplaintCreated: (c: CybercrimeComplaint) => void;
  onStartInvestigation?: (c: CybercrimeComplaint) => void;
  initialShowNewForm?: boolean;
}

export const CasesListView: React.FC<CasesListViewProps> = ({
  complaints,
  activeCase,
  onSelectCase,
  onNavigate,
  onComplaintCreated,
  onStartInvestigation,
  initialShowNewForm = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fraudFilter, setFraudFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showNewForm, setShowNewForm] = useState(initialShowNewForm);
  const [createdCase, setCreatedCase] = useState<CybercrimeComplaint | null>(null);

  // New Complaint Form State
  const [cId, setCId] = useState(() => dataRepository.generateNextComplaintId());
  const [fraudCategory, setFraudCategory] = useState<FraudCategory>('Investment Scam');
  const [fraudAmount, setFraudAmount] = useState<number>(125000);
  const [paymentMethod, setPaymentMethod] = useState('IMPS via NetBanking');
  const [complaintTime, setComplaintTime] = useState('2026-09-04 13:40 IST');
  const [victimRegion, setVictimRegion] = useState('Chennai (Anna Nagar)');
  const [destinationAccount, setDestinationAccount] = useState('ACC-SYNTH-8901');
  const [transactionReference, setTransactionReference] = useState('IMPS/7102948201/TRANS');
  const [complaintNarrative, setComplaintNarrative] = useState('');

  const handleLoadSampleData = () => {
    setCId(dataRepository.generateNextComplaintId());
    setFraudCategory('Investment Scam');
    setFraudAmount(195000);
    setPaymentMethod('IMPS via NetBanking');
    setComplaintTime('2026-09-04 13:30 IST');
    setVictimRegion('Chennai (Mylapore)');
    setDestinationAccount('ACC-MULE-X-45');
    setTransactionReference('IMPS/9041284910/RETURNS');
    setComplaintNarrative('Complainant transferred funds after contact on messaging portal promising high daily interest returns.');
  };

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    const newComplaint = dataRepository.createComplaint({
      id: cId,
      fraudCategory,
      fraudAmount: Number(fraudAmount),
      paymentMethod,
      complaintTime,
      victimRegion,
      destinationAccount,
      transactionReference,
      complaintNarrative,
    });

    authService.recordAuditLog(
      'COMPLAINT_CREATED',
      `Created new complaint ${newComplaint.id} (${newComplaint.fraudCategory}, ₹${newComplaint.fraudAmount})`
    );

    onComplaintCreated(newComplaint);
    onSelectCase(newComplaint);
    setCreatedCase(newComplaint);
    setCId(dataRepository.generateNextComplaintId());
  };

  const handleTriggerInvestigation = (c: CybercrimeComplaint) => {
    onSelectCase(c);
    if (onStartInvestigation) {
      onStartInvestigation(c);
    } else {
      onNavigate('analysis-processing');
    }
  };

  const handleSelect = (c: CybercrimeComplaint) => {
    onSelectCase(c);
    authService.recordAuditLog('CASE_OPENED', `Opened case ${c.id} from Cases Table`);
    onNavigate('case-overview');
  };

  // Filter & Search Logic
  const filteredCases = useMemo(() => {
    const seen = new Set<string>();
    return complaints.filter((c) => {
      if (!c || !c.id || seen.has(c.id)) return false;
      seen.add(c.id);

      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.fraudCategory.toLowerCase().includes(q) ||
        c.victimRegion.toLowerCase().includes(q) ||
        c.destinationAccount.toLowerCase().includes(q);

      // Filters
      const matchesFraud = fraudFilter === 'ALL' || c.fraudCategory === fraudFilter;
      const matchesRisk = riskFilter === 'ALL' || c.overallRisk === riskFilter;
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

      return matchesSearch && matchesFraud && matchesRisk && matchesStatus;
    });
  }, [complaints, searchQuery, fraudFilter, riskFilter, statusFilter]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* 1. Header with Two Primary Actions (User Requirement 9) */}
      <div className="bg-white border border-[#DCE4EA] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0D4778]">
            SYNTHETIC COMPLAINTS & CASES
          </h1>
          <p className="text-xs text-[#5F6B76] font-medium">
            Search, filter, or ingest synthetic cybercrime incidents for automated cash-out forecasting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
              showNewForm
                ? 'bg-[#F7F9FB] border border-[#DCE4EA] text-[#172B3A] hover:bg-[#DCE4EA]'
                : 'bg-[#1769AA] hover:bg-[#0D4778] text-white'
            }`}
          >
            {showNewForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{showNewForm ? 'CLOSE FORM' : '+ NEW COMPLAINT'}</span>
          </button>
        </div>
      </div>

      {/* 2. Embedded New Complaint Form (User Requirement 10) */}
      {showNewForm && (
        <div className="bg-white border-2 border-[#1769AA]/40 rounded-xl p-4 sm:p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#DCE4EA]">
            <div>
              <span className="text-[10px] font-bold text-[#1769AA] uppercase tracking-wider block">
                COMPLAINT INTAKE PIPELINE
              </span>
              <h2 className="text-sm font-bold text-[#0D4778]">
                Log New Citizen Cybercrime Complaint
              </h2>
            </div>

            <button
              type="button"
              onClick={handleLoadSampleData}
              className="px-3 py-1.5 rounded-lg bg-[#EAF4FB] hover:bg-[#1769AA]/15 text-[#1769AA] border border-[#1769AA]/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1769AA]" />
              <span>LOAD SAMPLE DATA</span>
            </button>
          </div>

          {createdCase ? (
            <div className="p-6 rounded-2xl bg-[#EAF7EF] border-2 border-[#138A44]/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#138A44]/10 text-[#138A44] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-[#065F46] tracking-wide uppercase">CASE CREATED</h3>
                <p className="text-sm font-mono font-bold text-[#0D4778]">Case ID: {createdCase.id}</p>
                <p className="text-xs text-[#5F6B76]">Complaint successfully registered into TRINETRA repository.</p>
                <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-[#5F6B76]">
                  <span>Status: <strong className="text-amber-700">NEW</strong></span>
                  <span>•</span>
                  <span>Analysis: <strong className="text-amber-700">NOT STARTED</strong></span>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCreatedCase(null);
                    setShowNewForm(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-[#DCE4EA] bg-white text-xs font-semibold text-[#5F6B76] hover:bg-[#F7F9FB] cursor-pointer"
                >
                  CLOSE
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerInvestigation(createdCase)}
                  className="px-6 py-2.5 rounded-xl bg-[#1769AA] hover:bg-[#0D4778] text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>START INVESTIGATION</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateComplaint} className="space-y-3.5 text-xs">
              {/* Required Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#172B3A] font-semibold mb-1">
                    Complaint ID <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={cId}
                    onChange={(e) => setCId(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#172B3A] font-semibold mb-1">
                    Fraud Category <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={fraudCategory}
                    onChange={(e) => setFraudCategory(e.target.value as FraudCategory)}
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs"
                  >
                    <option value="Investment Scam">Investment Scam</option>
                    <option value="UPI Fraud">UPI Fraud</option>
                    <option value="Phishing">Phishing</option>
                    <option value="Impersonation Fraud">Impersonation Fraud</option>
                    <option value="Job Scam">Job Scam</option>
                    <option value="Marketplace Fraud">Marketplace Fraud</option>
                    <option value="Loan Scam">Loan Scam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#172B3A] font-semibold mb-1">
                    Fraud Amount (₹) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    value={fraudAmount}
                    onChange={(e) => setFraudAmount(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#172B3A] font-semibold mb-1">
                    Payment Method <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#172B3A] font-semibold mb-1">
                    Complaint Time <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={complaintTime}
                    onChange={(e) => setComplaintTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#172B3A] font-semibold mb-1">
                    Victim Region <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={victimRegion}
                    onChange={(e) => setVictimRegion(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Optional Fields Grid */}
              <div className="pt-2 border-t border-[#DCE4EA] space-y-2">
                <span className="text-[10px] font-bold text-[#5F6B76] uppercase tracking-wider block">
                  OPTIONAL TRANSACTION INTELLIGENCE
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#5F6B76] font-semibold mb-1">
                      Destination Account (Hop 1)
                    </label>
                    <input
                      type="text"
                      value={destinationAccount}
                      onChange={(e) => setDestinationAccount(e.target.value)}
                      placeholder="e.g. ACC-SYNTH-8901"
                      className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[#5F6B76] font-semibold mb-1">
                      Transaction Reference / UTR
                    </label>
                    <input
                      type="text"
                      value={transactionReference}
                      onChange={(e) => setTransactionReference(e.target.value)}
                      placeholder="e.g. IMPS/7102948201/TRANS"
                      className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#5F6B76] font-semibold mb-1">
                    Complaint Narrative
                  </label>
                  <textarea
                    value={complaintNarrative}
                    onChange={(e) => setComplaintNarrative(e.target.value)}
                    placeholder="Brief description of incident..."
                    rows={2}
                    className="w-full px-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DCE4EA]">
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="px-4 py-2 border border-[#DCE4EA] rounded-lg bg-[#F7F9FB] hover:bg-[#EAF4FB] text-[#172B3A] font-medium cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1769AA] hover:bg-[#0D4778] text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>CREATE & ANALYSE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 3. Search & Filter Bar (User Requirement 9) */}
      <div className="bg-white border border-[#DCE4EA] rounded-xl p-3.5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#5F6B76] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH EXISTING CASE: By ID, fraud category, region or account..."
              className="w-full pl-9 pr-3 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs text-[#172B3A] focus:outline-none focus:border-[#1769AA] focus:bg-white font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Fraud Filter */}
            <select
              value={fraudFilter}
              onChange={(e) => setFraudFilter(e.target.value)}
              className="px-2.5 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs text-[#172B3A]"
            >
              <option value="ALL">All Fraud Types</option>
              <option value="Investment Scam">Investment Scam</option>
              <option value="UPI Fraud">UPI Fraud</option>
              <option value="Phishing">Phishing</option>
              <option value="Impersonation Fraud">Impersonation Fraud</option>
              <option value="Job Scam">Job Scam</option>
              <option value="Marketplace Fraud">Marketplace Fraud</option>
              <option value="Loan Scam">Loan Scam</option>
            </select>

            {/* Risk Filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-2.5 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs text-[#172B3A]"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MODERATE">Moderate</option>
              <option value="LOW">Low</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-2 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg text-xs text-[#172B3A]"
            >
              <option value="ALL">All Statuses</option>
              <option value="INTELLIGENCE_READY">Intelligence Ready</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="ESCALATED">Escalated</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="text-[11px] text-[#5F6B76] flex items-center justify-between pt-1 border-t border-[#DCE4EA]">
          <span>
            Showing <strong>{filteredCases.length}</strong> matching synthetic case records
          </span>
          <span className="italic">Click any row or OPEN FULL CASE to inspect full dossier</span>
        </div>
      </div>

      {/* Prominent Search Match Card when user is searching */}
      {searchQuery.trim() && filteredCases.length > 0 && (
        <div className="p-4 bg-[#F7F9FB] border-2 border-[#1769AA]/30 rounded-xl space-y-2 animate-fadeIn">
          <span className="text-[10px] font-bold text-[#1769AA] uppercase tracking-wider block">
            CASE SEARCH RESULT
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-[#DCE4EA]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-[#0D4778]">{filteredCases[0].id}</span>
                <span className="text-xs font-semibold text-[#172B3A]">{filteredCases[0].fraudCategory}</span>
                <span className="text-xs font-mono font-bold text-[#172B3A]">
                  ₹{filteredCases[0].fraudAmount.toLocaleString('en-IN')}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    filteredCases[0].overallRisk === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {filteredCases[0].overallRisk}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#5F6B76]">
                <span>
                  Analysis:{' '}
                  <strong className={filteredCases[0]?.prediction ? 'text-[#138A44]' : 'text-amber-700'}>
                    {filteredCases[0]?.prediction ? 'COMPLETED' : 'NOT STARTED'}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Prediction:{' '}
                  <strong className={filteredCases[0]?.prediction ? 'text-[#138A44]' : 'text-amber-700'}>
                    {filteredCases[0]?.prediction ? 'GENERATED' : 'PENDING'}
                  </strong>
                </span>
              </div>
            </div>
            <button
              onClick={() => handleSelect(filteredCases[0])}
              className="px-4 py-2 bg-[#1769AA] hover:bg-[#0D4778] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-xs"
            >
              OPEN FULL CASE
            </button>
          </div>
        </div>
      )}

      {/* 4. Compact Cases Table (User Requirement 9) */}
      <div className="bg-white border border-[#DCE4EA] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F9FB] text-[#5F6B76] border-b border-[#DCE4EA]">
              <tr>
                <th className="py-2.5 px-3.5 font-semibold">Case ID</th>
                <th className="py-2.5 px-3.5 font-semibold">Fraud Type</th>
                <th className="py-2.5 px-3.5 font-semibold">Amount</th>
                <th className="py-2.5 px-3.5 font-semibold">Complaint Time</th>
                <th className="py-2.5 px-3.5 font-semibold">Risk</th>
                <th className="py-2.5 px-3.5 font-semibold">Analysis / Prediction</th>
                <th className="py-2.5 px-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE4EA]">
              {filteredCases.map((c, idx) => {
                const isSelected = c.id === activeCase.id;
                const hasPred = !!c.prediction;
                return (
                  <tr
                    key={`${c.id}-${idx}`}
                    onClick={() => handleSelect(c)}
                    className={`hover:bg-[#EAF4FB]/70 cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#EAF4FB]/40' : ''
                    }`}
                  >
                    <td className="py-3 px-3.5 font-mono font-bold text-[#0D4778]">
                      <div className="flex items-center gap-1.5">
                        <span>{c.id}</span>
                        {c.id === 'TRI-2026-0042' && (
                          <span className="px-1.5 py-0.2 rounded bg-[#FFF3E8] text-[#F58220] font-bold text-[9px]">
                            DEMO
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3.5 font-semibold text-[#172B3A]">
                      {c.fraudCategory}
                    </td>
                    <td className="py-3 px-3.5 font-mono font-bold text-[#172B3A]">
                      ₹{c.fraudAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3.5 font-mono text-[11px] text-[#5F6B76]">
                      {c.complaintDate}
                    </td>
                    <td className="py-3 px-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          c.overallRisk === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : c.overallRisk === 'HIGH'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.overallRisk}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold w-fit border ${
                            hasPred
                              ? 'bg-[#EAF7EF] text-[#138A44] border-[#138A44]/30'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          {hasPred ? 'Analysis: COMPLETED' : 'Analysis: NOT STARTED'}
                        </span>
                        <span className="text-[10px] text-[#5F6B76]">
                          {hasPred ? 'Prediction: GENERATED' : 'Prediction: PENDING'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(c);
                        }}
                        className="px-3 py-1.5 bg-[#1769AA] hover:bg-[#0D4778] text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                      >
                        OPEN FULL CASE
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
