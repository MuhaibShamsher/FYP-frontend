// Badge variants
export const BADGE_VARIANTS = {
  HIGH: 'destructive' as const,
  MEDIUM: 'default' as const,
  LOW: 'secondary' as const,
  OUTLINE: 'outline' as const,
} as const;

// Severity levels
export const SEVERITY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

// Default text values
export const DEFAULT_TEXT = {
  NO_DATA: '---',
  UNKNOWN_HOST: 'Unknown host',
  NO_FINDINGS: 'No findings listed for this asset.',
  NO_AFFECTED_ASSETS: 'No affected assets found.',
  NO_DATA_AVAILABLE: 'NO DATA AVAILABLE',
  NO_DATA_MESSAGE: 'There is no data to display at this time.',
} as const;

// Animation delays
export const ANIMATION_DELAYS = {
  RESULT_ITEM: 25, // ms per item
} as const;

// Table column spans
export const TABLE_COL_SPANS = {
  ASSET_GROUP: 4,
  EMPTY_ROW: 4,
} as const;

// IG tag labels
export const IG_TAG_LABELS = {
  YES: 'yes',
  NO: 'no',
} as const;

// Evidence section labels
export const EVIDENCE_LABELS = {
  CONFIDENCE: 'Confidence',
  PATTERN: 'Pattern',
  DETECTED_ENDPOINTS: 'Detected endpoints',
  TOTAL_FINDINGS: 'Total findings',
  RATIONALE: 'Rationale',
  NOTE: 'Note',
  PARTIAL_INFERENCE: 'Partial inference',
  PORTS_CHECKED: 'Ports checked',
  SERVICES_CHECKED: 'Services checked',
  AFFECTED_ASSETS: 'Affected assets',
  DETECTED_SERVICES: 'Detected services',
  EVIDENCE: 'Evidence',
  NOTES: 'Notes',
} as const;

// Table headers
export const TABLE_HEADERS = {
  PORT: 'Port',
  SERVICE: 'Service',
  SEVERITY: 'Severity',
  TYPE: 'Type',
  HOST: 'Host',
  IP: 'IP',
} as const;

// Meta labels
export const META_LABELS = {
  SCORED: 'Scored',
  IMPACT: 'Impact',
} as const;

// Compliance page constants
export const COMPLIANCE_RESULTS_PAGE_SIZE = 20;

/** When no assessment is selected in app state (e.g. direct navigation). */
export const FALLBACK_COMPLIANCE_ASSESSMENT_ID =
  '0fbe3433-16d4-4878-835c-a85e31eb70a7';
