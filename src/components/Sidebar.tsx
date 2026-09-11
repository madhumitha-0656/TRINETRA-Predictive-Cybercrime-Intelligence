import React from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  GitFork,
  Compass,
  FileText,
  Cpu,
  LogOut,
  ShieldCheck,
  Server,
} from 'lucide-react';
import { NavigationTab, PrototypeUser } from '../types';

interface SidebarProps {
  currentTab?: NavigationTab;
  currentView?: NavigationTab;
  onSelectTab?: (view: NavigationTab) => void;
  onNavigate?: (view: NavigationTab) => void;
  currentUser?: PrototypeUser | null;
  onLogout?: () => void;
  onOpenTechInfo?: () => void;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  currentView,
  onSelectTab,
  onNavigate,
  currentUser,
  onLogout,
  onOpenTechInfo,
}) => {
  const activeView = currentTab || currentView || 'dashboard';

  const handleNav = (tab: NavigationTab) => {
    onSelectTab?.(tab);
    onNavigate?.(tab);
  };

  // Exactly 6 main navigation pages requested by User Requirement 1
  const navItems: NavItem[] = [
    { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
    { id: 'cases', label: '2. Cases', icon: FolderOpen },
    { id: 'transaction-network', label: '3. Transaction Network', icon: GitFork, badge: 'Flow' },
    { id: 'prediction', label: '4. Prediction', icon: Cpu, badge: 'Core' },
    { id: 'digital-nakabandi', label: '5. Digital Nakabandi', icon: Compass, badge: 'GIS' },
    { id: 'reports', label: '6. Reports', icon: FileText },
  ];

  return (
    <aside className="w-56 lg:w-60 bg-white border-r border-[#DCE4EA] flex flex-col justify-between shrink-0 select-none shadow-xs">
      {/* Top Navigation List */}
      <div className="py-3 px-2 flex-1 overflow-y-auto">
        <div className="px-2.5 py-1 mb-1.5 text-[11px] font-bold tracking-wider text-[#5F6B76] uppercase">
          Investigation Modules
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeView === item.id ||
              ((activeView === 'case-overview' || activeView === 'analysis-processing') &&
                item.id === 'cases');

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#1769AA] text-white shadow-xs font-semibold'
                    : 'text-[#172B3A] hover:bg-[#EAF4FB] hover:text-[#0D4778]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-[#1769AA]'
                    }`}
                  />
                  <span className="truncate text-xs">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold tracking-wide ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badge === 'GIS'
                        ? 'bg-[#EAF7EF] text-[#138A44] border border-[#138A44]/30'
                        : 'bg-[#FFF3E8] text-[#F58220] border border-[#F58220]/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Technical Architecture & Audit Quick Link (User Requirement 17) */}
        <div className="mt-5 px-1">
          <button
            onClick={onOpenTechInfo}
            className="w-full p-2.5 rounded-lg bg-[#F7F9FB] hover:bg-[#EAF4FB] border border-[#DCE4EA] hover:border-[#1769AA]/40 text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-[#0D4778] font-bold text-xs">
              <Server className="w-3.5 h-3.5 text-[#1769AA]" />
              <span>Technical Architecture</span>
            </div>
            <p className="text-[10px] text-[#5F6B76] mt-0.5 group-hover:text-[#172B3A]">
              PostgreSQL • PostGIS • Graph • Audit Log
            </p>
          </button>
        </div>
      </div>

      {/* Bottom of Sidebar: Logged-in User, Role, Logout (User Requirement 1) */}
      <div className="p-3 border-t border-[#DCE4EA] bg-[#F7F9FB] space-y-2">
        <div className="space-y-0.5">
          <div className="text-[10px] font-bold text-[#5F6B76] uppercase tracking-wider">
            LOGGED-IN USER
          </div>
          <div className="font-bold text-xs text-[#0D4778] truncate">
            {currentUser?.name || 'Rehan'}
          </div>
          <div className="text-[11px] text-[#1769AA] font-semibold truncate">
            {currentUser?.role || 'Team Lead / Supervising Analyst'}
          </div>
          <div className="text-[9px] text-[#5F6B76] font-mono">
            {currentUser?.user_id || 'FR-001'}
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full py-1.5 px-2 bg-white hover:bg-rose-50 hover:text-rose-700 border border-[#DCE4EA] hover:border-rose-200 text-[#5F6B76] rounded-md font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>LOGOUT</span>
        </button>

        <div className="text-[10px] text-center text-[#5F6B76] pt-1">
          SIH 2026 • Team Furious Rookie
        </div>
      </div>
    </aside>
  );
};
