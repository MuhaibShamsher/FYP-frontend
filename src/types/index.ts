export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
export type ScanType = 'quick' | 'standard' | 'comprehensive';
export type DeviceType =
  | 'unknown'
  | 'router'
  | 'switch'
  | 'firewall'
  | 'server'
  | 'workstation'
  | 'printer'
  | 'iot'
  | 'mobile';
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type PortState = 'open' | 'closed' | 'filtered';

export interface Scan {
  id: string;
  ip_range: string;
  scan_type: ScanType;
  status: ScanStatus;
  started_at: string | null;
  completed_at: string | null;
  total_hosts: number;
  discovered_hosts: number;
  progress: number;
  error_message: string | null;
  assets_count: number;
  duration_seconds: number | null;
  created_at: string;
  updated_at?: string;
}

export interface ScanStatistics {
  total: number;
  completed: number;
  running: number;
  failed: number;
}

export interface Port {
  id: string;
  port_number: number;
  protocol: string;
  state: PortState;
  service: string | null;
  version: string | null;
  product: string | null;
}

export interface Asset {
  id: string;
  ip_address: string;
  mac_address: string | null;
  hostname: string | null;
  device_type: DeviceType;
  vendor: string | null;
  os_name: string | null;
  os_accuracy: number | null;
  severity: Severity;
  is_active: boolean;
  last_seen: string;
  ports?: Port[];
  open_ports_count: number;
  filtered_ports_count: number;
  raw_data?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface AssetStatistics {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  info?: number;
}

export interface AssetSummary {
  scan_id: string;
  total_assets: number;
  device_types: { device_type: DeviceType; count: number }[];
  severities: { severity: Severity; count: number }[];
}

export type SectionKey = 'assets' | 'scans' | 'dashboard' | 'reports' | 'settings';

export interface ScanProgressUpdate {
  scan_id: string;
  status: string;
  message: string;
  progress: number;
  total_hosts: number;
  current_host: number;
  host: string;
  ports_found: number;
  assets_created: number;
  ports_created: number;
  successful: number;
  failed: number;
  error: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  status_code?: number;
}

export interface ApiError {
  success: boolean;
  message: string;
  data: any;
  status_code: number;
}
