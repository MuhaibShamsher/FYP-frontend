import {
  ComplianceAffectedAssetsTable,
  ComplianceDetectedServicesTable,
} from '@/components/compliance';
import { Card, Badge } from '@/components/ui';
import { parseEvidence, type Evidence } from '../utils/helpers';
import { EVIDENCE_LABELS } from '../utils/constants';
import { FileText } from 'lucide-react';
import styles from './ComplianceEvidencePanel.module.css';

// Helper component for narrative sections
const NarrativeSection = ({ label, text }: { label: string; text: string }) => (
  <div className={styles.evidenceRow}>
    <div className={styles.evidenceLabel}>{label}</div>
    <p className={styles.evidenceText}>{text}</p>
  </div>
);

// Helper component for chip lists
const ChipList = ({ label, items }: { label: string; items: unknown[] }) => (
  <div className={styles.checkedColumn}>
    <div className={styles.evidenceLabel}>{label}</div>
    <div className={styles.chipList}>
      {items.map((item, index) => (
        <span
          key={`${label.toLowerCase().replace(' ', '-')}-${index}`}
          className={styles.chip}
        >
          {String(item)}
        </span>
      ))}
    </div>
  </div>
);

export default function ComplianceEvidencePanel({evidence}: {evidence: Evidence}) {
  const parsed = parseEvidence(evidence);

  const hasStatsGrid = Boolean(
    parsed.confidence ||
    parsed.evaluationPattern ||
    parsed.detectedCount !== null ||
    parsed.totalFindings !== null
  );

  const hasNarrative = Boolean(
    parsed.rationale || parsed.note || parsed.partialNote
  );

  const hasCheckedLists = Boolean(
    parsed.portsChecked?.length || parsed.servicesChecked?.length
  );

  const hasDetected = Boolean(parsed.detected?.length);
  const hasAffected = Boolean(parsed.affectedAssets?.length);

  const hasRenderable =
    hasStatsGrid ||
    hasNarrative ||
    hasCheckedLists ||
    hasDetected ||
    hasAffected;
    
  const showRawFallback = !hasRenderable && Object.keys(evidence).length > 0;

  return (
    <div>
      <h4 className={styles.sectionTitle}>
        <FileText className={styles.sectionIcon} aria-hidden />
        {EVIDENCE_LABELS.EVIDENCE}
      </h4>
      {hasStatsGrid && (
        <Card className={styles.statsGrid}>
          {parsed.confidence && (
            <div className={styles.statCell}>
              <div className={styles.evidenceLabel}>
                {EVIDENCE_LABELS.CONFIDENCE}
              </div>
              <Badge variant="secondary">{parsed.confidence}</Badge>
            </div>
          )}
          {parsed.evaluationPattern && (
            <div className={styles.statCell}>
              <div className={styles.evidenceLabel}>
                {EVIDENCE_LABELS.PATTERN}
              </div>
              <Badge variant="outline" className="font-mono">
                {parsed.evaluationPattern.replace(/_/g, ' ')}
              </Badge>
            </div>
          )}
          {parsed.detectedCount !== null && (
            <div className={styles.statCell}>
              <div className={styles.evidenceLabel}>
                {EVIDENCE_LABELS.DETECTED_ENDPOINTS}
              </div>
              <Badge variant="outline">{parsed.detectedCount}</Badge>
            </div>
          )}
          {parsed.totalFindings !== null && (
            <div className={styles.statCell}>
              <div className={styles.evidenceLabel}>
                {EVIDENCE_LABELS.TOTAL_FINDINGS}
              </div>
              <Badge variant="outline">{parsed.totalFindings}</Badge>
            </div>
          )}
        </Card>
      )}

      {parsed.rationale && (
        <NarrativeSection
          label={EVIDENCE_LABELS.RATIONALE}
          text={parsed.rationale}
        />
      )}
      {parsed.note && (
        <NarrativeSection label={EVIDENCE_LABELS.NOTE} text={parsed.note} />
      )}
      {parsed.partialNote && (
        <NarrativeSection
          label={EVIDENCE_LABELS.PARTIAL_INFERENCE}
          text={parsed.partialNote}
        />
      )}

      {hasCheckedLists && (
        <div className={`${styles.evidenceRow} ${styles.checkedGrid}`}>
          {parsed.portsChecked && parsed.portsChecked.length > 0 && (
            <ChipList
              label={EVIDENCE_LABELS.PORTS_CHECKED}
              items={parsed.portsChecked}
            />
          )}
          {parsed.servicesChecked && parsed.servicesChecked.length > 0 && (
            <ChipList
              label={EVIDENCE_LABELS.SERVICES_CHECKED}
              items={parsed.servicesChecked}
            />
          )}
        </div>
      )}

      {hasDetected && parsed.detected && (
        <ComplianceDetectedServicesTable rows={parsed.detected} />
      )}

      {hasAffected && parsed.affectedAssets && (
        <ComplianceAffectedAssetsTable assets={parsed.affectedAssets} />
      )}

      {showRawFallback && (
        <pre className={`${styles.mono} ${styles.rawEvidence}`}>
          {JSON.stringify(evidence, null, 2)}
        </pre>
      )}
    </div>
  );
}
