import React, { useState } from 'react';
import {
  CalendarClock,
  Plus,
  Edit3,
  Trash2,
  Check,
  Calendar,
  AlertCircle,
  Repeat,
  Sparkles,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import type { Subscription } from '../../types/finance';
import { formatCurrency, getTodayDate, getCurrentMonth } from '../../utils/formatters';
import { CATEGORY_CONFIGS } from '../../constants/categories';
import { CategoryIcon } from '../common/CategoryIcon';
import { SubscriptionModal } from './SubscriptionModal';

export const SubscriptionList: React.FC = () => {
  const {
    subscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    addTransaction,
    activeMonth,
  } = useFinance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [loggedNotification, setLoggedNotification] = useState<string | null>(null);

  // Total monthly burn rate
  const totalMonthlyBurn = subscriptions.reduce((sum, sub) => {
    if (sub.billingCycle === 'yearly') {
      return sum + sub.amount / 12;
    }
    return sum + sub.amount;
  }, 0);

  const totalYearlyBurn = totalMonthlyBurn * 12;

  // Calculate days until next renewal
  const getDaysUntilRenewal = (billingDay: number) => {
    const today = new Date();
    const currentDay = today.getDate();
    let daysLeft = billingDay - currentDay;

    if (daysLeft < 0) {
      const daysInCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      daysLeft = daysInCurrentMonth - currentDay + billingDay;
    }
    return daysLeft;
  };

  const handleSave = (subData: Omit<Subscription, 'id'>, id?: string) => {
    if (id) {
      updateSubscription(id, subData);
    } else {
      addSubscription(subData);
    }
    setIsModalOpen(false);
    setEditingSub(null);
  };

  const handleLogAsExpense = (sub: Subscription) => {
    const today = getTodayDate();
    // Default to active month with today's day or day 1 if looking at another month
    const currentMonth = getCurrentMonth();
    const targetDate =
      activeMonth === currentMonth
        ? today
        : `${activeMonth}-${String(sub.billingDay).padStart(2, '0')}`;

    addTransaction({
      amount: sub.amount,
      category: sub.category,
      type: 'expense',
      description: `${sub.name} (Recurring)`,
      date: targetDate,
    });

    setLoggedNotification(`Logged ${sub.name} as expense for ${activeMonth}!`);
    setTimeout(() => {
      setLoggedNotification(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Burn Rate Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Monthly Burn Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Monthly Commitments
            </span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(totalMonthlyBurn)}
            </div>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Fixed burn rate across {subscriptions.length} services
            </p>
          </div>
        </div>

        {/* Yearly Projection */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Annual Projection
            </span>
            <div className="w-9 h-9 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(totalYearlyBurn)}
            </div>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Projected yearly commitment
            </p>
          </div>
        </div>

        {/* Quick Action Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Add New
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => {
                setEditingSub(null);
                setIsModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subscription</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {loggedNotification && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">{loggedNotification}</span>
        </div>
      )}

      {/* Subscriptions Ledger List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/70 dark:border-slate-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Active Subscriptions</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Manage automatic recurring memberships and utilities
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {subscriptions.length} active
          </span>
        </div>

        {subscriptions.length === 0 ? (
          <div className="py-16 text-center text-slate-400 dark:text-slate-500">
            <CalendarClock className="w-10 h-10 mx-auto stroke-1 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-xs font-semibold">No recurring subscriptions yet.</p>
            <button
              onClick={() => {
                setEditingSub(null);
                setIsModalOpen(true);
              }}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-500/10 dark:text-emerald-300 hover:bg-emerald-500/20 rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add your first subscription</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {subscriptions.map((sub) => {
              const config = CATEGORY_CONFIGS[sub.category] || CATEGORY_CONFIGS.Other;
              const daysUntil = getDaysUntilRenewal(sub.billingDay);
              const isToday = daysUntil === 0;
              const isSoon = daysUntil > 0 && daysUntil <= 3;

              return (
                <div
                  key={sub.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${config.color}15`,
                        color: config.color,
                      }}
                    >
                      <CategoryIcon category={sub.category} className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {sub.name}
                        </span>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${config.color}15`,
                            color: config.color,
                          }}
                        >
                          {sub.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Renews every month on the {sub.billingDay}th</span>
                        </span>
                        {sub.notes && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[180px]">{sub.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 flex-shrink-0">
                    {/* Renewal Status Badge */}
                    <div>
                      {isToday ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-700 dark:text-rose-300">
                          <AlertCircle className="w-3 h-3" />
                          <span>Renews Today!</span>
                        </span>
                      ) : isSoon ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300">
                          <span>In {daysUntil} days</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          <span>In {daysUntil} days</span>
                        </span>
                      )}
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatCurrency(sub.amount)}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium capitalize">
                        {sub.billingCycle}
                      </span>
                    </div>

                    {/* Log as expense button */}
                    <button
                      onClick={() => handleLogAsExpense(sub)}
                      title={`Record ${formatCurrency(sub.amount)} as transaction for ${activeMonth}`}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                    >
                      Log Expense
                    </button>

                    {/* Edit & Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingSub(sub);
                          setIsModalOpen(true);
                        }}
                        title="Edit subscription"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteSubscription(sub.id)}
                        title="Delete subscription"
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSub(null);
        }}
        onSave={handleSave}
        initialSubscription={editingSub}
      />
    </div>
  );
};
