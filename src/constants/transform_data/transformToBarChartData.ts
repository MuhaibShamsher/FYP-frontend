import type { Asset } from '@/types';

export interface BarChartData {
  id: string;
  name: string;
  ports: number;
}

export const transformAssetToBarChartData = (assets: Asset[]): BarChartData[] => {
  return assets.map((asset) => ({
    id: asset.id,
    name: asset.ip_address,
    ports: asset.open_ports_count,
  }));
};
