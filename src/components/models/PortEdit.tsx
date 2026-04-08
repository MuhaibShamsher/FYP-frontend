import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Server, Box, Save } from 'lucide-react';
import type { Port } from '@/types';
import styles from './styles/PortEdit.module.css';

interface PortEditModalProps {
  selectedPort: Port | null;
  assetId: string;
  onClose: () => void;
  onSave: (portId: string, data: Partial<Port>) => void;
  isLoading: boolean;
  error: any;
}

export default function PortEditModal({
  selectedPort,
  assetId,
  onClose,
  onSave,
  isLoading,
  error,
}: PortEditModalProps) {
  const [service, setService] = useState(selectedPort?.service || '');
  const [version, setVersion] = useState(selectedPort?.version || '');
  const [product, setProduct] = useState(selectedPort?.product || '');

  useEffect(() => {
    if (selectedPort) {
      setService(selectedPort.service || '');
      setVersion(selectedPort.version || '');
      setProduct(selectedPort.product || '');
    }
  }, [selectedPort]);

  if (!selectedPort) return null;

  const handleSubmit = () => {
    onSave(selectedPort.id, {
      service: service,
      version,
      product,
    });
  };

  const getProtocolClass = (protocol: string) => {
    switch (protocol.toLowerCase()) {
      case 'tcp': return styles.protocolTcp;
      case 'udp': return styles.protocolUdp;
      default: return styles.protocolOther;
    }
  };

  return (
    <div className={styles.backdrop}>
      <Card className={styles.modalCard}>
        <CardHeader className={styles.header}>
          <div className={styles.headerContent}>
            <span className={styles.title}>
              PORT {selectedPort.port_number}
            </span>
            <span className={`${styles.protocolBadge} ${getProtocolClass(selectedPort.protocol)}`}>
              {selectedPort.protocol}
            </span>
          </div>
        </CardHeader>

        <CardContent className={styles.content}>
          <div className={styles.formStack}>
            {/* Service Input */}
            <div className={styles.inputGroup}>
              <Label htmlFor="service" className={styles.label}>Service Name</Label>
              <div className={styles.inputWrapper}>
                <Server className={styles.inputIcon} />
                <Input
                  id="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className={styles.input}
                  placeholder="e.g. http, ssh, ftp"
                />
              </div>
            </div>

            {/* Product Input */}
            <div className={styles.inputGroup}>
              <Label htmlFor="product" className={styles.label}>Product / Application</Label>
              <div className={styles.inputWrapper}>
                <Box className={styles.inputIcon} />
                <Input
                  id="product"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className={styles.input}
                  placeholder="e.g. Apache httpd, OpenSSH"
                />
              </div>
            </div>

            {/* Version Input */}
            <div className={styles.inputGroup}>
              <Label htmlFor="version" className={styles.label}>Version Detected</Label>
              <div className={styles.inputWrapper}>
                <AlertTriangle className={styles.inputIcon} />
                <Input
                  id="version"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className={`${styles.input} ${styles.inputMono}`}
                  placeholder="e.g. 2.4.41"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <AlertTriangle className={styles.errorIcon} />
              {error.data?.detail || 'Failed to update port configuration.'}
            </div>
          )}

          <div className={styles.footer}>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className={styles.cancelButton}
            >
              CANCEL
            </Button>
            <Button
              onClick={handleSubmit}
              className={styles.saveButton}
              disabled={isLoading}
            >
              {isLoading ? (
                'SAVING...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> SAVE CHANGES
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
