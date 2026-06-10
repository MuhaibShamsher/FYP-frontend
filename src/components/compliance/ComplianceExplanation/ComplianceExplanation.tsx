import { Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useLazyGetComplianceExplanationQuery } from '@/apis';
import { toast } from 'sonner';
import styles from './ComplianceExplanation.module.css';

interface ComplianceExplanationProps {
  resultId: string;
}

export default function ComplianceExplanation({ resultId }: ComplianceExplanationProps) {
  const [triggerGetExplanation, { data: ragData, isFetching: isRagFetching, isError: isRagError, error: ragError }] =
    useLazyGetComplianceExplanationQuery();

  const handleGetAiExplanation = async () => {
    try {
      await triggerGetExplanation({ result_id: resultId }).unwrap();
    } catch {
      toast.error('Failed to retrieve AI explanation plan');
    }
  };

  const getErrorMessage = () => {
    if (!ragError) return '';
    if ('data' in ragError && ragError.data && typeof ragError.data === 'object') {
      const errorData = ragError.data as any;
      return errorData.message || errorData.detail || errorData.error || '';
    }
    return '';
  };

  if (isRagFetching) {
    return (
      <div className={styles.aiExplanationCard} style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className={styles.aiSpinner} />
        <span className={styles.detailLabel}>Generating AI Explanation Plan...</span>
      </div>
    );
  }

  if (isRagError) {
    const apiErrorMsg = getErrorMessage();
    return (
      <div className={styles.aiErrorContainer}>
        <div className={styles.aiErrorHeader}>
          <AlertCircle className={styles.aiErrorIcon} />
          <span className={styles.aiErrorTitle}>Failed to Retrieve Explanation</span>
        </div>
        <p className={styles.aiErrorDescription}>
          {apiErrorMsg || "We encountered an issue while generating your RAG-based AI compliance explanation. Please try again."}
        </p>
        <button onClick={handleGetAiExplanation} className={styles.aiRetryButton}>
          <RefreshCw className={styles.aiRetryIcon} /> Retry Generation
        </button>
      </div>
    );
  }

  if (!ragData) {
    return (
      <button onClick={handleGetAiExplanation} className={styles.aiButton}>
        <Sparkles className={styles.aiIcon} /> Generate AI Explanation
      </button>
    );
  }

  const genContent = ragData.generated_content || {};

  const explanation = typeof genContent.explanation === 'string' ? genContent.explanation : '';
  const evidence = Array.isArray(genContent.evidence) ? genContent.evidence : [];
  const fix_steps = Array.isArray(genContent.fix_steps) ? genContent.fix_steps : [];
  const message = typeof genContent.message === 'string' ? genContent.message : '';

  const hasContent = 
    explanation.trim().length > 0 ||
    evidence.length > 0 ||
    fix_steps.length > 0;

  if (!hasContent) {
    return (
      <div className={styles.aiExplanationCard}>
        <div className={styles.aiCardHeader}>
          <Sparkles className={styles.aiCardIcon} />
          <span>AI Explanation Unavailable</span>
        </div>
        <div className={styles.aiSection}>
          <p className={styles.aiSectionContent} style={{ color: 'var(--dashboard-text-muted)' }}>
            {message || "No detailed AI compliance explanation is currently available for this control result."}
          </p>
        </div>
        <button onClick={handleGetAiExplanation} className={styles.aiButton} style={{ marginTop: '0.5rem' }}>
          <RefreshCw className={styles.aiIcon} style={{ marginRight: '0.375rem' }} /> Retry Generation
        </button>
      </div>
    );
  }

  return (
    <div className={styles.aiExplanationCard}>
      <div className={styles.aiCardHeader}>
        <Sparkles className={styles.aiCardIcon} />
        <span>AI Compliance Insights</span>
        {ragData.confidence_level && (
          <span className={styles.aiConfidenceBadge}>
            Confidence: {ragData.confidence_level}
          </span>
        )}
      </div>

      {explanation && explanation.trim().length > 0 && (
        <div className={styles.aiSection}>
          <span className={styles.aiSectionTitle}>Explanation</span>
          <p className={styles.aiSectionContent}>{explanation}</p>
        </div>
      )}

      {evidence && evidence.length > 0 && (
        <div className={styles.aiSection}>
          <span className={styles.aiSectionTitle}>Evidence Findings</span>
          <ol className={styles.aiListOrdered}>
            {evidence.map((item, index) => (
              <li key={index} className={styles.aiListItem}>{item}</li>
            ))}
          </ol>
        </div>
      )}

      {fix_steps && fix_steps.length > 0 && (
        <div className={styles.aiSection}>
          <span className={styles.aiSectionTitle}>Recommended Remediation Steps</span>
          <ol className={styles.aiListOrdered}>
            {fix_steps.map((item, index) => (
              <li key={index} className={styles.aiListItem}>{item}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
