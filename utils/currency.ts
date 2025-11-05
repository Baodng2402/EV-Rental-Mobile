/**
 * Format a number as Vietnamese Dong (VND) currency
 * Example: 1500000 => "1,500,000 ₫"
 */
export const formatVND = (amount: number): string => {
  return `${amount.toLocaleString('vi-VN')} ₫`;
};

/**
 * Format daily rate in VND
 * Example: 1500000 => "1,500,000 ₫/day"
 */
export const formatDailyRate = (amount: number): string => {
  return `${formatVND(amount)}/day`;
};
