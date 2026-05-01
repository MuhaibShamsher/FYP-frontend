import React from 'react';
import {
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Button,
} from '@/components/ui';
import type { Port } from '@/types';
import { Activity, Edit2, Shield } from 'lucide-react';
import styles from './PortAnalytics.module.css';

interface PortAnalyticsProps {
  ports: Port[] | undefined;
  onPortEdit: (port: Port) => void;
}

const PortAnalytics: React.FC<PortAnalyticsProps> = ({ ports, onPortEdit }) => {
  const portTableHeaders = [
    'Port',
    'Protocol',
    'Service',
    'Version',
    'State',
    'Product',
    'Control',
  ];

  const portTableColumns = [
    { key: 'port_number', mono: true },
    { key: 'protocol' },
    { key: 'service', fallback: 'N/A' },
    { key: 'version', fallback: 'N/A' },
    { key: 'state' },
    { key: 'product', fallback: 'N/A' },
  ];

  return (
    <Card className={styles.tableCard}>
      <CardHeader className={styles.cardHeader}>
        <div className={styles.portHeaderRow}>
          <CardTitle className={styles.cardTitle}>
            <Activity className={styles.titleIcon} />
            PORT ANALYTICS
          </CardTitle>
          <div className={styles.portCount}>
            {ports?.length || 0} PORTS DETECTED
          </div>
        </div>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        {ports && ports.length > 0 ? (
          <div className={styles.portTableContainer}>
            <Table className={styles.portTable}>
              <TableHeader>
                <TableRow>
                  {portTableHeaders.map((header) => (
                    <TableHead key={header} className={styles.portTableHeader}>
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {ports.map((port: Port) => (
                  <TableRow key={port.id} className={styles.portTableRow}>
                    {portTableColumns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={`${styles.portTableCell} ${col.mono ? styles.portTableCellMono : ''}`}
                      >
                        {(port as any)[col.key] || (
                          <span className={styles.portTableCellFallback}>
                            {col.fallback}
                          </span>
                        )}
                      </TableCell>
                    ))}
                    <TableCell className={styles.portTableCell}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={styles.portEditButton}
                        onClick={() => onPortEdit(port)}
                      >
                        <Edit2 className={styles.portEditIcon} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className={styles.portEmptyState}>
            <Shield className={styles.portEmptyIcon} />
            <p className={styles.portEmptyText}>No open ports detected</p>
            <p className={styles.portEmptySubtext}>
              Run a deep scan to verify connectivity
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortAnalytics;
