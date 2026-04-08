import type { Asset } from '@/types';
import type { ChartData } from 'chart.js';

const severityToNumber = (severity: Asset['severity']): number => {
  switch (severity) {
    case 'critical':
      return 4;
    case 'high':
      return 3;
    case 'medium':
      return 2;
    case 'low':
      return 1;
    default:
      return 0;
  }
};

export const transformAssetsToLineChartData = (
  assets: Asset[]
): ChartData<'line'> => {
  const labels = assets.map((a) => a.ip_address);
  const severityValues = assets.map((a) => severityToNumber(a.severity));

  const backgroundColors = assets.map((a) => {
    switch (a.severity) {
      case 'critical':
        return 'rgba(239, 68, 68, 0.7)';
      case 'high':
        return 'rgba(249, 115, 22, 0.7)';
      case 'medium':
        return 'rgba(34, 197, 94, 0.7)';
      case 'low':
        return 'rgba(234, 179, 8, 0.7)';
      default:
        return 'rgba(107, 114, 128, 0.7)';
    }
  });

  return {
    labels,
    datasets: [
      {
        label: 'Asset Severity by IP',
        data: severityValues,
        fill: false,
        borderColor: 'rgba(249, 115, 22, 0.7)', // orange line
        backgroundColor: backgroundColors,
        tension: 0.3, // smooth curve
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };
};
