import { TopPriorityList } from '../TopPriorityList/TopPriorityList.tsx';
import type { DashboardTopVulnerability } from '@/types/dashboard';
import styles from './TopVulnerabilitiesList.module.css';

function getSeverityClass(severity?: string) {
  switch ((severity ?? '').toLowerCase()) {
    case 'critical':
      return styles.severityCritical;
    case 'high':
      return styles.severityHigh;
    case 'medium':
      return styles.severityMedium;
    case 'low':
      return styles.severityLow;
    default:
      return styles.severityNeutral;
  }
}

export function TopVulnerabilitiesList({
  items,
}: {
  items: DashboardTopVulnerability[];
}) {
  return (
    <TopPriorityList
      items={items}
      emptyMessage="No vulnerabilities found"
      styles={styles as Record<string, string>}
      getKey={(vuln: DashboardTopVulnerability, index: number) =>
        `${vuln.cve_id ?? vuln.title}-${index}`
      }
      renderTitle={(vuln: DashboardTopVulnerability) => (
        <div className={styles.itemTitle} title={vuln.title}>
          {vuln.cve_id}
        </div>
      )}
      renderSubline={(vuln: DashboardTopVulnerability) => (
        <>
          <span
            className={`${styles.severityBadge} ${getSeverityClass(vuln.severity)}`}
          >
            Severity: {vuln.severity ?? 'N/A'}
          </span>
          <span className={styles.mutedText}>
            {vuln.affected_assets ?? 0} affected assets
          </span>
        </>
      )}
      renderMeta={(vuln: DashboardTopVulnerability) => (
        <>
          <span className={styles.scoreBadge}>
            Armor Score: {vuln.armor_risk_score?.toFixed(1) ?? '—'}
          </span>
        </>
      )}
    />
  );
}
