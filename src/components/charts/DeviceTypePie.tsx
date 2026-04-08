import { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from "chart.js";
import { transformAssetsToDeviceTypeData } from "@/constants/transform_data/transformToPieChartData";
import type { Asset } from "@/types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DeviceTypePieChartProps {
  assets: Asset[];
}

export default function DeviceTypePieChart({ assets }: DeviceTypePieChartProps) {
  const data = useMemo<ChartData<"pie">>(() => transformAssetsToDeviceTypeData(assets), [assets]);

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "rgba(255,255,255,0.7)",
          usePointStyle: true,
          padding: 20,
          font: { size: 12, family: 'Inter' },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw} assets`,
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-96 p-4">
      <div className="relative w-full max-w-[320px] aspect-square">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};
