import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  MessageSquare,
  MapPin,
  Clock,
  Coins,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
} from 'lucide-react';
import { CashOutMode, FeedbackOutcomeRecord, CybercrimeComplaint } from '../types';

interface FeedbackModalProps {
  caseId?: string;
  activeCase?: CybercrimeComplaint;
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (record: FeedbackOutcomeRecord) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  caseId,
  activeCase,
  isOpen,
  onClose,
  onSubmitFeedback,
}) => {
  if (!isOpen) return null;

  const targetCaseId = caseId || activeCase?.id || 'TRI-2026-0042';

  const [cashOutOccurred, setCashOutOccurred] = useState<boolean>(true);
  const [actualRegion, setActualRegion] = useState('Chennai T. Nagar (Usman Rd)');
  const [actualTime, setActualTime] = useState('14:42 IST');
  const [actualMethod, setActualMethod] = useState<CashOutMode>('ATM Withdrawal');
  const [predictionUseful, setPredictionUseful] = useState<boolean>(true);
  const [notes, setNotes] = useState(
    'Field officer reported cash-out attempt intercepted at Usman Road kiosk within predicted 45-minute window.'
  );

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: FeedbackOutcomeRecord = {
      caseId: targetCaseId,
      recordedAt: new Date().toISOString(),
      cashOutOccurred,
      actualRegion,
      actualTime,
      actualMethod,
      predictionUseful,
      notes,
      investigatorId: 'OFFICER-SHARMA-892',
    };

    onSubmitFeedback(record);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-300 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#0A3157] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#138A44]" />
            <h3 className="font-bold text-sm">
              Record Field Outcome & Evaluation Feedback
            </h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#138A44] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#0A3157]">
              Outcome Recorded for Future Model Evaluation
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              The verified ground truth has been catalogued in the synthetic feedback corpus for
              subsequent spatio-temporal calibration.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-[#0A3157] leading-relaxed">
              <strong>Human-in-the-Loop Feedback Protocol:</strong>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Recording verified ground-truth cash-out results trains future regional clustering
                and validates time window accuracy.
              </p>
            </div>

            {/* Q1: Cash-out occurred? */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Did cash-out attempt / liquidation occur?
              </label>
              <div className="flex gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="occurred"
                    checked={cashOutOccurred === true}
                    onChange={() => setCashOutOccurred(true)}
                  />
                  <span>Yes, cash-out attempted / verified</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="occurred"
                    checked={cashOutOccurred === false}
                    onChange={() => setCashOutOccurred(false)}
                  />
                  <span>No cash-out / funds frozen</span>
                </label>
              </div>
            </div>

            {/* Q2: Actual Region */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Actual Location / Region of Cash-Out
              </label>
              <input
                type="text"
                value={actualRegion}
                onChange={(e) => setActualRegion(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>

            {/* Q3: Actual Time & Method */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Actual Timestamp
                </label>
                <input
                  type="text"
                  value={actualTime}
                  onChange={(e) => setActualTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Actual Liquidation Mode
                </label>
                <select
                  value={actualMethod}
                  onChange={(e) => setActualMethod(e.target.value as CashOutMode)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="ATM Withdrawal">ATM Withdrawal</option>
                  <option value="Further Transfer">Further Transfer</option>
                  <option value="POS / Merchant">POS / Merchant</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash Drop / Courier">Cash Drop / Courier</option>
                </select>
              </div>
            </div>

            {/* Q4: Was prediction useful? */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Was TRINETRA's prediction operationally useful?
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setPredictionUseful(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                    predictionUseful
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Yes, highly actionable</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPredictionUseful(false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                    !predictionUseful
                      ? 'bg-red-50 text-red-800 border-red-300'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>No, false alarm</span>
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Investigator Observation Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            {/* Submit buttons */}
            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#138A44] hover:bg-[#0e6b34] text-white rounded-lg font-bold"
              >
                Save Ground Truth Outcome
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
