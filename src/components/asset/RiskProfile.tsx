import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp,
  Shield,
  AlertTriangle,
  Server,
  Activity,
  Clock,
} from 'lucide-react';
import type { AssetRiskProfileDetail } from '@/types';
import styles from './styles/RiskProfile.module.css';

interface RiskProfileProps {
  riskProfile: AssetRiskProfileDetail;
  formatScore: (score?: number | null) => string;
}

const RiskProfile: React.FC<RiskProfileProps> = ({
  riskProfile,
  formatScore,
}) => {
  const riskProfileFields = [
    {
      label: 'Risk Score',
      key: 'risk_score',
      icon: TrendingUp,
      formatter: (value: any) => formatScore(value),
    },
    {
      label: 'Risk Level',
      key: 'risk_level',
      icon: Shield,
      formatter: (value: any) => (
        <span className={styles.riskBadge}>{value?.toUpperCase()}</span>
      ),
    },
    {
      label: 'Total Vulnerabilities',
      key: 'vulnerability_count',
      icon: AlertTriangle,
    },
    {
      label: 'Critical',
      key: 'critical_vuln_count',
      icon: Server,
    },
    {
      label: 'High',
      key: 'high_vuln_count',
      icon: Server,
    },
    {
      label: 'Medium',
      key: 'medium_vuln_count',
      icon: Server,
    },
    {
      label: 'Low',
      key: 'low_vuln_count',
      icon: Server,
    },
    {
      label: 'NVD Findings',
      key: 'nvd_findings_count',
      icon: Activity,
    },
    {
      label: 'Rule Findings',
      key: 'rule_findings_count',
      icon: Activity,
    },
    {
      label: 'Highest CVSS Score',
      key: 'highest_cvss_score',
      icon: Clock,
      formatter: (value: any) => formatScore(value),
    },
    {
      label: 'Highest EPSS Score',
      key: 'highest_epss_score',
      icon: Clock,
      formatter: (value: any) => formatScore(value),
    },
    {
      label: 'KEV Affected',
      key: 'is_kev_affected',
      icon: Clock,
      formatter: (value: any) => (value ? 'Yes' : 'No'),
    },
    {
      label: 'Last Updated',
      key: 'updated_at',
      icon: Clock,
      formatter: (value: any) => new Date(value).toLocaleString(),
    },
  ];

  return (
    <Card className={styles.riskProfileCard}>
      <CardHeader className={styles.cardHeader}>
        <CardTitle className={styles.cardTitle}>
          <TrendingUp className={styles.titleIcon} />
          RISK PROFILE
        </CardTitle>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        <div className={styles.infoList}>
          {riskProfileFields.map((field) => (
            <div key={field.key} className={styles.infoField}>
              <div className={styles.infoLabelBox}>
                <field.icon className={styles.fieldIcon} />
                <span className={styles.fieldLabelText}>{field.label}</span>
              </div>
              <div className={styles.fieldValue}>
                {field.formatter
                  ? field.formatter((riskProfile as any)[field.key])
                  : (riskProfile as any)[field.key] || (
                      <span className={styles.valuePlaceholder}>N/A</span>
                    )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskProfile;
