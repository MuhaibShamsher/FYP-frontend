import type { Asset } from "@/types";

export const transformAssetsToDeviceTypeData = (assets: Asset[]) => {
  // Count occurrences of each device_type
  const deviceCounts: Record<string, number> = {};

  assets.forEach((asset) => {
    const type = asset.device_type?.trim() || "Unknown";
    deviceCounts[type] = (deviceCounts[type] || 0) + 1;
  });

  const labels = Object.keys(deviceCounts);
  const values = Object.values(deviceCounts);

  // Dynamic color generation based on count
  const backgroundColors = [
    "rgba(249, 115, 22, 0.8)",  // Primary Orange (Brand)
    "rgba(20, 184, 166, 0.8)",  // Teal (Cyan)
    "rgba(139, 92, 246, 0.8)",  // Violet (Purple)
    "rgba(59, 130, 246, 0.8)",  // Blue (Tech)
    "rgba(236, 72, 153, 0.8)",  // Pink (Accent)
    "rgba(234, 179, 8, 0.8)",   // Yellow (Warning)
  ].slice(0, labels.length);

  const borderColors = backgroundColors.map((color) =>
    color.replace("0.7", "1")
  );

  return {
    labels,
    datasets: [
      {
        label: "Devices by Type",
        data: values,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
      },
    ],
  };
};
