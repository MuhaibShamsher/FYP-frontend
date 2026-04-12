import { Fragment } from 'react';
import { isRecord } from '@/utils/guards';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getSeverityVariant,
  formatVulnType,
  type Asset,
  type Finding,
} from './utils/helpers';
import {
  DEFAULT_TEXT,
  TABLE_COL_SPANS,
  TABLE_HEADERS,
} from './utils/constants';
import styles from './styles/ComplianceEvidence.module.css';

export default function ComplianceAffectedAssetsTable({ assets }: { assets: unknown[] }) {
  if (!assets || assets.length === 0) {
    return (
      <div className={styles.evidenceRow}>
        <div className={styles.evidenceLabel}>Affected assets</div>
        <div className={styles.scrollX}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={TABLE_COL_SPANS.ASSET_GROUP}
                  className={styles.findingsEmptyRow}
                >
                  {DEFAULT_TEXT.NO_AFFECTED_ASSETS}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.evidenceRow}>
      <div className={styles.evidenceLabel}>Affected assets</div>
      <div className={styles.scrollX}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={styles.findingsColPort}>
                {TABLE_HEADERS.PORT}
              </TableHead>
              <TableHead className={styles.findingsColService}>
                {TABLE_HEADERS.SERVICE}
              </TableHead>
              <TableHead className={styles.findingsColSeverity}>
                {TABLE_HEADERS.SEVERITY}
              </TableHead>
              <TableHead className={styles.findingsColType}>
                {TABLE_HEADERS.TYPE}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset, assetIndex) => {
              const assetRecord = isRecord(asset) ? (asset as Asset) : {};
              const findings = Array.isArray(assetRecord.findings)
                ? (assetRecord.findings as Finding[])
                : [];

              const hostname =
                assetRecord.hostname || DEFAULT_TEXT.UNKNOWN_HOST;
              const ip = assetRecord.ip_address || '';
              const osName = assetRecord.os_name || null;
              const deviceType = assetRecord.device_type || null;
              const meta =
                [osName, deviceType].filter(Boolean).join(' · ') || null;

              return (
                <Fragment key={`asset-${assetIndex}`}>
                  <TableRow className={styles.assetGroupRow}>
                    <TableCell
                      colSpan={TABLE_COL_SPANS.ASSET_GROUP}
                      className={styles.assetGroupCell}
                    >
                      <div className={styles.assetGroupInner}>
                        <span className={styles.assetHostname}>{hostname}</span>
                        {ip && (
                          <span className={styles.assetIpBadge}>{ip}</span>
                        )}
                        {meta && (
                          <span className={styles.assetMetaInline}>{meta}</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  {findings.length > 0 ? (
                    findings.map((finding, findingIndex) => {
                      const findingRecord = isRecord(finding)
                        ? (finding as Finding)
                        : {};
                      const vulnType = formatVulnType(findingRecord.vuln_type);
                      const severity = findingRecord.severity;

                      return (
                        <TableRow
                          key={`${assetIndex}-f-${findingIndex}`}
                          className={styles.findingRow}
                        >
                          <TableCell
                            className={`${styles.mono} ${styles.findingsColPort}`}
                          >
                            {findingRecord.port ?? DEFAULT_TEXT.NO_DATA}
                          </TableCell>
                          <TableCell className={styles.findingsColService}>
                            {findingRecord.service || DEFAULT_TEXT.NO_DATA}
                          </TableCell>
                          <TableCell className={styles.findingsColSeverity}>
                            <Badge variant={getSeverityVariant(severity)}>
                              {severity || DEFAULT_TEXT.NO_DATA}
                            </Badge>
                          </TableCell>
                          <TableCell
                            className={`${styles.findingsColType} ${styles.vulnType}`}
                          >
                            {vulnType}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow key={`${assetIndex}-empty`}>
                      <TableCell
                        colSpan={TABLE_COL_SPANS.EMPTY_ROW}
                        className={styles.findingsEmptyRow}
                      >
                        {DEFAULT_TEXT.NO_FINDINGS}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
