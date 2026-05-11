import type { ComplianceResultStatus } from "@/types";


// Severity badge variant utilities
export const getSeverityVariant = (
  severity?: string
): 'destructive' | 'default' | 'secondary' => {
  switch (severity) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'default';
    default:
      return 'secondary';
  }
};

export const getStatusVariant = (status: ComplianceResultStatus) => {
  switch (status) {
    case 'pass':
      return 'default';
    case 'fail':
      return 'destructive';
    default:
      return 'secondary';
  }
};


export const getStatusText = (status: ComplianceResultStatus) => {
  switch (status) {
    case 'pass':
      return 'PASS';
    case 'fail':
      return 'FAIL';
    case 'partial':
      return 'PARTIAL';
    case 'needs_review':
      return 'NEEDS REVIEW';
    case 'not_applicable':
      return 'NOT APPLICABLE';
    default:
      return String(status).replace(/_/g, ' ').toUpperCase();
  }
};


// Text formatting utilities
export const formatVulnType = (vulnType?: string): string => {
  return vulnType ? vulnType.replace(/_/g, ' ') : '---';
};

// Evidence parsing utilities
export interface Evidence {
  rationale?: string;
  confidence?: string;
  evaluation_pattern?: string;
  note?: string;
  partial_inference_note?: string;
  detected?: unknown[];
  affected_assets?: unknown[];
  ports_checked?: unknown[];
  services_checked?: unknown[];
  detected_count?: number;
  total_findings?: number;
  [key: string]: unknown;
}

export interface ParsedEvidence {
  rationale: string | null;
  confidence: string | null;
  evaluationPattern: string | null;
  note: string | null;
  partialNote: string | null;
  detected: unknown[] | null;
  affectedAssets: unknown[] | null;
  portsChecked: unknown[] | null;
  servicesChecked: unknown[] | null;
  detectedCount: number | null;
  totalFindings: number | null;
}

export const parseEvidence = (evidence: Evidence): ParsedEvidence => ({
  rationale: evidence.rationale || null,
  confidence: evidence.confidence || null,
  evaluationPattern: evidence.evaluation_pattern || null,
  note: evidence.note || null,
  partialNote: evidence.partial_inference_note || null,
  detected: Array.isArray(evidence.detected) ? evidence.detected : null,
  affectedAssets: Array.isArray(evidence.affected_assets)
    ? evidence.affected_assets
    : null,
  portsChecked: Array.isArray(evidence.ports_checked)
    ? evidence.ports_checked
    : null,
  servicesChecked: Array.isArray(evidence.services_checked)
    ? evidence.services_checked
    : null,
  detectedCount:
    typeof evidence.detected_count === 'number'
      ? evidence.detected_count
      : null,
  totalFindings:
    typeof evidence.total_findings === 'number'
      ? evidence.total_findings
      : null,
});

// Asset and Finding interfaces
export interface Asset {
  hostname?: string;
  ip_address?: string;
  os_name?: string;
  device_type?: string;
  findings?: unknown[];
}

export interface Finding {
  port?: number;
  service?: string;
  severity?: string;
  vuln_type?: string;
}

// IG tags utilities
export interface IgData {
  value: boolean | null;
  index: number;
}

export const createIgData = (
  ig1: boolean | null,
  ig2: boolean | null,
  ig3: boolean | null
): IgData[] => [
  { value: ig1, index: 1 },
  { value: ig2, index: 2 },
  { value: ig3, index: 3 },
];

export const hasAnyIg = (igData: IgData[]): boolean => {
  return igData.some(({ value }) => value != null);
};

// Event handler utilities
export const createKeydownHandler =
  (callback: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };
