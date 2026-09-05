import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  PieChart,
  Sparkles,
  Award,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import {
  calculateTrends,
  calculateCategoryBreakdown,
} from '../../utils/calculations';
import {
  formatCurrency,
  formatPercentage,
  getLastNMonths,
  formatMonthYear,
} from '../../utils/formatters';
import { CATEGORY_CONFIGS } from '../../constants/categories';
import { CategoryIcon } from '../common/CategoryIcon';

export const AnalyticsView: React.FC = () => {
  const { transactions, activeMonth } = useFinance();
  const [activeChartTab, setActiveChartTab] = useState<'cashflow' | 'savings'>('cashflow');

  // Compute 6-month array
  const last6Months = useMemo(() => getLastNMonths(activeMonth, 6), [activeMonth]);

  // Compute trend data for these 6 months
  const trendData = useMemo(() => calculateTrends(transactions, last6Months), [
    transactions,
    last6Months,
  ]);

  // Spending by category for current active month
  const categoryBreakdown = useMemo(
    () => calculateCategoryBreakdown(transactions, activeMonth, 'expense'),
    [transactions, activeMonth]
  );

  // Overall averages for the 6 months
  const averages = useMemo(() => {
    const totalInc = trendData.reduce((acc, d) => acc + d.income, 0);
    const totalExp = trendData.reduce((acc, d) => acc + d.expenses, 0);
    const totalSav = trendData.reduce((acc, d) => acc + d.savings, 0);
    const count = trendData.length || 1;
    const avgInc = totalInc / count;
    const avgExp = totalExp / count;
    const avgSav = totalSav / count;
    const avgRate = avgInc > 0 ? (avgSav / avgInc) * 100 : 0;
    return { avgInc, avgExp, avgSav, avgRate };
  }, [trendData]);

  // Find max value for chart scaling
  const maxCashflow = useMemo(() => {
    let max = 1000;
    trendData.forEach((d) => {
      if (d.income > max) max = d.income;
      if (d.expenses > max) max = d.expenses;
    });
    return Math.ceil(max * 1.15);
  }, [trendData]);

  const maxSavings = useMemo(() => {
    let max = 500;
    trendData.forEach((d) => {
      const absVal = Math.abs(d.savings);
      if (absVal > max) max = absVal;
    });
    return Math.ceil(max * 1.2);
  }, [trendData]);

  return (
    <div className="space-y-6">
      {/* Analytics Overview & Averages Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-3 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>6-Month Financial Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Financial Trends & Analytics
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Track your financial velocity, compare income versus spending patterns, and uncover top expenditure drivers across the last 6 months.
            </p>
          </div>

          {/* Average Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-[11px] text-slate-300 font-medium">Avg. Monthly Income</span>
              <p className="text-base font-extrabold text-emerald-300 mt-1">
                {formatCurrency(averages.avgInc)}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-[11px] text-slate-300 font-medium">Avg. Monthly Spend</span>
              <p className="text-base font-extrabold text-rose-300 mt-1">
                {formatCurrency(averages.avgExp)}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-300 font-medium">Avg. Savings Rate</span>
              <p className="text-base font-extrabold text-indigo-300 mt-1">
                {formatPercentage(averages.avgRate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6-Month Comparison Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {activeChartTab === 'cashflow'
                  ? '6-Month Income vs Expenses'
                  : '6-Month Net Savings Trend'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualizing historical trajectory across last 6 months
              </p>
            </div>
          </div>

          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setActiveChartTab('cashflow')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeChartTab === 'cashflow'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Income vs Expenses
            </button>
            <button
              onClick={() => setActiveChartTab('savings')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeChartTab === 'savings'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Savings Velocity
            </button>
          </div>
        </div>

        {/* Chart Legend */}
        {activeChartTab === 'cashflow' ? (
          <div className="flex items-center justify-end gap-5 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500" />
              <span>Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-rose-500" />
              <span>Expenses</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-5 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-indigo-500" />
              <span>Net Surplus</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-rose-500" />
              <span>Deficit</span>
            </div>
          </div>
        )}

        {/* SVG/CSS Bar Chart */}
        {activeChartTab === 'cashflow' ? (
          <div className="h-64 sm:h-72 w-full flex items-end justify-between gap-2 sm:gap-6 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">
            {trendData.map((d) => {
              const incomeHeight = maxCashflow > 0 ? (d.income / maxCashflow) * 100 : 0;
              const expenseHeight = maxCashflow > 0 ? (d.expenses / maxCashflow) * 100 : 0;
              const isCurrent = d.month === activeMonth;

              return (
                <div
                  key={d.month}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative"
                >
                  {/* Floating Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] rounded-xl py-1.5 px-2.5 shadow-xl whitespace-nowrap z-20 transition-opacity border border-slate-700">
                    <p className="font-bold">{d.monthLabel}</p>
                    <p className="text-emerald-400">Income: {formatCurrency(d.income)}</p>
                    <p className="text-rose-400">Spend: {formatCurrency(d.expenses)}</p>
                  </div>

                  {/* Dual Bars */}
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                    {/* Income Bar */}
                    <div className="w-1/2 max-w-[28px] h-full flex items-end">
                      <div
                        className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-t-lg transition-all duration-500 shadow-sm"
                        style={{ height: `${Math.max(4, incomeHeight)}%` }}
                      />
                    </div>
                    {/* Expense Bar */}
                    <div className="w-1/2 max-w-[28px] h-full flex items-end">
                      <div
                        className="w-full bg-rose-500 hover:bg-rose-400 rounded-t-lg transition-all duration-500 shadow-sm"
                        style={{ height: `${Math.max(4, expenseHeight)}%` }}
                      />
                    </div>
                  </div>

                  {/* Month Label */}
                  <div className="mt-3 text-center">
                    <span
                      className={`text-xs font-bold ${
                        isCurrent
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {d.monthLabel}
                    </span>
                    {isCurrent && (
                      <span className="block w-1.5 h-1.5 bg-emerald-500 rounded-full mx-auto mt-0.5" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Savings Velocity Chart */
          <div className="h-64 sm:h-72 w-full flex items-end justify-between gap-2 sm:gap-6 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">
            {trendData.map((d) => {
              const isPositive = d.savings >= 0;
              const savingsHeight = maxSavings > 0 ? (Math.abs(d.savings) / maxSavings) * 100 : 0;
              const isCurrent = d.month === activeMonth;

              return (
                <div
                  key={d.month}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative"
                >
                  <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] rounded-xl py-1.5 px-2.5 shadow-xl whitespace-nowrap z-20 transition-opacity border border-slate-700">
                    <p className="font-bold">{d.monthLabel}</p>
                    <p className={isPositive ? 'text-indigo-400' : 'text-rose-400'}>
                      Savings: {formatCurrency(d.savings, true)}
                    </p>
                    <p className="text-slate-300">Rate: {formatPercentage(d.savingsRate)}</p>
                  </div>

                  <div className="w-full max-w-[36px] h-full flex items-end justify-center">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-500 shadow-sm ${
                        isPositive
                          ? 'bg-indigo-500 hover:bg-indigo-400'
                          : 'bg-rose-500 hover:bg-rose-400'
                      }`}
                      style={{ height: `${Math.max(4, savingsHeight)}%` }}
                    />
                  </div>

                  <div className="mt-3 text-center">
                    <span
                      className={`text-xs font-bold ${
                        isCurrent
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {d.monthLabel}
                    </span>
                    {isCurrent && (
                      <span className="block w-1.5 h-1.5 bg-indigo-500 rounded-full mx-auto mt-0.5" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top Spending Categories Leaderboard & All Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Spending Categories Leaderboard */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Top Spending Categories</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ranked by expenditure for {formatMonthYear(activeMonth)}
              </p>
            </div>
          </div>

          {categoryBreakdown.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
              No expenses recorded for this month.
            </div>
          ) : (
            <div className="space-y-4">
              {categoryBreakdown.slice(0, 5).map((item, index) => {
                const config = CATEGORY_CONFIGS[item.category] || CATEGORY_CONFIGS.Other;

                return (
                  <div
                    key={item.category}
                    className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                        #{index + 1}
                      </div>
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: `${config.color}20`,
                          color: config.color,
                        }}
                      >
                        <CategoryIcon category={item.category} className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {config.label}
                        </p>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.count} transaction{item.count > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {formatCurrency(item.amount)}
                      </p>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {formatPercentage(item.percentage)} of total
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* All Categories Spending Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">All Category Shares</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Complete distribution for {formatMonthYear(activeMonth)}
              </p>
            </div>
          </div>

          {categoryBreakdown.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
              No expenses recorded for this month.
            </div>
          ) : (
            <div className="space-y-3.5">
              {categoryBreakdown.map((item) => {
                const config = CATEGORY_CONFIGS[item.category] || CATEGORY_CONFIGS.Other;

                return (
                  <div key={item.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: config.color }}
                        />
                        <span className="text-slate-800 dark:text-slate-200">
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">
                          {formatPercentage(item.percentage)}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: config.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
