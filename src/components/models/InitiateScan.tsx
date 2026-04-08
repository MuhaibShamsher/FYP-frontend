import type { RootState } from '@/store';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { scanReset } from '@/store/slices/scanSessionSlice';
import { RadarScanner } from '@/components/custom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Globe,
  Shield,
  Play,
  XSquare,
  Activity,
  AlertTriangle,
  ScanLine,
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import styles from './styles/InitiateScan.module.css';

const CIDR_RE = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStart: (
    ip_range: string,
    scan_type: 'standard' | 'comprehensive'
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
  const {
    scanId,
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

  const [ipRange, setIpRange] = useState<string>('');
  const [scanType, setScanType] = useState<'standard' | 'comprehensive'>('standard');

  useEffect(() => {
    if (!isOpen) {
      setIpRange('');
      setScanType('standard');
    }
  }, [isOpen]);

  const handleStartClick = async () => {
    if (isCreating) return;
    const trimmed = ipRange.trim();
    if (!trimmed) {
      toast.error('Please enter a target IP range.');
      return;
    }
    if (!CIDR_RE.test(trimmed)) {
      toast.error('Invalid format. Use CIDR notation, e.g. 192.168.1.0/24.');
      return;
    }
    await onStart(trimmed, scanType);
  };

  const isActive = isScanning;
  const isDone =
    status === 'completed' || status === 'failed' || status === 'cancelled';

  const statusClass = isScanning
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
      // onOpenChange={(open) => {
      //   if (!open) {
      //     if (isActive) {
      //       toast.warning('Scan in progress. Use ABORT SEQUENCE to stop it.');
      //     } else {
      //       onClose();
      //     }
      //   }
      // }}
    >
      <DialogContent className={styles.modalContent}>
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

              <div className={styles.statusContainer}>
                <div className={styles.statusHeader}>
                  <span className={styles.statusLabel}>Status</span>
                  <span className={`${styles.statusValue} ${statusClass}`}>
                    {isScanning
                      ? 'SCANNING_ACTIVE'
                      : isDone
                        ? status.toUpperCase()
                        : 'SYSTEM_READY'}
                  </span>
                </div>

                <div className={styles.sessionIdBox}>
                  <div className={styles.sessionLabelHeader}>
                    <span>Session ID</span>
                  </div>
                  <div className={styles.sessionIdValue}>
                    {scanId || 'WAITING_FOR_INIT...'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
