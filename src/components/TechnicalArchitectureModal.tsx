import React, { useState } from 'react';
import {
  X,
  Database,
  Layers,
  GitFork,
  MapPin,
  Cpu,
  ShieldCheck,
  FileText,
  Activity,
  Server,
  ArrowRight,
} from 'lucide-react';
import { authService } from '../services/authService';

interface TechnicalArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalArchitectureModal: React.FC<TechnicalArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'datamodel' | 'audit'>('architecture');

  if (!isOpen) return null;

  const auditLogs = authService.getAuditLogs();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-[#DCE4EA] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#DCE4EA] bg-[#F7F9FB] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0D4778] text-white flex items-center justify-center font-bold text-sm">
              त्र
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#0D4778]">
                Technical Architecture & Prototype Info
              </h2>
              <p className="text-xs text-[#5F6B76]">
                TRINETRA Data Layer, Conceptual Schema & System Audit Trail
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5F6B76] hover:text-[#172B3A] hover:bg-[#DCE4EA] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#DCE4EA] bg-white px-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'architecture'
                ? 'border-[#1769AA] text-[#1769AA]'
                : 'border-transparent text-[#5F6B76] hover:text-[#172B3A]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Prototype Data Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('datamodel')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'datamodel'
                ? 'border-[#1769AA] text-[#1769AA]'
                : 'border-transparent text-[#5F6B76] hover:text-[#172B3A]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Data Model & Schemas</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'audit'
                ? 'border-[#1769AA] text-[#1769AA]'
                : 'border-transparent text-[#5F6B76] hover:text-[#172B3A]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Live Audit Trail ({auditLogs.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#EAF4FB] border border-[#1769AA]/30">
                <span className="font-bold text-[#0D4778] block text-xs uppercase tracking-wider mb-1">
                  CONCEPTUAL STORAGE & ANALYTICS STACK
                </span>
                <p className="text-xs text-[#172B3A] leading-relaxed">
                  In production deployment, TRINETRA uses a multi-model data architecture separating structured relational records, spatial indices, and high-performance graph traversals for instant multi-hop trail analysis.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* PostgreSQL */}
                <div className="p-3.5 bg-[#F7F9FB] border border-[#DCE4EA] rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-[#0D4778] font-bold">
                    <Database className="w-4 h-4 text-[#1769AA]" />
                    <span>PostgreSQL (Relational)</span>
                  </div>
                  <p className="text-[11px] text-[#5F6B76] leading-relaxed">
                    Primary transactional store for citizen complaints, case files, account metadata, audit logs, and feedback ground truth.
                  </p>
                  <div className="text-[10px] bg-white p-2 rounded border border-[#DCE4EA] font-mono text-[#172B3A]">
                    Tables: complaints, accounts, cases, audit_logs
                  </div>
                </div>

                {/* PostGIS */}
                <div className="p-3.5 bg-[#F7F9FB] border border-[#DCE4EA] rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-[#0D4778] font-bold">
                    <MapPin className="w-4 h-4 text-[#138A44]" />
                    <span>PostGIS (Geospatial)</span>
                  </div>
                  <p className="text-[11px] text-[#5F6B76] leading-relaxed">
                    Spatial indexing (R-Tree / GiST) for ATM terminal clusters, commercial corridor polygons, and predictive risk perimeters.
                  </p>
                  <div className="text-[10px] bg-white p-2 rounded border border-[#DCE4EA] font-mono text-[#172B3A]">
                    Entities: risk_zones, atm_clusters, spatial_polygons
                  </div>
                </div>

                {/* NetworkX / Neo4j */}
                <div className="p-3.5 bg-[#F7F9FB] border border-[#DCE4EA] rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-[#0D4778] font-bold">
                    <GitFork className="w-4 h-4 text-rose-600" />
                    <span>NetworkX / Neo4j (Graph)</span>
                  </div>
                  <p className="text-[11px] text-[#5F6B76] leading-relaxed">
                    Directed multi-hop transaction topologies, fan-out centrality, mule community detection, and suspicious paths.
                  </p>
                  <div className="text-[10px] bg-white p-2 rounded border border-[#DCE4EA] font-mono text-[#172B3A]">
                    Nodes: Accounts | Edges: Transactions (amount, time)
                  </div>
                </div>
              </div>

              {/* Analytics & Machine Learning */}
              <div className="p-4 bg-[#F7F9FB] border border-[#DCE4EA] rounded-xl space-y-2">
                <span className="font-bold text-[#0D4778] uppercase text-[11px] tracking-wider block">
                  MACHINE LEARNING & EXPLAINABILITY ENGINE
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-[#172B3A]">
                  <div className="space-y-1">
                    <strong className="text-[#1769AA] block">• Predictive Ensemble:</strong>
                    Gradient-boosted decision trees (XGBoost / LightGBM) trained on velocity features, hop distance, and banking hour priors.
                  </div>
                  <div className="space-y-1">
                    <strong className="text-[#1769AA] block">• Explainability Layer:</strong>
                    TreeExplainer (SHAP) calculating exact marginal contributions for every geographic zone and withdrawal window.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DATA MODEL */}
          {activeTab === 'datamodel' && (
            <div className="space-y-4">
              {/* Flowchart Representation */}
              <div className="p-3.5 bg-[#F7F9FB] border border-[#DCE4EA] rounded-xl space-y-2">
                <span className="font-bold text-[#0D4778] uppercase text-[10px] tracking-wider block">
                  END-TO-END DATA FLOW DIAGRAM
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-semibold text-[#172B3A] py-2">
                  <span className="px-2.5 py-1 rounded bg-white border border-[#DCE4EA]">User</span>
                  <span className="text-[#1769AA]">→</span>
                  <span className="px-2.5 py-1 rounded bg-white border border-[#DCE4EA]">Complaint</span>
                  <span className="text-[#1769AA]">→</span>
                  <span className="px-2.5 py-1 rounded bg-white border border-[#DCE4EA]">Case</span>
                  <span className="text-[#1769AA]">→</span>
                  <span className="px-2.5 py-1 rounded bg-white border border-[#DCE4EA]">Transactions</span>
                  <span className="text-[#1769AA]">→</span>
                  <span className="px-2.5 py-1 rounded bg-white border border-[#DCE4EA]">Accounts</span>
                  <span className="text-[#1769AA]">→</span>
                  <span className="px-2.5 py-1 rounded bg-white border border-[#DCE4EA]">Graph Model</span>
                  <span className="text-[#1769AA]">→</span>
                  <span className="px-2.5 py-1 rounded bg-white border border-[#DCE4EA]">Prediction</span>
                  <span className="text-[#1769AA]">→</span>
                  <span className="px-2.5 py-1 rounded bg-white border border-[#DCE4EA]">Risk Zones</span>
                  <span className="text-[#1769AA]">→</span>
                  <span className="px-2.5 py-1 rounded bg-[#EAF7EF] border border-[#138A44]/30 text-[#065F46]">Outcome Feedback</span>
                </div>
              </div>

              {/* 9 Conceptual Database Tables */}
              <div className="space-y-2">
                <span className="font-bold text-[#0D4778] uppercase text-[10px] tracking-wider block">
                  9 CONCEPTUAL SCHEMA TABLES
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-[#F7F9FB] rounded-lg border border-[#DCE4EA]">
                    <div className="font-mono font-bold text-[#0D4778]">1. users</div>
                    <div className="text-[10px] text-[#5F6B76] mt-0.5">user_id, email, password_hash, role, access_level, last_login</div>
                  </div>
                  <div className="p-2.5 bg-[#F7F9FB] rounded-lg border border-[#DCE4EA]">
                    <div className="font-mono font-bold text-[#0D4778]">2. complaints</div>
                    <div className="text-[10px] text-[#5F6B76] mt-0.5">complaint_id, date, fraud_type, amount, payment_mode, victim_region</div>
                  </div>
                  <div className="p-2.5 bg-[#F7F9FB] rounded-lg border border-[#DCE4EA]">
                    <div className="font-mono font-bold text-[#0D4778]">3. cases</div>
                    <div className="text-[10px] text-[#5F6B76] mt-0.5">case_id, status, assigned_user, risk_level, layers_count</div>
                  </div>
                  <div className="p-2.5 bg-[#F7F9FB] rounded-lg border border-[#DCE4EA]">
                    <div className="font-mono font-bold text-[#0D4778]">4. accounts</div>
                    <div className="text-[10px] text-[#5F6B76] mt-0.5">account_id, bank, ifsc, risk_score, node_type, flag_reasons</div>
                  </div>
                  <div className="p-2.5 bg-[#F7F9FB] rounded-lg border border-[#DCE4EA]">
                    <div className="font-mono font-bold text-[#0D4778]">5. transactions</div>
                    <div className="text-[10px] text-[#5F6B76] mt-0.5">txn_id, from_acc, to_acc, amount, timestamp, hop_index, channel</div>
                  </div>
                  <div className="p-2.5 bg-[#F7F9FB] rounded-lg border border-[#DCE4EA]">
                    <div className="font-mono font-bold text-[#0D4778]">6. predictions</div>
                    <div className="text-[10px] text-[#5F6B76] mt-0.5">prediction_id, case_id, likely_mode, window_start, window_end, confidence</div>
                  </div>
                  <div className="p-2.5 bg-[#F7F9FB] rounded-lg border border-[#DCE4EA]">
                    <div className="font-mono font-bold text-[#0D4778]">7. risk_zones</div>
                    <div className="text-[10px] text-[#5F6B76] mt-0.5">zone_id, rank, name, geom (PostGIS Polygon), risk_level, confidence</div>
                  </div>
                  <div className="p-2.5 bg-[#F7F9FB] rounded-lg border border-[#DCE4EA]">
                    <div className="font-mono font-bold text-[#0D4778]">8. case_outcomes</div>
                    <div className="text-[10px] text-[#5F6B76] mt-0.5">outcome_id, case_id, actual_mode, actual_zone, recovered_amount, feedback</div>
                  </div>
                  <div className="p-2.5 bg-[#F7F9FB] rounded-lg border border-[#DCE4EA]">
                    <div className="font-mono font-bold text-[#0D4778]">9. audit_logs</div>
                    <div className="text-[10px] text-[#5F6B76] mt-0.5">log_id, timestamp, user_id, action, target_entity, details</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-[#DCE4EA]">
                <span className="text-[11px] font-bold text-[#0D4778] uppercase tracking-wider">
                  SESSION AUDIT LOGS (REAL-TIME ACTIVITY RECORD)
                </span>
                <span className="text-[10px] text-[#5F6B76]">
                  Prototype audit trail for accountability
                </span>
              </div>

              <div className="overflow-x-auto border border-[#DCE4EA] rounded-xl bg-white">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F7F9FB] text-[#5F6B76] border-b border-[#DCE4EA]">
                    <tr>
                      <th className="py-2 px-3 font-semibold">Timestamp</th>
                      <th className="py-2 px-3 font-semibold">User</th>
                      <th className="py-2 px-3 font-semibold">Action</th>
                      <th className="py-2 px-3 font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE4EA] font-mono text-[11px]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#F7F9FB]">
                        <td className="py-2 px-3 text-[#5F6B76] whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="py-2 px-3 text-[#0D4778] whitespace-nowrap font-semibold">
                          {log.userName}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              log.action === 'LOGIN'
                                ? 'bg-emerald-100 text-emerald-800'
                                : log.action === 'LOGOUT'
                                ? 'bg-slate-100 text-slate-800'
                                : log.action === 'CASE_OPENED'
                                ? 'bg-blue-100 text-blue-800'
                                : log.action === 'COMPLAINT_CREATED'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-[#172B3A] font-sans">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#DCE4EA] bg-[#F7F9FB] flex items-center justify-between">
          <div className="text-[11px] text-[#5F6B76]">
            TRINETRA • Smart India Hackathon 2026 • Team Furious Rookie
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1769AA] text-white rounded-lg font-bold text-xs hover:bg-[#0D4778] cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
