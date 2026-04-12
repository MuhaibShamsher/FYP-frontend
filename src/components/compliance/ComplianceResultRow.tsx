import { ChevronDown, FileText } from 'lucide-react';
import { isRecord } from '@/utils/guards';
import type { ComplianceResult } from '@/types';
import ComplianceEvidencePanel from './ComplianceEvidencePanel';
import { ComplianceStatusBadge } from '@/components/compliance/compliance-status-badge';
import { Badge } from '@/components/ui/badge';
import {
  formatDate,
  getSeverityImpactVariant,
  createIgData,
  hasAnyIg,
  createKeydownHandler,
} from './utils/helpers';
import {
  ANIMATION_DELAYS,
  EVIDENCE_LABELS,
  IG_TAG_LABELS,
  META_LABELS,
} from './utils/constants';
import styles from './styles/ComplianceResults.module.css';

interface IgTagsRowProps {
  ig1: boolean | null;
  ig2: boolean | null;
  ig3: boolean | null;
}

// Reusable component for IG tags
const IgTagsRow = ({ ig1, ig2, ig3 }: IgTagsRowProps) => {
  const igData = createIgData(ig1, ig2, ig3);

  if (!hasAnyIg(igData)) return null;

  return (
    <div className={styles.metaTags}>
      {igData.map(({ value, index }) =>
        value != null ? (
          <Badge key={`ig-${index}`} variant="outline" className="text-xs">
            IG{index}: {value ? IG_TAG_LABELS.YES : IG_TAG_LABELS.NO}
          </Badge>
        ) : null
      )}
    </div>
  );
};

// Reusable component for notes section
const NotesSection = ({ notes }: { notes: string }) => (
  <div className={styles.notesBlock}>
    <div className={styles.notesLabel}>{EVIDENCE_LABELS.NOTES}</div>
    <p className={styles.notesText}>{notes}</p>
  </div>
);

export default function ComplianceResultRow({
  row,
  index,
  isOpen,
  onToggle,
}: {
  row: ComplianceResult;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const evidence = isRecord(row.evidence) ? row.evidence : {};
  const handleKeyDown = createKeydownHandler(onToggle);

  return (
    <div
      className={styles.resultItem}
      style={{ animationDelay: `${index * ANIMATION_DELAYS.RESULT_ITEM}ms` }}
    >
      <div
        className={styles.resultHeader}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.resultIdent}>
          <ComplianceStatusBadge status={row.status} />
          <div className={styles.resultMeta}>
            <div className={styles.headlineRow}>
              <span className={styles.controlName}>{row.control_name}</span>
              <span className={styles.controlRef}>{row.control_ref}</span>
            </div>
            <div className={styles.infoRow}>
              <Badge variant="outline">{row.framework}</Badge>
              <Badge variant="outline">{row.category}</Badge>
              <Badge variant="outline">{row.automation_tier}</Badge>
              {row.severity_impact && (
                <Badge variant={getSeverityImpactVariant(row.severity_impact)}>
                  {META_LABELS.IMPACT}: {row.severity_impact}
                </Badge>
              )}
            </div>
            <div className={styles.metaTags}>
              <Badge variant="outline" className="text-xs">
                {META_LABELS.SCORED}:{' '}
                {row.is_scored ? IG_TAG_LABELS.YES : IG_TAG_LABELS.NO}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {formatDate(row.created_at)}
              </Badge>
            </div>
          </div>
        </div>

        <div className={styles.statusInfo}>
          <ChevronDown
            className={`${styles.chevron} ${isOpen ? styles.chevronExpanded : ''}`}
            size={20}
            aria-hidden
          />
        </div>
      </div>

      {isOpen && (
        <div className={styles.expandedContent}>
          <h4 className={styles.sectionTitle}>
            <FileText className={styles.sectionIcon} aria-hidden />
            {EVIDENCE_LABELS.EVIDENCE}
          </h4>
          <ComplianceEvidencePanel evidence={evidence} />

          {row.notes && <NotesSection notes={row.notes} />}
          <IgTagsRow ig1={row.ig1} ig2={row.ig2} ig3={row.ig3} />
        </div>
      )}
    </div>
  );
}
