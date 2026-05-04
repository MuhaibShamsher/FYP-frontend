export type ScanStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';
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

export type SectionKey =
  | 'assets'
  | 'scans'
  | 'dashboard'
  | 'reports'
  | 'settings'
  | 'users'
  | 'vulnerabilities'
  | 'compliance-violations'
  | 'compliance-results'
  | 'compliance'
  | 'feeds';

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
  pagination: any;
  success: boolean;
  message: string;
  data: T;
  status_code?: number;
}

export interface PaginationMeta {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

export interface ApiError {
  success: boolean;
  message: string;
  data: any;
  status_code: number;
}

// --- Risk Assessment Types ---

export type AssessmentStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type DetectionSource = 'nvd_cpe' | 'nvd_version' | 'rule';

export interface Assessment {
  id: string;
  scan_id: string;
  scan_ip_range: string;
  scan_type: string;
  status: AssessmentStatus;
  overall_risk_score: number;
  overall_risk_level: RiskLevel;
  total_vulnerabilities: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  info_count: number;
  triggered_by_email: string | null;
  duration_seconds: number | null;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  created_at: string;
}

export interface Vulnerability {
  id: string;
  vuln_type: string;
  title: string;
  description: string;
  severity: RiskLevel;
  cvss_score: number | null;
  cvss_vector: string | null;
  epss_score: number | null;
  is_kev: boolean;
  armor_risk_score: number;
  detection_source: DetectionSource;
  confidence: number;
  remediation: string;
  cwe_ids: string[];
  tags: string[];
  cve_id: string | null;
  asset_id: string | null;
  asset_ip: string | null;
  port_number: number | null;
  port_protocol: string | null;
  created_at: string;
}

export interface AssetRiskProfileListItem {
  id: string;
  asset: {
    id: string;
    ip_address: string;
    hostname: string | null;
    mac_address: string | null;
    device_type: string;
    os_name: string | null;
    vendor: string | null;
  };
  risk_score: number;
  risk_level: RiskLevel;
  vulnerability_count: number;
  critical_vuln_count: number;
  high_vuln_count: number;
  medium_vuln_count: number;
  low_vuln_count: number;
  nvd_findings_count: number;
  rule_findings_count: number;
  is_kev_affected: boolean;
  highest_cvss_score: number;
  highest_epss_score: number;
  created_at: string;
}

export interface AssetRiskProfileDetail extends AssetRiskProfileListItem {
  vulnerabilities: Vulnerability[];
  complianceIssues: ComplianceResult[];
  recommendations: string[];
  ai_summary: string | null;
  updated_at: string;
}

export interface RiskDashboardStatistics {
  assessment: Assessment;
  statistics: {
    assessment_id: string;
    status: AssessmentStatus;
    overall_risk_score: number;
    overall_risk_level: RiskLevel;
    total_assets: number;
    assessed_assets: number;
    nvd_covered_assets: number;
    rule_only_assets: number;
    kev_affected_count: number;
    severity_breakdown: {
      critical: number;
      high: number;
      medium: number;
      low: number;
      info: number;
      total: number;
    };
    vuln_type_breakdown: Record<string, number>;
    detection_source_breakdown: Record<string, number>;
    top_vulnerabilities: Array<{
      title: string;
      severity: RiskLevel;
      armor_risk_score: number;
      vuln_type: string;
      cve_id: string | null;
      affected_assets: number;
    }>;
    top_assets: Array<{
      asset_id: string;
      ip_address: string;
      hostname: string | null;
      device_type: string;
      risk_score: number;
      risk_level: RiskLevel;
      vulnerability_count: number;
      is_kev_affected: boolean;
    }>;
  };
}

export interface AssessmentProgressUpdate {
  assessment_id: string;
  status: AssessmentStatus;
  message: string;
  progress: number;
  total_assets: number;
  completed_assets: number;
  error?: string;
}

// --- Compliance Inspection Types ---

export type ComplianceAssessmentStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type ComplianceFramework = 'iso27001' | 'cis' | 'nist';

export type ComplianceResultStatus =
  | 'pass'
  | 'fail'
  | 'partial'
  | 'not_applicable'
  | 'needs_review';

export type SeverityImpact = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface ComplianceAssessmentContext {
  id: string;
  scan_id: string;
  scan_ip_range: string;
  scan_type: string;
  status: string;
  overall_risk_score: number;
  overall_risk_level: string;
  total_vulnerabilities: number;
  created_at: string;
}

export interface ComplianceAssessmentListItem {
  id: string;
  assessment: ComplianceAssessmentContext;
  frameworks: ComplianceFramework[];
  status: ComplianceAssessmentStatus;
  triggered_by_email: string | null;
  duration_seconds: number | null;
  iso_score: number | null;
  cis_score: number | null;
  nist_score: number | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface FrameworkSummary {
  framework: ComplianceFramework;
  framework_display: string;
  controls_pass: number;
  controls_fail: number;
  controls_partial: number;
  controls_not_applicable: number;
  controls_needs_review: number;
  controls_evaluated: number;
  score: number | null;
  implemented_pct: number;
  partial_pct: number;
  not_implemented_pct: number;
}

export interface ComplianceResult {
  id: string;
  framework: ComplianceFramework;
  control_ref: string;
  control_name: string;
  category: string;
  automation_tier: 'auto' | 'partial' | 'human';
  status: ComplianceResultStatus;
  severity_impact: SeverityImpact | null;
  ig1: boolean | null;
  ig2: boolean | null;
  ig3: boolean | null;
  is_scored: boolean;
  evidence: Record<string, unknown>;
  notes: string;
  created_at: string;
}

export interface RootCause {
  port: number | null;
  service: string | null;
  vuln_type: string | null;
  severity: string | null;
  cvss_score: number | null;
  is_kev: boolean;
  description: string | null;
  controls_violated: string[];
}

export interface ViolatingAsset {
  ip_address: string;
  hostname: string | null;
  device_type: string | null;
  os_name: string | null;
  violation_count: number;
  controls_violated: string[];
  root_causes: RootCause[];
}

export interface ComplianceUpdate {
  compliance_assessment_id: string;
  status: ComplianceAssessmentStatus;
  message: string;
  progress: number;
  frameworks: ComplianceFramework[];
  error: string;
}

export type FeedType = 'nvd' | 'epss' | 'cisa_kev';

export interface FeedMetadata {
  since?: string;
  [key: string]: any;
}

export interface FeedStatus {
  feed_type: FeedType;
  last_successful_run: string;
  records_processed: number;
  records_errors: number;
  source_name: string;
  mode: 'incremental' | 'full';
  task_id: string;
  metadata: FeedMetadata;
  is_running: boolean;
  is_stale: boolean;
}

export interface FeedStatusResponse {
  feeds: FeedStatus[];
}
