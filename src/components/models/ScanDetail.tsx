import { useNavigate } from 'react-router-dom';
import { useGenerateScanReportMutation } from '@/store/apis/reports';
import { formatDateTime, formatDuration } from '@/utils/formatUtils';
import { getStatusColor } from '@/utils/scan';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Scan } from '@/types';
import {
  FileText,
  Clock,
  Calendar,
  ShieldCheck,
  LayoutList,
  ArrowRight,
  TrendingUp,
  X,
  Activity,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import styles from './styles/ScanDetail.module.css';

interface ScanDetailModalProps {
  selectedScan: Scan;
  setSelectedScan: (scan: Scan | null) => void;
}

export default function ScanDetailModal({
  selectedScan,
  setSelectedScan,
}: ScanDetailModalProps) {
  const [generateReport, { isLoading: isGeneratingReport }] =
    useGenerateScanReportMutation();

  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    try {
      const blob = await generateReport(selectedScan.id).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `scan_report_${selectedScan.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast.error('Failed to generate report');
    }
  };

  return (
    <div className={styles.backdrop}>
      <Card className={styles.scanCard}>
        {/* Header */}
        <CardHeader className={styles.header}>
          <div className={styles.headerInfo}>
            <div className={styles.headerLabel}>
              <Activity className={styles.headerIcon} />
              Scan Details
            </div>
            <div className={styles.headerMain}>
              <span className={styles.scanId}>
                {selectedScan.id.substring(0, 8)}...
              </span>
              <Badge
                className={`${getStatusColor(selectedScan.status)} ${styles.statusBadge}`}
              >
                {selectedScan.status}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedScan(null)}
            className={styles.closeButton}
          >
            <X className={styles.closeIcon} />
          </Button>
        </CardHeader>

        <CardContent className={styles.content}>
          <div className={styles.infoGrid}>
            {/* Progress Metric */}
            <div className={styles.progressContainer}>
              <div className={styles.progressCard}>
                <div className={styles.progressLeft}>
                  <div className={styles.progressIconBox}>
                    <TrendingUp className={styles.progressIcon} />
                  </div>
                  <div>
                    <div className={styles.progressLabel}>Progress</div>
                    <div className={styles.progressSubtext}>
                      Scan Completion Rate
                    </div>
                  </div>
                </div>
                <div className={styles.progressValue}>
                  {selectedScan.progress}%
                </div>
              </div>
            </div>

            {/* Temporal Data */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Timeline</h3>
              <div className={styles.dataList}>
                <div className={styles.dataRow}>
                  <span className={styles.dataLabel}>
                    <Calendar className={styles.dataIcon} /> Started
                  </span>
                  <span className={styles.dataValue}>
                    {formatDateTime(selectedScan.started_at)}
                  </span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.dataLabel}>
                    <Clock className={styles.dataIcon} /> Duration
                  </span>
                  <span className={styles.dataValue}>
                    {formatDuration(selectedScan.duration_seconds)}
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics Data */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Metrics</h3>
              <div className={styles.dataList}>
                <div className={styles.dataRow}>
                  <span className={styles.dataLabel}>
                    <ShieldCheck className={styles.dataIcon} /> Assets Found
                  </span>
                  <span className={styles.dataValueBold}>
                    {selectedScan.assets_count}
                  </span>
                </div>
                <div className={styles.dataRow}>
                  <span className={styles.dataLabel}>
                    <LayoutList className={styles.dataIcon} /> Type
                  </span>
                  <span className={styles.dataValueCap}>
                    {selectedScan.scan_type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <Button
              className={styles.reportButton}
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
            >
              {isGeneratingReport ? (
                <>
                  <Loader2 className={styles.spinnerIcon} />{' '}
                  GENERATING...
                </>
              ) : (
                <>
                  <FileText className={styles.buttonIconLeft} /> GENERATE REPORT
                </>
              )}
            </Button>
            <Button
              className={styles.viewAssetsButton}
              onClick={() => navigate(`/assets?scanID=${selectedScan.id}`)}
              disabled={isGeneratingReport}
            >
              VIEW ASSETS <ArrowRight className={styles.buttonIconRight} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
