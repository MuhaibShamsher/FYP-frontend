import type { Asset } from '@/types';

export interface BarChartData {
  name: string;
  ports: number;
}

export const transformAssetToBarChartData = (assets: Asset[]): BarChartData[] => {
  return assets.map((asset) => ({
    name: asset.ip_address,
    ports: asset.open_ports_count,
  }));
};
