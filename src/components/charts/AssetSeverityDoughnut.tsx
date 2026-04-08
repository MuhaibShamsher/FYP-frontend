import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { CalculateAssetStatistics } from '@/utils/asset';
import type { Asset } from '@/types';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ assets }: { assets: Asset[] }) {
  const navigate = useNavigate();

  const stats = useMemo(() => CalculateAssetStatistics(assets), [assets]);

  const labels = ['Critical', 'High', 'Medium', 'Low'];
  const backgroundColors = [
    'rgba(239, 68, 68, 0.8)',   // Critical - Red-500
    'rgba(249, 115, 22, 0.8)',  // High - Orange-500
    'rgba(234, 179, 8, 0.8)',   // Medium - Yellow-500
    'rgba(34, 197, 94, 0.8)',   // Low - Green-500
  ];

  const borderColors = [
    'rgb(239, 68, 68)',
    'rgb(249, 115, 22)',
    'rgb(234, 179, 8)',
    'rgb(34, 197, 94)',
  ];

  const data: ChartData<'doughnut'> = {
    labels,
    datasets: [
      {
        label: 'Asset Severity',
        data: [stats.critical, stats.high, stats.medium, stats.low],
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    cutout: '75%',
    onClick: (_, chartElement) => {
      if (chartElement.length > 0) {
        navigate('/assets');
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: 'rgba(255,255,255,0.7)',
          usePointStyle: true,
          boxWidth: 8,
          padding: 20,
          font: { size: 12, family: 'Inter' },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw} assets`,
        },
      },
    },
  };

  return (
    <div className="w-full h-96 flex items-center justify-center p-4">
      <div className="w-full max-w-[360px] h-full">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
