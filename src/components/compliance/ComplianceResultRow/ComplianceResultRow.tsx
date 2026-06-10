import { ComplianceEvidencePanel } from '@/components/compliance';
import { ExpandableRow } from '@/components/custom';
import { Badge } from '@/components/ui';
import ComplianceExplanation from '../ComplianceExplanation/ComplianceExplanation';
import {
  createIgData,
  hasAnyIg,
  createKeydownHandler,
  getStatusText,
  getStatusVariant,
} from '../utils/helpers';
import { EVIDENCE_LABELS, IG_TAG_LABELS } from '../utils/constants';
import { isRecord } from '@/utils/guards';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import type { ComplianceResult, ComplianceResultStatus } from '@/types';
import styles from './ComplianceResultRow.module.css';

interface IgTagsRowProps {
  ig1: boolean | null;
  ig2: boolean | null;
  ig3: boolean | null;
}

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

interface ComplianceResultRowProps {
  row: ComplianceResult;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ComplianceResultRow({row, isOpen, onToggle}: ComplianceResultRowProps) {
  const evidence = isRecord(row.evidence) ? row.evidence : {};
  const handleKeyDown = createKeydownHandler(onToggle);

  const getStatusIcon = (status: ComplianceResultStatus) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="w-3 h-3" />;
      case 'fail':
        return <XCircle className="w-3 h-3" />;
      default:
        return <AlertTriangle className="w-3 h-3" />;
    }
  };

  const headerContent = (
    <>
      <Badge variant={getStatusVariant(row.status)} className="gap-1">
        {getStatusIcon(row.status)}
        {getStatusText(row.status)}
      </Badge>
      <div className={styles.resultMeta}>
        <div className={styles.headlineRow}>
          <span className={styles.controlName}>{row.control_name}</span>
          <span className={styles.controlRef}>{row.control_ref}</span>
        </div>
        <div className={styles.infoRow}>
          <Badge variant="outline">{row.framework}</Badge>
          <Badge variant="outline">{row.category}</Badge>
          <Badge variant="outline">{row.automation_tier}</Badge>
        </div>
      </div>
    </>
  );

  const expandedContent = (
    <>
      <ComplianceEvidencePanel evidence={evidence} />

      {row.notes && (
        <div className={styles.notesBlock}>
          <div className={styles.notesLabel}>{EVIDENCE_LABELS.NOTES}</div>
          <p className={styles.notesText}>{row.notes}</p>
        </div>
      )}

      <ComplianceExplanation resultId={row.id} />

      <IgTagsRow ig1={row.ig1} ig2={row.ig2} ig3={row.ig3} />
    </>
  );

  return (
    <ExpandableRow
      isOpen={isOpen}
      onToggle={onToggle}
      headerContent={headerContent}
      expandedContent={expandedContent}
      onKeyDown={handleKeyDown}
    />
  );
}
