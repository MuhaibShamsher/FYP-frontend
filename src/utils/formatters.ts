// Format a number to locale string or return '0'
export const fmtNum = (n: number | undefined | null): string => {
  if (n === null || n === undefined) return '0';
  return n.toLocaleString();
};

// Returns a standardized CSS class label string for Risk thresholds.
export const getRiskClassLabel = (
  level: string | undefined
): 'critical' | 'high' | 'medium' | 'low' | '' => {
  if (!level) return '';
  const lower = level.toLowerCase();

  if (lower.includes('crit')) return 'critical';
  if (lower.includes('high')) return 'high';
  if (lower.includes('med')) return 'medium';

  return 'low';
};
