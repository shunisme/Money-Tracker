import React, { useState } from 'react';
import { PieChart, ArrowRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { CATEGORY_CONFIGS } from '../../constants/categories';
import { CategoryIcon } from '../common/CategoryIcon';

interface CategoryBreakdownProps {
  onViewAll?: () => void;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ onViewAll }) => {
  const { categoryBreakdown, metrics } = useFinance();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const totalExpense = metrics.totalExpenses;

  // Render an interactive SVG Donut Chart
  let cumulativePercent = 0;
  const radius = 58;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Spending Breakdown</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">By Expense Category</p>
            </div>
          </div>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {categoryBreakdown.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
            No expenses recorded for this month.
          </div>
        ) : (
          <div className="mt-6 flex flex-col md:flex-row items-center gap-6">
            {/* SVG Donut Chart */}
            <div className="relative w-40 h-40 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeWidth="18"
                  fill="none"
                />
                {/* Segments */}
                {categoryBreakdown.map((item) => {
                  const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((cumulativePercent / 100) * circumference);
                  cumulativePercent += item.percentage;
                  const config = CATEGORY_CONFIGS[item.category] || CATEGORY_CONFIGS.Other;
                  const isHovered = hoveredCategory === item.category;

                  return (
                    <circle
                      key={item.category}
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke={config.color}
                      strokeWidth={isHovered ? "22" : "18"}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      fill="none"
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredCategory(item.category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    />
                  );
                })}
              </svg>
              {/* Center Info */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
                <span className="text-[11px] font-medium text-slate-400">Total Spent</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white truncate max-w-[100px]">
                  {formatCurrency(totalExpense)}
                </span>
              </div>
            </div>

            {/* Category List */}
            <div className="flex-1 w-full space-y-3">
              {categoryBreakdown.slice(0, 5).map((item) => {
                const config = CATEGORY_CONFIGS[item.category] || CATEGORY_CONFIGS.Other;
                const isHovered = hoveredCategory === item.category;

                return (
                  <div
                    key={item.category}
                    onMouseEnter={() => setHoveredCategory(item.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className={`p-2 rounded-xl transition-all ${
                      isHovered
                        ? 'bg-slate-50 dark:bg-slate-800/80 scale-[1.01]'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${config.color}20`, color: config.color }}
                        >
                          <CategoryIcon category={item.category} className="w-3 h-3" />
                        </div>
                        <span className="text-slate-800 dark:text-slate-200">
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 dark:text-slate-400">
                          {formatPercentage(item.percentage)}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    </div>
                    {/* Tiny Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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

              {categoryBreakdown.length > 5 && (
                <div className="text-xs text-slate-400 dark:text-slate-500 pt-1 text-center font-medium">
                  +{categoryBreakdown.length - 5} more categories in Analytics
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
