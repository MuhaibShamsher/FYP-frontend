import type { Asset } from '@/types';

export const transformAssetToBarChartData = (assets: Asset[]) => {
  const labels = assets.map((asset) => asset.ip_address);
  const openPorts = assets.map((asset) => asset.open_ports_count);

  let maxPorts = Math.max(...openPorts, 0);

  return {
    labels,
    datasets: [
      {
        label: 'Open Ports per Asset',
        data: openPorts,
        backgroundColor: 'rgba(249, 115, 22, 0.7)',
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
    maxPorts
  };
};
