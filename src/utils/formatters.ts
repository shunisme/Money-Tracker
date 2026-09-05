/**
 * Format a number as Malaysian Ringgit currency
 * Example: 1250 -> "RM 1,250.00"
 */
export const formatCurrency = (amount: number, showSign: boolean = false): string => {
  const absAmount = Math.abs(amount);
  const formattedNumber = new Intl.NumberFormat('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absAmount);

  if (showSign) {
    if (amount > 0) return `+RM ${formattedNumber}`;
    if (amount < 0) return `-RM ${formattedNumber}`;
  }

  return `RM ${formattedNumber}`;
};

/**
 * Format a date string (YYYY-MM-DD) into Malaysian friendly date
 * Example: "2026-09-03" -> "03 Sep 2026"
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;

  const [year, month, day] = parts.map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat('en-MY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Format a month string (YYYY-MM) into full readable month and year
 * Example: "2026-09" -> "September 2026"
 */
export const formatMonthYear = (monthStr: string): string => {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat('en-MY', {
    month: 'long',
    year: 'numeric',
  }).format(date);
};

/**
 * Format month short: "Sep 2026" or "Sep '26"
 */
export const formatMonthShort = (monthStr: string): string => {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat('en-MY', {
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Format a percentage
 * Example: 24.56 -> "24.6%"
 */
export const formatPercentage = (value: number, includeSign: boolean = false): string => {
  if (isNaN(value) || !isFinite(value)) return '0.0%';
  const prefix = includeSign && value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
};

/**
 * Returns current month in "YYYY-MM" format
 */
export const getCurrentMonth = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Returns today's date in "YYYY-MM-DD" format
 */
export const getTodayDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Shift month by offset (-1 for previous, +1 for next)
 */
export const shiftMonth = (monthStr: string, offset: number): string => {
  const [year, month] = monthStr.split('-').map(Number);
  const date = new Date(year, month - 1 + offset, 1);
  const newYear = date.getFullYear();
  const newMonth = String(date.getMonth() + 1).padStart(2, '0');
  return `${newYear}-${newMonth}`;
};

/**
 * Get an array of the last N months ending at a given month
 */
export const getLastNMonths = (endMonth: string, count: number = 6): string[] => {
  const result: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    result.push(shiftMonth(endMonth, -i));
  }
  return result;
};
