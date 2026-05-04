import type { Asset } from "@/types";

export interface DeviceTypeData {
  name: string;
  value: number;
}

export const transformAssetsToDeviceTypeData = (assets: Asset[]): DeviceTypeData[] => {
  const deviceCounts: Record<string, number> = {};

  assets.forEach((asset) => {
    const type = asset.device_type?.trim() || "Unknown";
    deviceCounts[type] = (deviceCounts[type] || 0) + 1;
  });

  return Object.entries(deviceCounts).map(([name, value]) => ({
    name,
    value,
  }));
};
