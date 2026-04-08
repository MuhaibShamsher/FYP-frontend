import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { transformAssetToBarChartData } from "@/constants/transform_data/transformToBarChartData";
import type { Asset } from "@/types";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function BarChart({ assets }: { assets: Asset[] }) {
  const { labels, datasets, maxPorts } = transformAssetToBarChartData(assets);

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        callbacks: {
          label: (ctx) => `Open Ports: ${ctx.raw}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "rgba(255,255,255,0.6)",
          autoSkip: true,
          maxRotation: 45,
          minRotation: 0,
        },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "rgba(255,255,255,0.6)" },
        suggestedMax: maxPorts + 1,
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  return (
    <div className="w-full h-[350px] p-2">
      <Bar data={{ labels, datasets }} options={options} />
    </div>
  );
};
