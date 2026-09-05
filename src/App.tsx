import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import type { ViewTab, Transaction } from './types/finance';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { MetricCards } from './components/dashboard/MetricCards';
import { QuickAddPresets } from './components/dashboard/QuickAddPresets';
import { BudgetProgress } from './components/dashboard/BudgetProgress';
import { CategoryBreakdown } from './components/dashboard/CategoryBreakdown';
import { MonthlyComparison } from './components/dashboard/MonthlyComparison';
import { RecentActivity } from './components/dashboard/RecentActivity';
import { TransactionList } from './components/transactions/TransactionList';
import { TransactionModal } from './components/transactions/TransactionModal';
import { SubscriptionList } from './components/subscriptions/SubscriptionList';
import { BudgetModal } from './components/budget/BudgetModal';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsModal } from './components/settings/SettingsModal';
import { AuthModal } from './components/auth/AuthModal';
import { InstallPwaModal } from './components/common/InstallPwaModal';
import { ConfirmModal } from './components/common/ConfirmModal';

const MainContent: React.FC = () => {
  const { addTransaction, updateTransaction, deleteTransaction, activeMonth } = useFinance();

  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsAddModalOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsAddModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingTransaction) {
      deleteTransaction(deletingTransaction.id);
      setDeletingTransaction(null);
    }
  };

  const handleFormSubmit = (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
    } else {
      addTransaction(data);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-700 dark:selection:text-emerald-300">
      {/* Sidebar for Desktop & Drawer for Mobile */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        isOpenMobile={isSidebarOpenMobile}
        onCloseMobile={() => setIsSidebarOpenMobile(false)}
      />

      {/* Main Layout Area */}
      <div className="lg:pl-64 flex-1 flex flex-col pb-20 lg:pb-12">
        {/* Top Sticky Header */}
        <Navbar
          onOpenAddModal={handleOpenAdd}
          onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenPwaModal={() => setIsPwaModalOpen(true)}
          onToggleSidebar={() => setIsSidebarOpenMobile(true)}
        />

        {/* Dynamic Page Content */}
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex-1">
          {/* Dashboard Tab */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6 sm:space-y-8">
              {/* Primary 4 Metric Cards & Daily Safe Spend */}
              <MetricCards />

              {/* 1-Tap Quick Logging Presets */}
              <QuickAddPresets />

              {/* Middle Section: Budget Meter + Spending Donut Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BudgetProgress onOpenBudgetModal={() => setIsBudgetModalOpen(true)} />
                <CategoryBreakdown onViewAll={() => setCurrentTab('analytics')} />
              </div>

              {/* Monthly MoM Comparison Section */}
              <MonthlyComparison />

              {/* Recent Transactions Feed */}
              <RecentActivity
                onOpenAddModal={handleOpenAdd}
                onEditTransaction={handleEditTransaction}
                onDeleteTransaction={setDeletingTransaction}
                onViewAll={() => setCurrentTab('transactions')}
              />
            </div>
          )}

          {/* Transactions Tab */}
          {currentTab === 'transactions' && (
            <TransactionList
              onOpenAddModal={handleOpenAdd}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={setDeletingTransaction}
            />
          )}

          {/* Subscriptions & Recurring Bills Tab */}
          {currentTab === 'subscriptions' && <SubscriptionList />}

          {/* Analytics & 6-Month Trends Tab */}
          {currentTab === 'analytics' && <AnalyticsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAddModal={handleOpenAdd}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Modals & Dialogs */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleFormSubmit}
        editingTransaction={editingTransaction}
        defaultMonth={activeMonth}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <InstallPwaModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
      />

      <ConfirmModal
        isOpen={Boolean(deletingTransaction)}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction?"
        message={`Are you sure you want to remove "${deletingTransaction?.description}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isDestructive={true}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <MainContent />
      </FinanceProvider>
    </ThemeProvider>
  );
}

export default App;
