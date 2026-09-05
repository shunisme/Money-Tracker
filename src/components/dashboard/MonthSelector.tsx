import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, RotateCcw } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatMonthYear, getCurrentMonth } from '../../utils/formatters';

export const MonthSelector: React.FC = () => {
  const { activeMonth, setActiveMonth, prevMonth, nextMonth } = useFinance();
  const currentMonth = getCurrentMonth();
  const isCurrentMonth = activeMonth === currentMonth;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setActiveMonth(e.target.value);
    }
  };

  const openPicker = () => {
    if (inputRef.current) {
      inputRef.current.showPicker?.();
    }
  };

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-sm">
      {/* Previous Month */}
      <button
        onClick={prevMonth}
        title="Previous Month"
        aria-label="Previous Month"
        className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Month Label with Month Picker trigger */}
      <div className="relative">
        <button
          onClick={openPicker}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{formatMonthYear(activeMonth)}</span>
        </button>

        {/* Hidden Native Month Input for full browser accessibility */}
        <input
          ref={inputRef}
          type="month"
          value={activeMonth}
          onChange={handleMonthChange}
          className="absolute inset-0 opacity-0 pointer-events-none w-0 h-0"
        />
      </div>

      {/* Next Month */}
      <button
        onClick={nextMonth}
        title="Next Month"
        aria-label="Next Month"
        className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Jump back to Current Month if looking at history */}
      {!isCurrentMonth && (
        <button
          onClick={() => setActiveMonth(currentMonth)}
          title="Jump to Current Month"
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-xl transition-colors ml-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Current</span>
        </button>
      )}
    </div>
  );
};
