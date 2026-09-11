import React, { useState } from 'react';
import {
  FileText,
  Printer,
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { CybercrimeComplaint, FeedbackOutcomeRecord } from '../types';
import { authService } from '../services/authService';
import { ReportModal } from './ReportModal';
import { FeedbackModal } from './FeedbackModal';
import { CaseHeader } from './CaseHeader';

interface CaseIntelligenceViewProps {
  activeCase: CybercrimeComplaint;
  onNavigate: (viewId: any) => void;
  onUpdateCaseStatus?: (status: CybercrimeComplaint['status']) => void;
}

export const CaseIntelligenceView: React.FC<CaseIntelligenceViewProps> = ({
  activeCase,
  onNavigate,
  onUpdateCaseStatus,
}) => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false);
  const [reviewerUser, setReviewerUser] = useState<{ name: string; role: string } | null>(null);
  const [reviewStatus, setReviewStatus] = useState<string>(activeCase.status || 'INTELLIGENCE_READY');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReviewIntelligence = () => {
    const user = authService.getCurrentUser();
    const name = user?.name || 'Raghu';
    const role = user?.role || 'Network Intelligence Analyst';
    setIsReviewed(true);
    setReviewerUser({ name, role });
    authService.recordAuditLog(
      'INTELLIGENCE_REVIEWED',
      `Intelligence for ${activeCase.id} reviewed by prototype user ${name} (${role})`
    );
    showToast(`Intelligence reviewed by ${name} (${role})`);
  };

  const handleFeedbackSubmitted = (record: FeedbackOutcomeRecord) => {
    showToast('Ground truth outcome logged for model evaluation.');
  };

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto">
      {/* Persistent Case Header */}
      <CaseHeader
        activeCase={activeCase}
        onNavigate={onNavigate}
        currentView="reports"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-[#EAF7EF] border border-[#138A44]/30 text-xs text-[#065F46] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#138A44]" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[11px] text-[#138A44] font-semibold">Authorized Action</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white border border-[#DCE4EA] rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded bg-[#EAF4FB] text-[#1769AA] text-xs font-mono font-bold border border-[#1769AA]/30">
              {activeCase.id}
            </span>
            <span className="text-xs text-[#5F6B76]">
              Decision Support Dossier
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#0D4778]">
            Actionable Intelligence Report
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('prediction')}
            className="px-3 py-1.5 rounded-lg bg-[#F7F9FB] hover:bg-[#DCE4EA] text-[#0D4778] border border-[#DCE4EA] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View Prediction</span>
          </button>
          <button
            onClick={() => setIsReportOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#1769AA] hover:bg-[#0D4778] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT / EXPORT REPORT</span>
          </button>
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#EAF7EF] hover:bg-[#138A44]/15 text-[#065F46] border border-[#138A44]/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#138A44]" />
            <span>Log Outcome</span>
          </button>
        </div>
      </div>

      {/* ACTIONABLE INTELLIGENCE REPORT CARD (User Requirement 8) */}
      <div className="bg-white border-2 border-[#1769AA]/40 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DCE4EA]">
          <div>
            <div className="text-[10px] font-bold text-[#1769AA] tracking-wider uppercase mb-0.5">
              TRINETRA CYBERCRIME ANALYTICS
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#0D4778]">
              ACTIONABLE INTELLIGENCE REPORT
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5F6B76]">Status:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAF4FB] text-[#1769AA] font-bold text-xs border border-[#1769AA]/30">
              {reviewStatus}
            </span>
          </div>
        </div>

        {/* 1st Row of Core Parameters: Case, Overall Risk, Probable Cash-Out Zone, Alternative Zones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div className="bg-[#F7F9FB] p-2.5 rounded-lg border border-[#DCE4EA]">
            <span className="text-[10px] text-[#5F6B76] block uppercase font-medium">Case:</span>
            <span className="font-mono font-bold text-sm text-[#0D4778] block mt-0.5">
              {activeCase.id}
            </span>
            <span className="text-[11px] text-[#172B3A] font-medium">
              Investment Scam • ₹1,85,000
            </span>
          </div>

          <div className="bg-[#F7F9FB] p-2.5 rounded-lg border border-[#DCE4EA]">
            <span className="text-[10px] text-[#5F6B76] block uppercase font-medium">Overall Risk:</span>
            <span className="font-bold text-sm text-rose-700 block mt-0.5">
              HIGH
            </span>
            <span className="text-[11px] text-[#5F6B76]">
              Composite risk score: 87 / 100
            </span>
          </div>

          <div className="bg-[#F7F9FB] p-2.5 rounded-lg border border-[#DCE4EA]">
            <span className="text-[10px] text-[#5F6B76] block uppercase font-medium">Probable Cash-Out Zone:</span>
            <span className="font-bold text-sm text-[#0D4778] block mt-0.5">
              T. Nagar Corridor
            </span>
            <span className="text-[11px] text-[#138A44] font-medium">
              Top ranked GIS perimeter
            </span>
          </div>

          <div className="bg-[#F7F9FB] p-2.5 rounded-lg border border-[#DCE4EA]">
            <span className="text-[10px] text-[#5F6B76] block uppercase font-medium">Alternative Zones:</span>
            <span className="font-bold text-xs text-[#172B3A] block mt-0.5">
              Guindy, Saidapet
            </span>
            <span className="text-[11px] text-[#5F6B76]">
              Secondary probability fallbacks
            </span>
          </div>
        </div>

        {/* 2nd Row: Expected Window, Likely Mode, Prediction Confidence, High-Risk Mule */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div className="bg-[#F7F9FB] p-2.5 rounded-lg border border-[#DCE4EA]">
            <span className="text-[10px] text-[#5F6B76] block uppercase font-medium">Expected Window:</span>
            <span className="font-mono font-bold text-xs text-[#172B3A] block mt-0.5">
              14:20 – 15:05 IST
            </span>
            <span className="text-[10px] text-[#5F6B76]">
              ~35–65 min from hop 3
            </span>
          </div>

          <div className="bg-[#F7F9FB] p-2.5 rounded-lg border border-[#DCE4EA]">
            <span className="text-[10px] text-[#5F6B76] block uppercase font-medium">Likely Mode:</span>
            <span className="font-bold text-xs text-[#138A44] block mt-0.5">
              ATM Withdrawal (64%)
            </span>
            <span className="text-[10px] text-[#5F6B76]">
              Followed by Further Transfer (23%)
            </span>
          </div>

          <div className="bg-[#F7F9FB] p-2.5 rounded-lg border border-[#DCE4EA]">
            <span className="text-[10px] text-[#5F6B76] block uppercase font-medium">Prediction Confidence:</span>
            <span className="font-mono font-bold text-sm text-[#0D4778] block mt-0.5">
              78%
            </span>
            <span className="text-[10px] text-[#138A44] font-medium">
              Calibrated multi-layer evidence
            </span>
          </div>

          <div className="bg-[#FEF2F2] p-2.5 rounded-lg border border-[#DC2626]/30">
            <span className="text-[10px] text-rose-700 block uppercase font-medium">High-Risk Mule:</span>
            <span className="font-bold text-xs text-rose-900 block mt-0.5">
              Mule C — 87/100
            </span>
            <span className="text-[10px] text-rose-700">
              Terminal Aggregator Account
            </span>
          </div>
        </div>

        {/* 3rd Row: KEY REASONING & RECOMMENDED INVESTIGATIVE PRIORITY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-2">
          {/* Key Reasoning */}
          <div className="lg:col-span-6 bg-[#F7F9FB] rounded-xl p-3.5 border border-[#DCE4EA]">
            <h3 className="text-xs font-bold text-[#0D4778] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#DC2626]" />
              KEY REASONING
            </h3>
            <ul className="space-y-1.5 text-xs text-[#172B3A]">
              <li className="flex items-start gap-1.5">
                <span className="text-[#1769AA] font-bold">•</span>
                <span><strong>Rapid multi-hop fund movement:</strong> 3 hops across 3 banks within 26 minutes</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#1769AA] font-bold">•</span>
                <span><strong>Mule C anomaly:</strong> 92% pass-through forwarding, PIN reset 40 min prior</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#1769AA] font-bold">•</span>
                <span><strong>Historical pattern similarity:</strong> 92.4% match with past syndicate case #0819</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#1769AA] font-bold">•</span>
                <span><strong>Geographic risk perimeter:</strong> High concentration in T. Nagar Usman Road corridor</span>
              </li>
            </ul>
          </div>

          {/* Investigative Priority & Action */}
          <div className="lg:col-span-6 bg-[#F7F9FB] rounded-xl p-3.5 border border-[#DCE4EA] flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#5F6B76] uppercase tracking-wider block">
                RECOMMENDED INVESTIGATIVE PRIORITY: HIGH
              </span>
              <div className="mt-1.5 text-xs text-[#172B3A]">
                <span className="font-semibold text-[#5F6B76] block">Suggested Next Step:</span>
                <span className="font-medium text-[#0D4778]">Investigator review and authorized coordination</span>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-[#DCE4EA] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <span className="text-xs text-[#5F6B76] block">Investigator Verification:</span>
                {!isReviewed ? (
                  <span className="text-xs font-mono font-bold text-amber-800 block mt-0.5">
                    PENDING HUMAN REVIEW
                  </span>
                ) : (
                  <div className="text-xs text-[#172B3A] mt-1 space-y-0.5">
                    <span className="text-[10px] font-semibold text-[#5F6B76] uppercase block">Reviewed by:</span>
                    <div className="font-bold text-[#0D4778]">{reviewerUser?.name || 'Raghu'}</div>
                    <div className="text-[#5F6B76] text-[11px]">{reviewerUser?.role || 'Network Intelligence Analyst'}</div>
                    <div className="text-[10px] font-semibold text-[#138A44]">Prototype User</div>
                  </div>
                )}
              </div>

              {!isReviewed && (
                <button
                  onClick={handleReviewIntelligence}
                  className="px-3.5 py-1.5 bg-[#1769AA] hover:bg-[#0D4778] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs self-start sm:self-auto uppercase tracking-wide"
                >
                  REVIEW INTELLIGENCE
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4. Bottom Lifecyle Pipeline (User Requirement 8) */}
        {/* AI ANALYSIS → INVESTIGATOR REVIEW → AUTHORIZED ACTION */}
        <div className="pt-3 border-t border-[#DCE4EA]">
          <div className="bg-[#F7F9FB] border border-[#DCE4EA] rounded-xl p-3">
            <div className="text-[10px] font-bold text-[#5F6B76] uppercase tracking-wider text-center mb-2">
              DECISION SUPPORT PROTOCOL
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center text-center text-xs font-bold">
              {/* Stage 1: AI ANALYSIS */}
              <div className="bg-white border border-[#1769AA]/30 rounded-lg p-2 text-[#0D4778] shadow-2xs">
                <span className="text-[9px] text-[#1769AA] uppercase block font-semibold">STAGE 1</span>
                AI ANALYSIS
              </div>

              <div className="text-[#1769AA] font-bold text-sm hidden sm:block">→</div>

              {/* Stage 2: INVESTIGATOR REVIEW */}
              <div className="bg-white border border-[#F58220]/30 rounded-lg p-2 text-[#B45309] shadow-2xs">
                <span className="text-[9px] text-[#F58220] uppercase block font-semibold">STAGE 2</span>
                INVESTIGATOR REVIEW
              </div>

              <div className="text-[#F58220] font-bold text-sm hidden sm:block">→</div>

              {/* Stage 3: AUTHORIZED ACTION */}
              <div className="bg-white border border-[#138A44]/30 rounded-lg p-2 text-[#065F46] shadow-2xs">
                <span className="text-[9px] text-[#138A44] uppercase block font-semibold">STAGE 3</span>
                AUTHORIZED ACTION
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        activeCase={activeCase}
      />
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        activeCase={activeCase}
        onSubmitFeedback={handleFeedbackSubmitted}
      />
    </div>
  );
};
