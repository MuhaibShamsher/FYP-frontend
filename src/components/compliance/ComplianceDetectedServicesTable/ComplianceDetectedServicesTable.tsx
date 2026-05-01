import { isRecord } from '@/utils/guards';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Card,
} from '@/components/ui';
import styles from './ComplianceDetectedServicesTable.module.css';

export default function ComplianceDetectedServicesTable({rows}: {rows: unknown[]}) {
  return (
    <div className={styles.evidenceRow}>
      <div className={styles.evidenceLabel}>Detected services</div>
      <Card className={styles.scrollX}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Host</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Port</TableHead>
              <TableHead>Service</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, idx) => {
              const r = isRecord(row) ? row : {};
              return (
                <TableRow key={idx}>
                  <TableCell className={styles.mono}>
                    {typeof r.hostname === 'string' ? r.hostname : '---'}
                  </TableCell>
                  <TableCell className={styles.mono}>
                    {typeof r.ip_address === 'string' ? r.ip_address : '---'}
                  </TableCell>
                  <TableCell className={styles.mono}>
                    {typeof r.port === 'number' ? r.port : '---'}
                  </TableCell>
                  <TableCell>
                    {typeof r.service === 'string' ? r.service : '---'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
