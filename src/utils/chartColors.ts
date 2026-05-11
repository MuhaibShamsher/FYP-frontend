// Fallback hex values for SSR and initial renders
export const SEVERITY_COLORS_FALLBACK = {
  critical: '#ef4444', // rgb(239, 68, 68)
  high: '#f59e0b', // rgb(245, 158, 11)
  medium: '#eab308', // rgb(234, 179, 8)
  low: '#3b82f6', // rgb(59, 130, 246)
} as const;
              

// Fallback palette for SSR/initial render - matches CHART_PALETTE order
export const CHART_PALETTE_FALLBACK = [
  '#ef4444',   // critical red
  '#f59e0b',   // high orange
  '#10b981',   // success green
  '#eab308',   // medium yellow
  '#3b82f6',   // info blue
  '#14b8a6',   // teal
  '#a855f7',   // purple
  '#06b6d4',   // cyan
  '#f43f5e',   // rose
  '#8b5cf6',   // violet
] as const;

// Map severity to fallback color
export const getSeverityColorFallback = (
  severity: 'critical' | 'high' | 'medium' | 'low'
): string => {
  return SEVERITY_COLORS_FALLBACK[severity];
};

// Get palette color fallback by index with wrapping
export const getPaletteColorFallback = (index: number): string => {
  return CHART_PALETTE_FALLBACK[index % CHART_PALETTE_FALLBACK.length];
};

// Get glow color for interactive elements
// Maps both CSS variables and hex colors to RGBA for glow effects
export const getGlowColor = (baseColor: string,opacity: number = 0.4): string => {
  const colorMap: Record<string, string> = {
    'var(--color-critical)': `rgba(239, 68, 68, ${opacity})`,
    'var(--color-high)': `rgba(245, 158, 11, ${opacity})`,
    'var(--color-medium)': `rgba(234, 179, 8, ${opacity})`,
    'var(--color-low)': `rgba(59, 130, 246, ${opacity})`,
    'var(--color-success)': `rgba(16, 185, 129, ${opacity})`,
    'var(--color-info)': `rgba(59, 130, 246, ${opacity})`,
    'var(--color-warning)': `rgba(245, 158, 11, ${opacity})`,
    // Hex color mappings for palette - updated for dark theme visibility
    '#14b8a6': `rgba(20, 184, 166, ${opacity})`, // teal
    '#a855f7': `rgba(168, 85, 247, ${opacity})`, // purple vibrant
    '#06b6d4': `rgba(6, 182, 212, ${opacity})`, // cyan
    '#f43f5e': `rgba(244, 63, 94, ${opacity})`, // rose
    '#8b5cf6': `rgba(139, 92, 246, ${opacity})`, // violet
  };

  return colorMap[baseColor] || baseColor;
};

// Hex color conversions for dynamic styling
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Risk level assessment based on port count
// Thresholds: critical (>20), high (>10), medium (>5), low (≤5)
export const getRiskLevel = (
  portCount: number
): 'critical' | 'high' | 'medium' | 'low' => {
  if (portCount > 20) return 'critical';
  if (portCount > 10) return 'high';
  if (portCount > 5) return 'medium';
  return 'low';
};
