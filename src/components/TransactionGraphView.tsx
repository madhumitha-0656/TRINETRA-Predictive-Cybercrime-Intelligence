import React, { useState, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  GitFork,
  ShieldAlert,
  Clock,
  Coins,
  ChevronRight,
  ArrowRight,
  UserCheck,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import {
  CybercrimeComplaint,
  SyntheticAccount,
  SyntheticTransaction,
  AccountNodeType,
} from '../types';
import {
  DEMO_CASE_ACCOUNTS,
  DEMO_CASE_TRANSACTIONS,
  SYNTHETIC_ACCOUNTS,
  SYNTHETIC_TRANSACTIONS,
} from '../data/syntheticDataset';
import { CaseHeader } from './CaseHeader';

interface TransactionGraphViewProps {
  activeCase: CybercrimeComplaint;
  accounts?: SyntheticAccount[];
  transactions?: SyntheticTransaction[];
  onNavigate?: (viewId: any) => void;
}

interface GraphNode {
  id: string;
  label: string;
  name: string;
  type: AccountNodeType;
  x: number;
  y: number;
  account: SyntheticAccount;
  hop: number;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  amount: number;
  channel: string;
  hopIndex: number;
  timeLabel: string;
  timestamp: string;
  isSuspicious: boolean;
}

export const TransactionGraphView: React.FC<TransactionGraphViewProps> = ({
  activeCase,
  accounts = SYNTHETIC_ACCOUNTS,
  transactions = SYNTHETIC_TRANSACTIONS,
  onNavigate,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string>('ACC-MULE-C-42');
  const [highlightSuspiciousPath, setHighlightSuspiciousPath] = useState(true);

  // Build nodes & edges for the active case
  const { nodes, edges } = useMemo(() => {
    const safeAccounts = accounts || SYNTHETIC_ACCOUNTS;
    const safeTransactions = transactions || SYNTHETIC_TRANSACTIONS;
    const is0042 = activeCase.id === 'TRI-2026-0042';

    const caseAccounts = is0042
      ? DEMO_CASE_ACCOUNTS
      : safeAccounts.filter(
          (a) =>
            activeCase.muleAccountIds?.includes(a.id) ||
            a.id === activeCase.destinationAccount ||
            a.nodeType === 'Victim'
        );

    const caseTxns = is0042
      ? DEMO_CASE_TRANSACTIONS
      : safeTransactions.filter(
          (t) =>
            activeCase.muleAccountIds?.includes(t.fromAccountId) ||
            activeCase.muleAccountIds?.includes(t.toAccountId)
        );

    // Exact horizontal progression coordinates in a 780-wide viewbox
    // Victim (65) -> Mule A (225) -> Mule B (385) -> Mule C (545) -> Predicted Cash-Out (705)
    const layoutPositions: Record<string, { x: number; y: number; hop: number; name: string }> = {
      'ACC-VICTIM-0042': { x: 65, y: 135, hop: 0, name: 'Victim (Complainant)' },
      'ACC-MULE-A-42': { x: 225, y: 135, hop: 1, name: 'Mule A (1st Hop)' },
      'ACC-MULE-B-42': { x: 385, y: 135, hop: 2, name: 'Mule B (2nd Hop)' },
      'ACC-MULE-C-42': { x: 545, y: 135, hop: 3, name: 'Mule C (Terminal Mule)' },
      'ACC-CASHOUT-PRED-42': { x: 705, y: 135, hop: 4, name: 'Probable Cash-Out' },
    };

    const builtNodes: GraphNode[] = caseAccounts.map((acc, index) => {
      const predefined = layoutPositions[acc.id];
      const posX = predefined ? predefined.x : 65 + (index * 155);
      const posY = predefined ? predefined.y : 135 + ((index % 2 === 0 ? -1 : 1) * 20);
      const hop = predefined ? predefined.hop : index;

      return {
        id: acc.id,
        label: acc.nodeType === 'Victim' ? 'Victim' : acc.nodeType === 'Cash-Out Endpoint' ? 'Cash-Out' : acc.accountHolderMasked,
        name: predefined ? predefined.name : acc.accountHolderMasked,
        type: acc.nodeType,
        x: posX,
        y: posY,
        account: acc,
        hop,
      };
    });

    const builtEdges: GraphEdge[] = caseTxns.map((txn) => {
      const mins = txn.minutesFromOrigin;
      const timeLabel = mins === 0 ? 'T+0' : `+${mins}m`;
      return {
        id: txn.id,
        source: txn.fromAccountId,
        target: txn.toAccountId,
        amount: txn.amount,
        channel: txn.channel,
        hopIndex: txn.hopIndex,
        timeLabel,
        timestamp: txn.timestamp,
        isSuspicious: true,
      };
    });

    return { nodes: builtNodes, edges: builtEdges };
  }, [activeCase, accounts, transactions]);

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || nodes[nodes.length - 2] || nodes[0];
  }, [nodes, selectedNodeId]);

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(1.6, z + 0.15));
  const handleZoomOut = () => setZoom((z) => Math.max(0.7, z - 0.15));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Drag pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };
  const handleMouseUp = () => setIsDragging(false);

  // Styling helpers
  const getNodeVisuals = (type: AccountNodeType) => {
    switch (type) {
      case 'Victim':
        return { bg: '#EAF4FB', border: '#1769AA', text: '#0D4778', fill: '#1769AA' };
      case 'Cash-Out Endpoint':
        return { bg: '#FFF3E8', border: '#F58220', text: '#D97706', fill: '#F58220' };
      default:
        return { bg: '#FEE2E2', border: '#DC2626', text: '#991B1B', fill: '#DC2626' };
    }
  };

  // Mule C Specific Contribution Data (User Requirement 12)
  const isMuleC = selectedNode?.id === 'ACC-MULE-C-42' || selectedNode?.account.riskScore >= 80;
  const muleRiskScore = isMuleC ? 87 : selectedNode?.account.riskScore || 50;

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto">
      {/* Persistent Case Header */}
      <CaseHeader
        activeCase={activeCase}
        onNavigate={onNavigate || (() => {})}
        currentView="transaction-network"
      />

      {/* Main Content Layout: Graph (8 cols) + Side Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left: Transaction Flow Canvas */}
        <div className="lg:col-span-8 bg-white border border-[#DCE4EA] rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col">
          {/* Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#DCE4EA] mb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <GitFork className="w-4 h-4 text-[#1769AA]" />
                <h2 className="text-xs font-bold text-[#0D4778] uppercase tracking-wider">
                  MONEY FLOW — MULTI-HOP TRAIL
                </h2>
              </div>
              <p className="text-[11px] text-[#5F6B76]">
                Chronological fund forwarding trail leading to terminal cash-out mule.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setHighlightSuspiciousPath(!highlightSuspiciousPath)}
                className={`px-2.5 py-1 rounded text-xs font-semibold border flex items-center gap-1.5 cursor-pointer transition-colors ${
                  highlightSuspiciousPath
                    ? 'bg-[#EAF4FB] text-[#0D4778] border-[#1769AA]/40'
                    : 'bg-[#F7F9FB] text-[#5F6B76] border-[#DCE4EA]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#1769AA]" />
                <span>HIGHLIGHT SUSPICIOUS PATH</span>
              </button>

              <div className="flex items-center border border-[#DCE4EA] rounded bg-[#F7F9FB]">
                <button
                  onClick={handleZoomIn}
                  className="p-1 hover:bg-[#DCE4EA] text-[#5F6B76] cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-1 hover:bg-[#DCE4EA] text-[#5F6B76] cursor-pointer border-l border-[#DCE4EA]"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-1 hover:bg-[#DCE4EA] text-[#5F6B76] cursor-pointer border-l border-[#DCE4EA]"
                  title="Reset View"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* SVG Canvas (Responsive viewBox) */}
          <div
            className="w-full h-72 sm:h-80 bg-[#F7F9FB] border border-[#DCE4EA] rounded-lg relative overflow-hidden select-none cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 780 270"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <marker
                  id="arrow-suspicious"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#DC2626" />
                </marker>
                <marker
                  id="arrow-prediction"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#F58220" />
                </marker>
              </defs>

              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                {/* 1. Edges / Connectors */}
                {edges.map((edge) => {
                  const sNode = nodes.find((n) => n.id === edge.source);
                  const tNode = nodes.find((n) => n.id === edge.target);
                  if (!sNode || !tNode) return null;

                  const isPredictionEdge = edge.target === 'ACC-CASHOUT-PRED-42';
                  const strokeColor = isPredictionEdge ? '#F58220' : '#DC2626';
                  const markerId = isPredictionEdge ? 'url(#arrow-prediction)' : 'url(#arrow-suspicious)';

                  const midX = (sNode.x + tNode.x) / 2;
                  const midY = (sNode.y + tNode.y) / 2;

                  return (
                    <g key={edge.id} className="transition-all duration-300">
                      <line
                        x1={sNode.x}
                        y1={sNode.y}
                        x2={tNode.x}
                        y2={tNode.y}
                        stroke={strokeColor}
                        strokeWidth={highlightSuspiciousPath ? 3 : 2}
                        strokeDasharray={isPredictionEdge ? '5 3' : undefined}
                        markerEnd={markerId}
                        opacity={0.85}
                      />

                      {/* Transaction Amount Badge in Midpoint */}
                      <g transform={`translate(${midX}, ${midY - 14})`}>
                        <rect
                          x="-38"
                          y="-10"
                          width="76"
                          height="20"
                          rx="4"
                          fill="#FFFFFF"
                          stroke={strokeColor}
                          strokeWidth="1.2"
                          className="shadow-2xs"
                        />
                        <text
                          x="0"
                          y="3.5"
                          textAnchor="middle"
                          fontSize="8.5"
                          fontWeight="bold"
                          fontFamily="monospace"
                          fill="#172B3A"
                        >
                          ₹{edge.amount.toLocaleString('en-IN')}
                        </text>
                      </g>

                      {/* Time Delta & Channel Badge Below Line */}
                      <g transform={`translate(${midX}, ${midY + 14})`}>
                        <text
                          x="0"
                          y="2"
                          textAnchor="middle"
                          fontSize="7.5"
                          fontWeight="600"
                          fill="#5F6B76"
                        >
                          {edge.channel} • {edge.timeLabel}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* 2. Nodes */}
                {nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const vis = getNodeVisuals(node.type);

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onClick={() => setSelectedNodeId(node.id)}
                      className="cursor-pointer group"
                    >
                      {/* Selection Aura */}
                      {isSelected && (
                        <circle
                          r="28"
                          fill="none"
                          stroke="#1769AA"
                          strokeWidth="2.5"
                          strokeDasharray="4 3"
                          className="animate-spin-slow"
                        />
                      )}

                      {/* Base Node Circle */}
                      <circle
                        r="22"
                        fill={vis.bg}
                        stroke={isSelected ? '#0D4778' : vis.border}
                        strokeWidth={isSelected ? 3 : 2}
                        className="transition-all duration-200 group-hover:scale-105 shadow-xs"
                      />

                      {/* Icon inside Node */}
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="monospace"
                        fill={vis.text}
                      >
                        {node.type === 'Victim'
                          ? 'VIC'
                          : node.type === 'Cash-Out Endpoint'
                          ? 'ATM'
                          : `M${node.hop}`}
                      </text>

                      {/* Node Label Above */}
                      <g transform="translate(0, -30)">
                        <rect
                          x="-45"
                          y="-9"
                          width="90"
                          height="16"
                          rx="3"
                          fill="#FFFFFF"
                          stroke="#DCE4EA"
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="2.5"
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="bold"
                          fill="#172B3A"
                        >
                          {node.name.length > 15 ? node.name.slice(0, 14) + '…' : node.name}
                        </text>
                      </g>

                      {/* Hop & Risk Pill Below */}
                      <g transform="translate(0, 32)">
                        <rect
                          x="-35"
                          y="-8"
                          width="70"
                          height="15"
                          rx="7.5"
                          fill={vis.bg}
                          stroke={vis.border}
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="2.5"
                          textAnchor="middle"
                          fontSize="7.5"
                          fontWeight="bold"
                          fill={vis.text}
                        >
                          {node.type === 'Victim'
                            ? 'SOURCE'
                            : node.type === 'Cash-Out Endpoint'
                            ? 'ENDPOINT'
                            : `Risk ${node.account.riskScore}`}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Bottom Trail Sequence Summary */}
          <div className="mt-3 p-2 rounded-lg bg-[#F7F9FB] border border-[#DCE4EA] flex flex-wrap items-center justify-between gap-2 text-xs text-[#5F6B76]">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="font-bold text-[#0D4778]">Flow:</span>
              <span>Victim</span>
              <span>→</span>
              <span className="text-rose-700 font-bold">Mule A (₹1,70,000)</span>
              <span>→</span>
              <span className="text-rose-700 font-bold">Mule B (₹1,52,000)</span>
              <span>→</span>
              <span className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                Mule C (Terminal Mule)
              </span>
              <span>→</span>
              <span className="text-[#F58220] font-bold">Probable Cash-Out</span>
            </div>
            <span className="text-[11px] text-[#1769AA] font-semibold">
              Select any node to inspect telemetry
            </span>
          </div>
        </div>

        {/* Right: Merged Mule Intelligence Side Panel (User Requirement 12) */}
        <div className="lg:col-span-4 bg-white border border-[#DCE4EA] rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            {/* Header: Mule C Identity & Score */}
            <div className="pb-2.5 border-b border-[#DCE4EA]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6B76]">
                  {selectedNode?.type === 'Victim' ? 'COMPLAINANT' : 'MULE INTELLIGENCE'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 uppercase">
                  {selectedNode?.account.riskLevel || 'CRITICAL'}
                </span>
              </div>
              <h3 className="font-bold text-base text-[#0D4778] flex items-center justify-between">
                <span>{selectedNode?.name || 'MULE C'}</span>
                <span className="font-mono text-xs text-[#5F6B76]">{selectedNode?.id}</span>
              </h3>
            </div>

            {/* Prominent Risk Score (87 / 100) */}
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
                  MULE RISK SCORE
                </span>
                <div className="text-2xl font-bold font-mono text-rose-700">
                  {muleRiskScore} <span className="text-sm font-normal text-[#5F6B76]">/ 100</span>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded bg-rose-700 text-white font-bold text-xs uppercase tracking-wider">
                  CRITICAL
                </span>
                <div className="text-[10px] text-rose-800 mt-1 font-semibold">
                  Layer 3 Terminal Mule
                </div>
              </div>
            </div>

            {/* WHY FLAGGED? Section */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#0D4778] uppercase tracking-wider block">
                WHY FLAGGED?
              </span>
              <ul className="text-xs text-[#172B3A] space-y-1 bg-[#F7F9FB] p-2.5 rounded-lg border border-[#DCE4EA]">
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span><strong>Rapid fund forwarding:</strong> 92% of inward funds transferred in &lt;14 mins.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span><strong>High transaction velocity:</strong> 7 inward bursts within 35 minutes.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span><strong>Multiple suspicious connections:</strong> Connected to known mule syndicate.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span><strong>Historical mule-pattern similarity:</strong> 91% match with Cluster #08.</span>
                </li>
              </ul>
            </div>

            {/* Small Feature-Contribution Graph (User Requirement 12) */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-[#5F6B76] uppercase tracking-wider block">
                FEATURE CONTRIBUTION (SHAP RISK IMPACT)
              </span>
              <div className="space-y-1.5 bg-[#F7F9FB] p-2.5 rounded-lg border border-[#DCE4EA] text-[11px]">
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-[#172B3A] font-medium">Rapid fund forwarding</span>
                    <span className="font-mono font-bold text-[#0D4778]">34%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#DCE4EA] rounded-full overflow-hidden">
                    <div className="h-full bg-rose-600 rounded-full" style={{ width: '34%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-[#172B3A] font-medium">Transaction velocity</span>
                    <span className="font-mono font-bold text-[#0D4778]">28%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#DCE4EA] rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-[#172B3A] font-medium">Suspicious graph degree</span>
                    <span className="font-mono font-bold text-[#0D4778]">22%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#DCE4EA] rounded-full overflow-hidden">
                    <div className="h-full bg-[#F58220] rounded-full" style={{ width: '22%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-[#172B3A] font-medium">Historical syndicate prior</span>
                    <span className="font-mono font-bold text-[#0D4778]">16%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#DCE4EA] rounded-full overflow-hidden">
                    <div className="h-full bg-[#1769AA] rounded-full" style={{ width: '16%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* At Bottom: Next: Prediction */}
          <div className="pt-3 mt-3 border-t border-[#DCE4EA]">
            <button
              onClick={() => onNavigate?.('prediction')}
              className="w-full py-2.5 bg-[#1769AA] hover:bg-[#0D4778] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <span>Next: Prediction</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
