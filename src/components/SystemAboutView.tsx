import React from 'react';
import {
  ShieldCheck,
  Lock,
  Layers,
  Cpu,
  Compass,
  AlertTriangle,
  FileCheck2,
  Users,
  Award,
  ExternalLink,
  GitBranch,
} from 'lucide-react';

export const SystemAboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Hero Header */}
      <div className="bg-white border border-[#DCE4EA] rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-md bg-[#FFF3E8] text-[#F58220] font-bold text-xs border border-[#F58220]/30">
            Smart India Hackathon 2026
          </span>
          <span className="text-xs text-[#5F6B76]">
            Team: <strong className="text-[#0D4778]">Furious Rookie</strong>
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-[#EAF7EF] text-[#138A44] font-semibold border border-[#138A44]/30">
            Cybersecurity & Digital Governance
          </span>
        </div>
        <h1 className="text-xl font-bold text-[#0D4778]">
          TRINETRA: Predictive Cybercrime Cash-Out Intelligence Platform
        </h1>
        <p className="text-xs text-[#5F6B76] mt-1 leading-relaxed">
          “Predict. Prioritize. Intervene.” — Transforming reactive transaction tracing into proactive spatio-temporal cash-out decision support.
        </p>
      </div>

      {/* Problem Statement Card */}
      <div className="bg-white border border-[#DCE4EA] rounded-xl p-5 shadow-xs space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#1769AA]">
          SIH 2026 Problem Statement
        </h2>
        <blockquote className="p-3.5 rounded-lg bg-[#F7F9FB] border-l-4 border-[#1769AA] text-xs text-[#172B3A] leading-relaxed italic">
          “Development of a Predictive Analytics Framework for Cybercrime Complaints to Forecast Likely Cash Withdrawal Locations in Advance, Enabling Generation of Actionable Intelligence for Timely and Proactive Cybercrime Intervention.”
        </blockquote>

        <div className="text-xs text-[#5F6B76] leading-relaxed space-y-2 pt-1">
          <p>
            <strong className="text-[#172B3A]">The Operational Challenge:</strong> Conventional cybercrime portals only trace{' '}
            <span className="text-rose-700 font-semibold">“Where did the money go?”</span> after funds have already been liquidated at ATMs or merchant terminals.
          </p>
          <p>
            <strong className="text-[#172B3A]">TRINETRA's Innovation:</strong> Introducing a forward-looking decision-support paradigm:{' '}
            <span className="text-[#138A44] font-bold">
              “Where is the money statistically likely to emerge next, and within what operational time window?”
            </span>
          </p>
        </div>
      </div>

      {/* Digital Nakabandi Concept */}
      <div className="bg-white border border-[#DCE4EA] rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#F58220]" />
          <h2 className="text-sm font-bold text-[#0D4778] uppercase tracking-wide">
            The Concept of “Digital Nakabandi”
          </h2>
        </div>
        <p className="text-xs text-[#172B3A] leading-relaxed">
          Instead of attempting to pinpoint an exact ATM (which is statistically unreliable and prone to false alerts), <strong>Digital Nakabandi</strong> establishes a ranked, probabilistic geographic perimeter around corridors where cash-out activity is statistically more probable. By forecasting <strong>WHERE</strong> (ranked risk zones), <strong>WHEN</strong> (35–65 min withdrawal window), and <strong>HOW</strong> (ATM vs. Further Transfer vs. POS), authorized cybercrime investigators can prioritize patrol advisories and coordinate timely field intervention.
        </p>
        <div className="p-3 rounded-lg bg-[#EAF7EF] border border-[#138A44]/30 text-xs text-[#065F46]">
          <strong>Decision-Support Safeguard:</strong> TRINETRA serves strictly as an analytical decision-support system. It does not perform autonomous account freezes, dispatch officers, or initiate automated legal processes. Final investigative authority rests solely with accredited human officers.
        </div>
      </div>

      {/* Architecture & Tech Stack */}
      <div className="bg-white border border-[#DCE4EA] rounded-xl p-5 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-[#0D4778] flex items-center gap-2 uppercase tracking-wide">
          <Layers className="w-4 h-4 text-[#1769AA]" />
          Prototype Architecture & Multi-Modal Layers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-[#F7F9FB] border border-[#DCE4EA] space-y-2">
            <span className="font-bold text-[#0D4778] block">Frontend & GIS Analytics</span>
            <ul className="list-disc list-inside text-[#5F6B76] space-y-1 text-xs">
              <li>React + TypeScript + Vite Single Page Application</li>
              <li>Light, accessible SIH Government-Tech UI palette</li>
              <li>Leaflet + OpenStreetMap for GIS Nakabandi mapping</li>
              <li>Interactive SVG multi-hop transaction topology graph</li>
              <li>Recharts for quantitative model benchmarking</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F7F9FB] border border-[#DCE4EA] space-y-2">
            <span className="font-bold text-[#0D4778] block">Predictive & Explainable Analytics</span>
            <ul className="list-disc list-inside text-[#5F6B76] space-y-1 text-xs">
              <li>Mule Risk Engine (0–100 weighted interpretable scoring)</li>
              <li>Historical Case Similarity Matcher (Cosine distance)</li>
              <li>Spatio-temporal clustering and hazard window forecasting</li>
              <li>Feature attribution contribution charts</li>
              <li>Synthetic dataset: 110+ complaints, 270+ accounts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security, Privacy & Data Governance */}
      <div className="bg-white border border-[#DCE4EA] rounded-xl p-5 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-[#0D4778] flex items-center gap-2 uppercase tracking-wide">
          <Lock className="w-4 h-4 text-[#138A44]" />
          Security, Privacy & Data Governance Safeguards
        </h2>

        <div className="space-y-3 text-xs text-[#172B3A] leading-relaxed">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#138A44] shrink-0 mt-0.5" />
            <div>
              <strong>Privacy-Preserving Prototype:</strong> All demonstration records are synthetic representations. No real citizen PII, live account numbers, or genuine police case data is stored or processed.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#138A44] shrink-0 mt-0.5" />
            <div>
              <strong>Role-Based Access Control (RBAC):</strong> Access is restricted to authenticated law enforcement personnel with audit logging for every dossier viewed or report printed.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#138A44] shrink-0 mt-0.5" />
            <div>
              <strong>Future Integration Readiness:</strong> Designed for potential interoperability with authorized national portals (NCRP, CFCFRMS) and banking gateways subject to statutory permissions, API tokenization, and end-to-end encryption.
            </div>
          </div>
        </div>
      </div>

      {/* Team Furious Rookie Footer */}
      <div className="p-4 rounded-xl bg-white border border-[#DCE4EA] text-xs text-[#5F6B76] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-2xs">
        <div>
          <span className="font-bold text-[#0D4778]">Team Furious Rookie</span> • Smart India Hackathon 2026
          <div className="text-[11px] text-[#5F6B76] mt-0.5">
            Prototype developed under the SIH cybersecurity and predictive intelligence theme.
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#EAF4FB] text-[#1769AA] border border-[#1769AA]/30 font-bold text-xs uppercase">
          Version 1.0 Prototype
        </span>
      </div>
    </div>
  );
};
