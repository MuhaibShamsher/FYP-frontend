import type { RootState } from '@/store';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { scanReset } from '@/store/slices/scanSessionSlice';
import { RadarScanner } from '@/components/custom';
import {
  Label,
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui';
import {
  Globe,
  Shield,
  Play,
  XSquare,
  Activity,
  AlertTriangle,
  ScanLine,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import styles from './InitiateScan.module.css';

const CIDR_RE = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;

const validateIPRange = (range: string): { valid: boolean; error?: string } => {
  if (!CIDR_RE.test(range)) return { valid: false, error: 'Format must be IP or CIDR (e.g., 192.168.1.0/24)' };

  const [ip, mask] = range.split('/');
  const octets = ip.split('.');

  for (const octet of octets) {
    const num = parseInt(octet, 10);
    if (isNaN(num) || num < 0 || num > 255) {
      return { valid: false, error: `Invalid IP: Octet '${octet}' must be between 0 and 255` };
    }
  }

  if (mask) {
    const maskNum = parseInt(mask, 10);
    if (isNaN(maskNum) || maskNum < 0 || maskNum > 32) {
      return { valid: false, error: `Invalid subnet: '/${mask}' must be between 0 and 32` };
    }
  }

  return { valid: true };
};

const FRAMEWORK_OPTIONS = [
  { id: 'iso-27001', label: 'ISO 27001 2022' },
  { id: 'nist-800-53', label: 'NIST SP 800-53 Rev 5' },
  { id: 'cis-controls', label: 'CIS Controls' },
] as const;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStart: (
    network_range: string,
    scan_type: 'standard' | 'comprehensive',
    frameworks?: string[]
  ) => Promise<void> | void;
  onCancel: () => Promise<void> | void;
  isCreating?: boolean;
  isCancelling?: boolean;
}

export default function InitiateScanModal({
  isOpen,
  onClose,
  onStart,
  onCancel,
  isCreating,
  isCancelling,
}: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    isScanning,
    status,
    message,
    progress,
    totalHosts,
    currentHost,
    host,
    portsFound,
    assetsCreated,
    portsCreated,
    successful,
    failed,
  } = useSelector((s: RootState) => s.scanSession);

  const {
    riskAssessmentId,
    complianceId,
    riskProgress,
    complianceProgress,
    isPipelineActive,
  } = useSelector((s: RootState) => s.activeIds);

  const [ipRange, setIpRange] = useState<string>('');
  const [scanType, setScanType] = useState<'standard' | 'comprehensive'>(
    'standard'
  );
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setIpRange('');
      setScanType('standard');
      setSelectedFrameworks([]);
    }
  }, [isOpen]);

  const handleStartClick = async () => {
    if (isCreating) return;
    const trimmed = ipRange.trim();
    if (!trimmed) {
      toast.error('Please enter a target IP range.');
      return;
    }

    const validation = validateIPRange(trimmed);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    await onStart(
      trimmed,
      scanType,
      selectedFrameworks.length > 0 ? selectedFrameworks : undefined
    );
  };

  const toggleFramework = (framework: string) => {
    setSelectedFrameworks((previousFrameworks) =>
      previousFrameworks.includes(framework)
        ? previousFrameworks.filter(
          (existingFramework) => existingFramework !== framework
        )
        : [...previousFrameworks, framework]
    );
  };

  const isPipelineRunning = isScanning || isPipelineActive;

  const isActive = isPipelineRunning;
  const isDone =
    (status === 'completed' && !isPipelineActive) ||
    status === 'failed' ||
    status === 'cancelled';

  let displayStatus = '';
  if (isScanning) {
    displayStatus = 'SCANNING_ACTIVE';
  } else if (isPipelineActive) {
    if (complianceId) {
      displayStatus = 'COMPLIANCE_ACTIVE';
    } else if (riskAssessmentId) {
      displayStatus = 'RISK_ANALYSIS_ACTIVE';
    } else {
      displayStatus = 'PROCESSING';
    }
  } else if (isDone) {
    displayStatus = status.toUpperCase();
  }

  const statusClass = isPipelineRunning
    ? styles.statusActive
    : status === 'completed'
      ? styles.statusCompleted
      : status === 'failed'
        ? styles.statusFailed
        : status === 'cancelled'
          ? styles.statusCancelled
          : '';

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className={`${styles.modalContent}`}
        onInteractOutside={(e) => {
          if (isActive) {
            e.preventDefault();
            toast.warning('Scan is in progress. Please abort the scan before closing.');
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isActive) e.preventDefault();
        }}
      >
        {/* Modal Header */}
        <div className={styles.header}>
          <div className={styles.headerIconContainer}>
            <ScanLine className={styles.headerIcon} />
          </div>
          <div className={styles.titleContainer}>
            <DialogTitle className={styles.title}>
              INITIATE NETWORK SCAN
            </DialogTitle>
          </div>
        </div>

        <div className={styles.gridContainer}>
          {/* Left Column: Form or Live Stats */}
          <div className={styles.controlsColumn}>
            {isActive || isDone ? (
              /* Live Stats Panel */
              <div className={styles.statsPanel}>
                {message && (
                  <p className={styles.statsMessage} key={message}>
                    {message}
                  </p>
                )}

                {host && isScanning && (
                  <div className={styles.statsCurrentHost}>
                    <span className={styles.statsCurrentHostLabel}>
                      SCANNING
                    </span>
                    <span className={styles.statsCurrentHostValue}>{host}</span>
                  </div>
                )}

                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>HOSTS</span>
                    <span className={styles.statValue}>
                      {totalHosts > 0 ? `${currentHost}/${totalHosts}` : '—'}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>PORTS FOUND</span>
                    <span className={styles.statValue}>
                      {isDone ? portsFound : portsFound > 0 ? portsFound : '—'}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>SUCCESSFUL</span>
                    <span
                      className={`${styles.statValue} ${successful > 0 ? styles.statSuccess : ''}`}
                    >
                      {isDone ? successful : successful > 0 ? successful : '—'}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>FAILED</span>
                    <span
                      className={`${styles.statValue} ${failed > 0 ? styles.statDanger : ''}`}
                    >
                      {isDone ? failed : failed > 0 ? failed : '—'}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>ASSETS CREATED</span>
                    <span className={styles.statValue}>
                      {isDone ? assetsCreated : '—'}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>PORTS CREATED</span>
                    <span className={styles.statValue}>
                      {isDone ? portsCreated : '—'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Normal Form */
              <div className={styles.formContainer}>
                <div className={styles.inputStack}>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="ipRange" className={styles.fieldLabel}>
                      Target IP Range
                    </Label>
                    <div className={styles.inputWrapper}>
                      <Globe className={styles.inputIcon} />
                      <Input
                        id="ipRange"
                        placeholder="192.168.1.0/24"
                        value={ipRange}
                        onChange={(e) => setIpRange(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handleStartClick()
                        }
                        className={styles.textInput}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <Label className={styles.fieldLabel}>
                      Scan Configuration
                    </Label>
                    <Select
                      value={scanType}
                      onValueChange={(v) =>
                        setScanType(v as 'standard' | 'comprehensive')
                      }
                    >
                      <SelectTrigger className={styles.selectTrigger}>
                        <SelectValue placeholder="Select scan type" />
                      </SelectTrigger>
                      <SelectContent className={styles.selectContent}>
                        <SelectItem
                          value="standard"
                          className={styles.selectItem}
                        >
                          <div className={styles.itemContent}>
                            <Activity
                              className={`${styles.itemIcon} ${styles.iconStandard}`}
                            />
                            <span>Standard Discovery</span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="comprehensive"
                          className={styles.selectItem}
                        >
                          <div className={styles.itemContent}>
                            <Shield
                              className={`${styles.itemIcon} ${styles.iconComprehensive}`}
                            />
                            <span>Deep Network Audit</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className={styles.helperText}>
                      <AlertTriangle className={styles.warningIcon} />
                      {scanType === 'standard'
                        ? 'Quick network scanning.'
                        : 'Intensive network scanning. Expect higher latency.'}
                    </p>
                  </div>

                  <div className={styles.fieldGroup}>
                    <Label className={styles.fieldLabel}>
                      Compliance Frameworks
                    </Label>
                    <div className={styles.frameworksContainer}>
                      {FRAMEWORK_OPTIONS.map(({ id, label }) => (
                        <div key={id} className={styles.frameworkCheckbox}>
                          <input
                            type="checkbox"
                            id={`framework-${id}`}
                            checked={selectedFrameworks.includes(label)}
                            onChange={() => toggleFramework(label)}
                            className={styles.checkboxInput}
                          />
                          <label
                            htmlFor={`framework-${id}`}
                            className={styles.checkboxLabel}
                          >
                            <span>{label}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className={styles.helperText}>
                      <AlertTriangle className={styles.warningIcon} />
                      Select one or more frameworks to validate against
                      compliance standards.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions Footer */}
            <div className={styles.actionsFooter}>
              {isActive ? (
                <Button
                  onClick={() => onCancel()}
                  disabled={isCancelling}
                  variant="destructive"
                  className={styles.abortButton}
                >
                  {isCancelling ? (
                    'ABORTING OPERATION...'
                  ) : (
                    <>
                      <XSquare className="w-4 h-4 mr-2" /> ABORT SEQUENCE
                    </>
                  )}
                </Button>
              ) : isDone ? (
                <>
                  <Button
                    onClick={() => dispatch(scanReset())}
                    className={styles.executeButton}
                  >
                    <Play className="w-4 h-4 mr-2" /> NEW SCAN
                  </Button>
                  {status === 'completed' && (
                    <Button
                      onClick={() => {
                        onClose();
                        navigate(`/dashboard`);
                      }}
                      className={styles.executeButton}
                      style={{ backgroundColor: '#10b981', borderColor: '#059669', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" /> VIEW RESULTS
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    onClick={handleStartClick}
                    disabled={isCreating}
                    className={styles.executeButton}
                  >
                    {isCreating ? (
                      'INITIALIZING...'
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" /> EXECUTE SCAN
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Visualization */}
          <div className={styles.visualizationColumn}>
            <div className={styles.gridPattern} />
            <div className={styles.vizContent}>
              <RadarScanner progress={progress} isActive={isScanning} />

              {status !== 'idle' && (
                <div className={styles.statusContainer}>
                  <div className={styles.statusHeader}>
                    <span className={styles.statusLabel}>Status</span>
                    <span className={`${styles.statusValue} ${statusClass}`}>
                      {displayStatus}
                    </span>
                  </div>

                  <div className={styles.sessionIdBox}>
                    <div className={styles.sessionLabelHeader}>
                      <span>Network Discovery Pipeline</span>
                      <span className={styles.progressPct}>
                        {status === 'completed' ? '100%' : isScanning ? `${progress}%` : '0%'}
                      </span>
                    </div>
                    <div className={styles.progressBarContainer}>
                      <div
                        className={styles.progressBar}
                        style={{ width: `${status === 'completed' ? 100 : isScanning ? progress : 0}%` }}
                      />
                    </div>
                    <div className={styles.sessionIdValue}>
                      {status === 'completed' ? 'SCANNING COMPLETE' : isScanning ? 'SCANNING ACTIVE' : 'WAITING_FOR_INIT...'}
                    </div>
                  </div>

                  <div className={styles.sessionIdBox}>
                    <div className={styles.sessionLabelHeader}>
                      <span>Risk Analysis Pipeline</span>
                      <span className={styles.progressPct}>
                        {status === 'completed' ? '100%' : (riskAssessmentId || riskProgress > 0) ? `${riskProgress}%` : '0%'}
                      </span>
                    </div>
                    <div className={styles.progressBarContainer}>
                      <div
                        className={styles.progressBar}
                        style={{ width: `${status === 'completed' ? 100 : (riskAssessmentId || riskProgress > 0) ? riskProgress : 0}%` }}
                      />
                    </div>
                    <div className={styles.sessionIdValue}>
                      {status === 'completed' ? 'ANALYSIS COMPLETE' : (riskAssessmentId || riskProgress > 0) ? 'ANALYSIS ACTIVE' : 'PENDING_DISCOVERY...'}
                    </div>
                  </div>

                  <div className={styles.sessionIdBox}>
                    <div className={styles.sessionLabelHeader}>
                      <span>Compliance Validation Pipeline</span>
                      <span className={styles.progressPct}>
                        {status === 'completed' ? '100%' : (complianceId || complianceProgress > 0) ? `${complianceProgress}%` : '0%'}
                      </span>
                    </div>
                    <div className={styles.progressBarContainer}>
                      <div
                        className={styles.progressBar}
                        style={{ width: `${status === 'completed' ? 100 : (complianceId || complianceProgress > 0) ? complianceProgress : 0}%` }}
                      />
                    </div>
                    <div className={styles.sessionIdValue}>
                      {status === 'completed' ? 'VALIDATION COMPLETE' : (complianceId || complianceProgress > 0) ? 'VALIDATION ACTIVE' : 'PENDING_RISK_ANALYSIS...'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
