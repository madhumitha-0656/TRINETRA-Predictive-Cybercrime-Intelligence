import React, { useState, useMemo, useEffect } from 'react';
import {
  CybercrimeComplaint,
  NavigationTab,
  PredictedZone,
  SyntheticAccount,
  SyntheticTransaction,
  PrototypeUser,
} from './types';
import {
  DEMO_PRIMARY_CASE,
  SYNTHETIC_ACCOUNTS,
  SYNTHETIC_TRANSACTIONS,
} from './data/syntheticDataset';
import { dataRepository } from './services/dataRepository';
import { authService } from './services/authService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CommandCenterView } from './components/CommandCenterView';
import { CasesListView } from './components/CasesListView';
import { CaseOverviewView } from './components/CaseOverviewView';
import { AnalysisProcessingView } from './components/AnalysisProcessingView';
import { TransactionGraphView } from './components/TransactionGraphView';
import { PredictiveEngineView } from './components/PredictiveEngineView';
import { DigitalNakabandiView } from './components/DigitalNakabandiView';
import { CaseIntelligenceView } from './components/CaseIntelligenceView';
import { LoginScreen } from './components/LoginScreen';
import { TechnicalArchitectureModal } from './components/TechnicalArchitectureModal';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<PrototypeUser | null>(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => authService.isAuthenticated());

  // Technical Architecture Modal State
  const [isTechInfoOpen, setIsTechInfoOpen] = useState<boolean>(false);

  // Navigation State (Default to 'dashboard', the 1st of the 6 main tabs)
  const [currentView, setCurrentView] = useState<NavigationTab>('dashboard');

  // Core Data State from DAO Repository
  const [complaints, setComplaints] = useState<CybercrimeComplaint[]>(() => dataRepository.getAllComplaints());
  const [accounts, setAccounts] = useState<SyntheticAccount[]>(SYNTHETIC_ACCOUNTS);
  const [transactions, setTransactions] = useState<SyntheticTransaction[]>(SYNTHETIC_TRANSACTIONS);

  // Active Selected Case (Default to DEMO_PRIMARY_CASE TRI-2026-0042)
  const [activeCaseId, setActiveCaseId] = useState<string>(DEMO_PRIMARY_CASE.id);
  const [selectedZone, setSelectedZone] = useState<PredictedZone | null>(
    DEMO_PRIMARY_CASE.prediction?.whereZones?.[0] || null
  );

  const activeCase = useMemo(() => {
    return complaints.find((c) => c.id === activeCaseId) || complaints[0] || DEMO_PRIMARY_CASE;
  }, [complaints, activeCaseId]);

  // Sync accounts and transactions when active case changes
  useEffect(() => {
    if (activeCase?.id) {
      const caseAccounts = dataRepository.getAccountsForCase(activeCase.id);
      const caseTransactions = dataRepository.getTransactionsForCase(activeCase.id);
      setAccounts(caseAccounts);
      setTransactions(caseTransactions);
    }
  }, [activeCase?.id]);

  // Case Selection Handler
  const handleSelectCase = (caseItem: CybercrimeComplaint) => {
    if (!caseItem) return;
    setActiveCaseId(caseItem.id);
    if (caseItem.prediction?.whereZones?.[0]) {
      setSelectedZone(caseItem.prediction.whereZones[0]);
    }
  };

  // Create Case Handler
  const handleCreateComplaint = (newComplaint: CybercrimeComplaint) => {
    if (!newComplaint) return;
    dataRepository.saveOrUpdateComplaint(newComplaint);
    setComplaints(dataRepository.getAllComplaints());
    setActiveCaseId(newComplaint.id);
    if (newComplaint.prediction?.whereZones?.[0]) {
      setSelectedZone(newComplaint.prediction.whereZones[0]);
    }
  };

  // Trigger analysis for a case
  const handleStartInvestigation = (caseItem: CybercrimeComplaint) => {
    if (!caseItem) return;
    handleSelectCase(caseItem);
    setCurrentView('analysis-processing');
  };

  // Handle completed analysis from AnalysisProcessingView
  const handleAnalysisComplete = (updatedCase: CybercrimeComplaint) => {
    if (!updatedCase) return;
    setComplaints(dataRepository.getAllComplaints());
    setActiveCaseId(updatedCase.id);
    const caseAccounts = dataRepository.getAccountsForCase(updatedCase.id);
    const caseTransactions = dataRepository.getTransactionsForCase(updatedCase.id);
    setAccounts(caseAccounts);
    setTransactions(caseTransactions);
    if (updatedCase.prediction?.whereZones?.[0]) {
      setSelectedZone(updatedCase.prediction.whereZones[0]);
    }
  };

  // Update Case Status Handler
  const handleUpdateCaseStatus = (status: CybercrimeComplaint['status']) => {
    dataRepository.updateCaseStatus(activeCaseId, status);
    setComplaints(dataRepository.getAllComplaints());
  };

  // Login / Logout Handlers
  const handleLoginSuccess = (user: PrototypeUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Backward compatible navigation mapper to ensure all internal clicks map cleanly
  const handleNavigate = (targetView: any) => {
    if (targetView === 'command-center') {
      setCurrentView('dashboard');
    } else if (targetView === 'new-complaint') {
      setCurrentView('cases');
    } else if (targetView === 'transaction-graph' || targetView === 'mule-intelligence') {
      setCurrentView('transaction-network');
    } else if (
      targetView === 'predictive-engine' ||
      targetView === 'historical-patterns' ||
      targetView === 'model-insights'
    ) {
      setCurrentView('prediction');
    } else if (targetView === 'case-intelligence') {
      setCurrentView('reports');
    } else if (targetView === 'system-about') {
      setIsTechInfoOpen(true);
    } else {
      setCurrentView(targetView);
    }
  };

  // If user is not authenticated, render Login Screen
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col font-sans text-[#172B3A] antialiased selection:bg-[#1769AA] selection:text-white p-2 sm:p-3 gap-2.5">
      {/* Universal Top Header */}
      <Header
        activeCase={activeCase}
        complaints={complaints}
        allComplaints={complaints}
        onSelectCase={handleSelectCase}
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        onOpenTechInfo={() => setIsTechInfoOpen(true)}
      />

      {/* Main Two-Column Layout (Sidebar + View Canvas) */}
      <div className="flex-1 flex overflow-hidden rounded-xl border border-[#DCE4EA] bg-white shadow-xs">
        {/* Fixed Collapsible Sidebar (6 navigation items only) */}
        <Sidebar
          currentTab={currentView}
          onSelectTab={handleNavigate}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenTechInfo={() => setIsTechInfoOpen(true)}
        />

        {/* Scrollable View Area (Repeated process strip removed as requested) */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 bg-[#F7F9FB]">
          {/* 1. DASHBOARD / COMMAND CENTER */}
          {currentView === 'dashboard' && (
            <CommandCenterView
              complaints={complaints}
              activeCase={activeCase}
              onSelectCase={handleSelectCase}
              onNavigate={handleNavigate}
            />
          )}

          {/* 2. CASES (Case Explorer & Intake) */}
          {currentView === 'cases' && (
            <CasesListView
              complaints={complaints}
              activeCase={activeCase}
              onSelectCase={handleSelectCase}
              onNavigate={handleNavigate}
              onComplaintCreated={handleCreateComplaint}
              onStartInvestigation={handleStartInvestigation}
            />
          )}

          {/* 2b. CASE OVERVIEW (Concise First Stop when Opening a Case) */}
          {currentView === 'case-overview' && (
            <CaseOverviewView
              activeCase={activeCase}
              caseItem={activeCase}
              onNavigate={handleNavigate}
              onStartInvestigation={() => handleStartInvestigation(activeCase)}
              onReRunAnalysis={() => handleStartInvestigation(activeCase)}
            />
          )}

          {/* 2c. ANALYSIS PROCESSING (6-Stage Simulation when Analysing/Re-running) */}
          {currentView === 'analysis-processing' && (
            <AnalysisProcessingView
              activeCase={activeCase}
              onComplete={handleAnalysisComplete}
              onAnalysisComplete={handleAnalysisComplete}
              onNavigateToOverview={() => setCurrentView('case-overview')}
              onCancel={() => setCurrentView('case-overview')}
            />
          )}

          {/* 3. TRANSACTION NETWORK (Merged Flow Graph + Mule Intelligence Inspector) */}
          {currentView === 'transaction-network' && (
            <TransactionGraphView
              activeCase={activeCase}
              accounts={accounts}
              transactions={transactions}
              onNavigate={handleNavigate}
            />
          )}

          {/* 4. PREDICTION (Merged 4-Cards, Feature Contribution SHAP & Historical Support) */}
          {currentView === 'prediction' && (
            <PredictiveEngineView
              activeCase={activeCase}
              onNavigate={handleNavigate}
              onSelectZone={(zone) => {
                setSelectedZone(zone);
                handleNavigate('digital-nakabandi');
              }}
            />
          )}

          {/* 5. DIGITAL NAKABANDI (Primary Map Canvas + Zone Intelligence Panel) */}
          {currentView === 'digital-nakabandi' && (
            <DigitalNakabandiView
              activeCase={activeCase}
              onNavigate={handleNavigate}
              selectedZone={selectedZone}
              onSelectZone={setSelectedZone}
            />
          )}

          {/* 6. REPORTS (Decision Support Dossier + Protocol Lifecycle + Print/Export) */}
          {currentView === 'reports' && (
            <CaseIntelligenceView
              activeCase={activeCase}
              onNavigate={handleNavigate}
              onUpdateCaseStatus={handleUpdateCaseStatus}
            />
          )}
        </main>
      </div>

      {/* Technical Architecture & Prototype Info Modal */}
      <TechnicalArchitectureModal
        isOpen={isTechInfoOpen}
        onClose={() => setIsTechInfoOpen(false)}
      />

      {/* Persistent Bottom High Density Status & Disclaimer Ribbon */}
      <footer className="flex flex-col sm:flex-row justify-between items-center px-4 py-2 bg-white border border-[#DCE4EA] rounded-xl text-xs text-[#5F6B76] gap-2 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#0D4778] font-bold">TRINETRA</span>
          <span className="text-[#DCE4EA]">|</span>
          <span>Predictive Cybercrime Cash-Out Intelligence Platform</span>
          <span className="text-[#DCE4EA]">|</span>
          <span className="text-[#F58220] font-semibold">Smart India Hackathon 2026 • Team Furious Rookie</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-[#138A44] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#138A44]"></span>
            System Online
          </span>
        </div>
      </footer>
    </div>
  );
}
