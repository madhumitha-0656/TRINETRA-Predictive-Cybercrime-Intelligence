import React from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  GitFork,
  Cpu,
  Compass,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { NavigationTab } from '../types';

interface WorkflowPipelineProps {
  currentView?: NavigationTab | string;
  onSelectStep?: (view: any) => void;
}

export const WorkflowPipeline: React.FC<WorkflowPipelineProps> = ({
  currentView = 'dashboard',
  onSelectStep,
}) => {
  // The 6 unified pipeline stages matching the simplified navigation
  const steps = [
    { id: 'dashboard', name: 'Dashboard', short: 'Command Center', icon: LayoutDashboard },
    { id: 'cases', name: 'Cases', short: 'Intake & Records', icon: FolderOpen },
    { id: 'transaction-network', name: 'Transaction Network', short: 'Flow & Mules', icon: GitFork },
    { id: 'prediction', name: 'Prediction', short: 'Where/When/How', icon: Cpu },
    { id: 'digital-nakabandi', name: 'Digital Nakabandi', short: 'GIS Risk Zones', icon: Compass },
    { id: 'reports', name: 'Reports', short: 'Dossier & Review', icon: FileText },
  ];

  const getActiveIndex = () => {
    switch (currentView) {
      case 'dashboard':
      case 'command-center':
        return 0;
      case 'cases':
      case 'new-complaint':
        return 1;
      case 'transaction-network':
      case 'transaction-graph':
      case 'mule-intelligence':
        return 2;
      case 'prediction':
      case 'predictive-engine':
      case 'historical-patterns':
      case 'model-insights':
        return 3;
      case 'digital-nakabandi':
        return 4;
      case 'reports':
      case 'case-intelligence':
        return 5;
      default:
        return 0;
    }
  };

  const activeIdx = getActiveIndex();

  return (
    <div className="bg-white border border-[#DCE4EA] rounded-xl p-3 shadow-xs">
      {/* Top Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
        <div>
          <h3 className="text-xs font-bold text-[#0D4778] uppercase tracking-wider">
            TRINETRA INVESTIGATIVE WORKFLOW
          </h3>
          <p className="text-[11px] text-[#5F6B76]">
            From Reactive Tracing to Predictive Cash-Out Intervention
          </p>
        </div>
        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#EAF7EF] text-[#138A44] font-semibold border border-[#138A44]/30 w-fit">
          Human-in-the-Loop Decision Support
        </span>
      </div>

      {/* Horizontal Flow Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          const isActive = idx === activeIdx;
          const isDone = idx < activeIdx;

          return (
            <button
              key={st.id}
              onClick={() => onSelectStep?.(st.id)}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[58px] ${
                isActive
                  ? 'bg-[#1769AA] text-white border-[#0D4778] shadow-xs'
                  : isDone
                  ? 'bg-[#EAF4FB] text-[#0D4778] border-[#1769AA]/30 hover:bg-[#EAF4FB]/80'
                  : 'bg-[#F7F9FB] text-[#5F6B76] border-[#DCE4EA] hover:border-[#1769AA]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] font-bold font-mono px-1.5 py-0.2 rounded ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : isDone
                      ? 'bg-[#1769AA]/15 text-[#1769AA]'
                      : 'bg-[#DCE4EA] text-[#5F6B76]'
                  }`}
                >
                  0{idx + 1}
                </span>
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-white' : isDone ? 'text-[#1769AA]' : 'text-[#5F6B76]'
                  }`}
                />
              </div>

              <div>
                <div className="text-xs font-bold truncate leading-tight mt-1">{st.name}</div>
                <div
                  className={`text-[10px] truncate ${
                    isActive ? 'text-white/80' : 'text-[#5F6B76]'
                  }`}
                >
                  {st.short}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
