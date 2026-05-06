import type { ComplianceFramework, FrameworkSummary } from '@/types';

export type ComplianceFrameworkKey = ComplianceFramework;

export type DashboardRiskToneKey = 'low' | 'medium' | 'high' | 'unknown';

export type DashboardKpiTone =
  | 'orange'
  | 'blue'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'slate';

export interface DashboardKpi {
  key: string;
  title: string;
  value: string;
  subtitle: string;
  tone: DashboardKpiTone;
}

export type ComplianceFrameworkSnapshot = {
  controls_pass: number;
  controls_fail: number;
  controls_partial: number;
  controls_evaluated: number;
  score: number;
  implemented_pct: number;
  partial_pct: number;
  not_implemented_pct: number;
};

export type ComplianceFrameworkBarRow = {
  name: string;
  score: number;
  pass: number;
  fail: number;
  partial: number;
};

export type ComplianceFrameworkSnapshotRow = {
  framework: string;
  score: number;
  controls_evaluated: number;
  implemented_pct: number;
  partial_pct: number;
  not_implemented_pct: number;
};

export type ComplianceInsightRow = {
  framework: string;
  score: number;
  pass: number;
  fail: number;
  partial: number;
};

export type DashboardTopVulnerability = {
  title: string;
  severity?: string;
  armor_risk_score?: number;
  cve_id?: string | null;
  affected_assets?: number;
};

export type DashboardTopAsset = {
  asset_id: string;
  ip_address?: string;
  hostname?: string | null;
  device_type?: string;
  risk_score?: number;
  vulnerability_count?: number;
  is_kev_affected?: boolean;
};

export interface ComplianceDashboardData {
  overallRiskScore: number;
  overallRiskLevel: string;
  frameworkSnapshots: Record<
    ComplianceFrameworkKey,
    ComplianceFrameworkSnapshot
  >;
  frameworkSummaries: Partial<Record<ComplianceFrameworkKey, FrameworkSummary>>;
}
