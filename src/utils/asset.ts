export const ASSETS_COLUMNS_NAME = [
  'IP Address',
  'Host Name',
  'MAC Address',
  'Device Type',
  'OS Name',
  'Vendor',
  'Severity',
  'Open Ports',
  'Filtered Ports',
];

import type { Asset } from '@/types';
export const CalculateAssetStatistics = (assets: Asset[]) => {
  return assets.reduce(
    (stats, asset) => {
      stats.total += 1;
      if (asset.severity in stats) {
        stats[asset.severity as keyof typeof stats] += 1;
      }
      return stats;
    },
    { total: 0, critical: 0, high: 0, medium: 0, low: 0 }
  );
};
