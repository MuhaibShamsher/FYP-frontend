import type {
  ComplianceDashboardData,
  ComplianceFrameworkKey,
  ComplianceFrameworkBarRow,
  ComplianceFrameworkSnapshotRow,
  ComplianceInsightRow,
} from '@/types/dashboard';
import {
  getComplianceFrameworkLabel,
  mapComplianceFrameworkSnapshot,
} from '@/utils/dashboard';
import { COMPLIANCE_FRAMEWORK_ORDER } from '@/constants/dashboard';
import type { DashboardViewModel } from '@/lib/dashboardViewModel';


function findSummary( summaries: DashboardViewModel['frameworkSummaries'], framework: ComplianceFrameworkKey) {
  return summaries.find((summary) => summary.framework === framework);
}

function getFrameworkLabel(framework: ComplianceFrameworkKey) {
  return getComplianceFrameworkLabel(framework);
}

function getFrameworkSnapshot( data: ComplianceDashboardData, framework: ComplianceFrameworkKey) {
  const summary = data.frameworkSummaries[framework];
  const snapshot =
    data.frameworkSnapshots[framework] ??
    mapComplianceFrameworkSnapshot(summary);

  return { summary, snapshot };
}

export function buildComplianceDashboardData(model: DashboardViewModel): ComplianceDashboardData {
  const frameworkSummaries = COMPLIANCE_FRAMEWORK_ORDER.reduce(
    (accumulator, framework) => {
      accumulator[framework] = findSummary(model.frameworkSummaries, framework);
      return accumulator;
    },
    {} as Partial<ComplianceDashboardData['frameworkSummaries']>
  );

  const frameworkSnapshots = COMPLIANCE_FRAMEWORK_ORDER.reduce(
    (accumulator, framework) => {
      const summary = frameworkSummaries[framework];
      accumulator[framework] = mapComplianceFrameworkSnapshot(summary);
      return accumulator;
    },
    {} as ComplianceDashboardData['frameworkSnapshots']
  );

  return {
    overallRiskScore: model.overallRiskScore,
    overallRiskLevel: model.riskLevel,
    frameworkSnapshots,
    frameworkSummaries,
  };
}

export function buildComplianceFrameworkRows(data: ComplianceDashboardData): ComplianceFrameworkBarRow[] {
  return COMPLIANCE_FRAMEWORK_ORDER.map((framework) => {
    const { summary, snapshot } = getFrameworkSnapshot(data, framework);

    return {
      name: getFrameworkLabel(framework),
      score: summary?.score ?? snapshot.score,
      pass: snapshot.controls_pass,
      fail: snapshot.controls_fail,
      partial: snapshot.controls_partial,
    };
  });
}

export function buildComplianceSnapshotRows(data: ComplianceDashboardData): ComplianceFrameworkSnapshotRow[] {
  return COMPLIANCE_FRAMEWORK_ORDER.map((framework) => {
    const { summary, snapshot } = getFrameworkSnapshot(data, framework);

    return {
      framework: getFrameworkLabel(framework),
      score: summary?.score ?? snapshot.score,
      controls_evaluated: snapshot.controls_evaluated,
      implemented_pct: snapshot.implemented_pct,
      partial_pct: snapshot.partial_pct,
      not_implemented_pct: snapshot.not_implemented_pct,
    };
  });
}

export function buildComplianceInsightRows(data: ComplianceDashboardData): ComplianceInsightRow[] {
  return COMPLIANCE_FRAMEWORK_ORDER.map((framework) => {
    const { summary, snapshot } = getFrameworkSnapshot(data, framework);

    return {
      framework: getFrameworkLabel(framework),
      score: summary?.score ?? snapshot.score,
      pass: snapshot.controls_pass,
      fail: snapshot.controls_fail,
      partial: snapshot.controls_partial,
    };
  });
}
