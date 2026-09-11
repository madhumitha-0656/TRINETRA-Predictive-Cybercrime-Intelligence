import React from 'react';
import {
  FileText,
  Printer,
  Download,
  X,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Clock,
  Coins,
  CheckCircle2,
} from 'lucide-react';
import { CybercrimeComplaint } from '../types';

interface ReportModalProps {
  complaint?: CybercrimeComplaint;
  activeCase?: CybercrimeComplaint;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  complaint: propComplaint,
  activeCase,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const complaint = activeCase || propComplaint;
  if (!complaint) return null;

  const p = complaint.prediction;
  const topZone = p?.whereZones?.[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="bg-[#0A3157] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#F58220]" />
            <span className="font-bold text-sm tracking-wide">
              TRINETRA Actionable Cybercrime Intelligence Report
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              title="Print / Save as PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 text-xs font-sans leading-normal">
          {/* Header block */}
          <div className="border-b-2 border-[#0A3157] pb-4 flex justify-between items-start">
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#1261A0]">
                Smart India Hackathon 2026 Prototype • Decision Support Intelligence
              </div>
              <h1 className="text-xl font-extrabold text-[#0A3157] tracking-tight font-mono">
                ACTIONABLE CASH-OUT INTELLIGENCE REPORT
              </h1>
              <div className="text-xs text-slate-500 mt-0.5">
                TRINETRA Predictive Cybercrime Cash-Out Intelligence Network
              </div>
            </div>
            <div className="text-right font-mono text-xs">
              <div className="font-bold text-[#0A3157]">CASE REF: {complaint.id}</div>
              <div className="text-slate-500">Date: {complaint.complaintDate}</div>
              <div className="text-red-700 font-bold uppercase mt-1">
                Priority: IMMEDIATE FIELD PATROL
              </div>
            </div>
          </div>

          {/* Classification & Disclaimer Banner */}
          <div className="bg-amber-50 border border-amber-300 p-3 rounded-lg text-amber-950 text-[11px] leading-relaxed flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>PROTOTYPE SYNTHETIC INTELLIGENCE — DECISION SUPPORT ONLY:</strong>
              <br />
              This report is generated using synthetic demonstration algorithms for decision assistance.
              It does NOT constitute an automated search warrant, asset freeze order, or arrest warrant.
              All actions remain strictly under the jurisdiction of authorized investigating officers.
            </div>
          </div>

          {/* Section 1: Complaint & Financial Trail Summary */}
          <div>
            <h3 className="text-xs font-bold text-[#0A3157] uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
              1. Incident & Fund Propagation Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 block">Defrauded Amount:</span>
                <span className="font-bold text-sm font-mono text-[#DC2626]">
                  ₹{complaint.fraudAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Fraud Classification:</span>
                <span className="font-semibold text-slate-800">{complaint.fraudCategory}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Current Trail Depth:</span>
                <span className="font-bold font-mono text-slate-800">
                  {complaint.currentLayer} Hops (Terminal)
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Overall Risk Tier:</span>
                <span className="font-bold text-red-700 font-mono">{complaint.overallRisk}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Digital Nakabandi Predictive Forecast */}
          <div>
            <h3 className="text-xs font-bold text-[#0A3157] uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
              2. Digital Nakabandi Predictive Forecast (WHERE + WHEN + HOW)
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-[#0A3157]">
                    Primary Zone: {topZone?.name}
                  </span>
                  <span className="font-mono font-bold text-xs bg-[#1261A0] text-white px-2 py-0.5 rounded">
                    {topZone?.confidencePercent}% Confidence
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] mb-2">{topZone?.areaDescription}</p>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <strong>Perimeter Radius:</strong> {topZone?.radiusMeters}m
                  </div>
                  <div>
                    <strong>Withdrawal Window:</strong> {topZone?.withdrawalWindow}
                  </div>
                  <div>
                    <strong>Likely Method:</strong> {topZone?.likelyMode} ({topZone?.likelyModePercent}%)
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <strong>Alternative Zone #2:</strong> {p?.whereZones?.[1]?.name || 'Secondary Zone'} (
                  {p?.whereZones?.[1]?.confidencePercent || 54}% Conf.)
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <strong>Alternative Zone #3:</strong> {p?.whereZones?.[2]?.name || 'Tertiary Zone'} (
                  {p?.whereZones?.[2]?.confidencePercent || 37}% Conf.)
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Flagged Mule Accounts */}
          <div>
            <h3 className="text-xs font-bold text-[#0A3157] uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
              3. Identified Mule Account Intermediaries
            </h3>
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 uppercase text-[9px]">
                  <th className="p-1.5">Account ID</th>
                  <th className="p-1.5">Role</th>
                  <th className="p-1.5">Risk Score</th>
                  <th className="p-1.5">Forwarding Velocity</th>
                  <th className="p-1.5">Key Flag Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                <tr>
                  <td className="p-1.5 font-bold">ACC-MULE-A-42</td>
                  <td className="p-1.5">Layer 1 Transit</td>
                  <td className="p-1.5 text-orange-600 font-bold">78 / 100</td>
                  <td className="p-1.5">12 mins</td>
                  <td className="p-1.5 font-sans">91.8% funds forwarded immediately</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-bold">ACC-MULE-B-42</td>
                  <td className="p-1.5">Layer 2 Funnel</td>
                  <td className="p-1.5 text-red-600 font-bold">86 / 100</td>
                  <td className="p-1.5">9 mins</td>
                  <td className="p-1.5 font-sans">High graph betweenness centrality</td>
                </tr>
                <tr className="bg-red-50/50">
                  <td className="p-1.5 font-bold text-red-900">ACC-MULE-C-42</td>
                  <td className="p-1.5 font-bold text-red-800">Terminal Cash-Out</td>
                  <td className="p-1.5 text-red-800 font-bold">87 / 100</td>
                  <td className="p-1.5">Terminal</td>
                  <td className="p-1.5 font-sans">ATM card activated 40 min prior</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 4: Recommended Priority & Verification Plan */}
          <div>
            <h3 className="text-xs font-bold text-[#0A3157] uppercase tracking-wider border-b border-slate-200 pb-1 mb-2">
              4. Recommended Investigative Priority
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px] leading-relaxed">
              <li>
                <strong>Recommended Investigative Priority:</strong> HIGH
              </li>
              <li>
                <strong>Suggested Next Step:</strong> Investigator review and authorized coordination
              </li>
              <li>
                <strong>Prediction Confidence:</strong> 78% (Calibrated Multi-Layer Evidence)
              </li>
              <li>
                <strong>Target Sector:</strong> Dispatch patrol units to T. Nagar Usman Road & Panagal Park ATM cluster.
              </li>
              <li>
                <strong>Time Criticality:</strong> Estimated withdrawal execution within 14:20 – 15:05 IST (~35–65 minutes).
              </li>
              <li>
                <strong>Inter-Agency Action:</strong> Issue authorized banking liaison coordination with designated nodal officers.
              </li>
            </ul>
          </div>

          {/* Decision Support Protocol Pipeline */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              DECISION SUPPORT LIFECYCLE PROTOCOL
            </span>
            <div className="flex items-center justify-center gap-3 text-[10px] font-bold text-slate-700">
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800">AI ANALYSIS</span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">INVESTIGATOR REVIEW</span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-green-100 text-green-800">AUTHORIZED ACTION</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t border-slate-300 flex justify-between items-end text-[10px] text-slate-500">
            <div>
              Generated by TRINETRA Decision Support System<br />
              Smart India Hackathon 2026 • Team Furious Rookie
            </div>
            <div className="text-right">
              ____________________________________<br />
              Authorized Reviewer Signature (Prototype User)
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 py-3 flex justify-between items-center text-xs">
          <span className="text-slate-500 text-[11px]">
            Document ID: TRINETRA-REP-{complaint.id}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded bg-[#1261A0] text-white hover:bg-[#0A3157] font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
