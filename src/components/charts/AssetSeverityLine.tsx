import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import type { Asset } from '@/types';
import { transformAssetsToLineChartData } from '@/constants/transform_data/transformToLineChartData';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

export default function AssetSeverityLineChart({
  assets,
}: {
  assets: Asset[];
}) {
  const data = transformAssetsToLineChartData(assets);

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
          autoSkip: true,
          maxRotation: 45,
          minRotation: 0,
        },
        grid: { color: 'rgba(255,255,255,0.1)' },
      },
      y: {
        ticks: {
          color: 'white',
          stepSize: 1,
          callback: (val) => {
            const map: Record<number, string> = {
              1: 'Low',
              2: 'Medium',
              3: 'High',
              4: 'Critical',
            };
            return map[val as number] || '';
          },
        },
        min: 0,
        max: 4.3,
      },
    },
  };

  return (
    <div className="w-full h-[350px] p-2">
      <Line
        data={data}
        options={{
          ...options,
          maintainAspectRatio: false,
          scales: {
            x: {
              ...options.scales?.x,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: {
                ...options.scales?.x?.ticks,
                color: 'rgba(255,255,255,0.6)',
              },
            },
            y: {
              ...options.scales?.y,
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: {
                ...options.scales?.y?.ticks,
                color: 'rgba(255,255,255,0.6)',
              },
            },
          },
          plugins: {
            ...options.plugins,
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#fff',
              bodyColor: '#ccc',
              borderColor: 'rgba(255,255,255,0.1)',
              borderWidth: 1,
              padding: 10,
              displayColors: true,
            },
          },
        }}
      />
    </div>
  );
}
