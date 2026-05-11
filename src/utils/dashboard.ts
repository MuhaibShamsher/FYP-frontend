import type { FrameworkSummary } from '@/types';
import {
  COMPLIANCE_FRAMEWORK_LABELS,
} from '@/constants/dashboard';
import type {
  ComplianceFrameworkKey,
  ComplianceFrameworkSnapshot,
  ComplianceInsightRow,
} from '@/types/dashboard';


export function getComplianceFrameworkLabel(framework: ComplianceFrameworkKey) {
  return COMPLIANCE_FRAMEWORK_LABELS[framework];
}

export function mapComplianceFrameworkSnapshot(
  summary?: FrameworkSummary
): ComplianceFrameworkSnapshot {
  const controlsEvaluated =
    (summary?.controls_pass ?? 0) +
    (summary?.controls_fail ?? 0) +
    (summary?.controls_partial ?? 0) +
    (summary?.controls_not_applicable ?? 0) +
    (summary?.controls_needs_review ?? 0);

  return {
    controls_pass: summary?.controls_pass ?? 0,
    controls_fail: summary?.controls_fail ?? 0,
    controls_partial: summary?.controls_partial ?? 0,
    controls_evaluated: controlsEvaluated,
    score: summary?.score ?? 0,
    implemented_pct: summary?.implemented_pct ?? 0,
    partial_pct: summary?.partial_pct ?? 0,
    not_implemented_pct: summary?.not_implemented_pct ?? 0,
  };
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatCount(value: number) {
  return value.toLocaleString();
}

export function safeNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  const parsed = Number(value as any);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function formatDate(value?: string | null) {
  if (!value) return 'Not available';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Not available';

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(parsed);
  } catch {
    return parsed.toISOString();
  }
}

export function getComplianceRecommendation(
  score: number,
  failureRate: number
) {
  if (score >= 80 && failureRate < 20) {
    return 'Maintain current controls and focus on continuous monitoring.';
  }
  if (score >= 60) {
    return 'Prioritize failed controls in the lowest scoring framework and close gaps this cycle.';
  }
  return 'Address failing controls immediately and review remediation ownership across all frameworks.';
}

export function buildComplianceInsightSummary(rows: ComplianceInsightRow[]) {
  const sortedByScore = [...rows].sort((a, b) => a.score - b.score);
  const lowest = sortedByScore[0] ?? null;

  const sortedByHighest = [...rows].sort((a, b) => b.score - a.score);
  const highest = sortedByHighest[0] ?? null;

  const totalControls = rows.reduce(
    (sum, row) => sum + row.pass + row.fail + row.partial,
    0
  );
  const totalFailed = rows.reduce((sum, row) => sum + row.fail, 0);
  const overallFailureRate =
    totalControls > 0 ? (totalFailed / totalControls) * 100 : 0;

  return {
    lowest,
    highest,
    totalControls,
    totalFailed,
    overallFailureRate,
  };
}
