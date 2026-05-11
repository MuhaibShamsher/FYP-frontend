import type { Asset } from '@/types';

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

export interface SeverityLineData {
  name: string;
  severity: number;
}

export const transformAssetsToLineChartData = (
  assets: Asset[]
): SeverityLineData[] => {
  return assets.map((asset) => ({
    name: asset.ip_address,
    severity: severityToNumber(asset.severity),
  }));
};
