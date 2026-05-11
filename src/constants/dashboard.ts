import type { ComplianceFrameworkKey } from '@/types/dashboard';

export const COMPLIANCE_FRAMEWORK_ORDER: ComplianceFrameworkKey[] = [
  'iso27001', 'cis', 'nist',
];

export const SUPPORTED_COMPLIANCE_FRAMEWORKS = COMPLIANCE_FRAMEWORK_ORDER;

export const COMPLIANCE_FRAMEWORK_LABELS: Record<ComplianceFrameworkKey, string> = {
  iso27001: 'ISO 27001',
  cis: 'CIS',
  nist: 'NIST',
};
