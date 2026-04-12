import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import type { ComplianceResultStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ComplianceStatusBadgeProps {
  status: ComplianceResultStatus;
  className?: string;
}

export function ComplianceStatusBadge({
  status,
  className,
}: ComplianceStatusBadgeProps) {
  const getStatusVariant = (status: ComplianceResultStatus) => {
    switch (status) {
      case 'pass':
        return 'default';
      case 'fail':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

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

  const getStatusText = (status: ComplianceResultStatus) => {
    switch (status) {
      case 'pass':
        return 'PASS';
      case 'fail':
        return 'FAIL';
      case 'partial':
        return 'PARTIAL';
      case 'needs_review':
        return 'NEEDS REVIEW';
      case 'not_applicable':
        return 'NOT APPLICABLE';
      default:
        return String(status).replace(/_/g, ' ').toUpperCase();
    }
  };

  return (
    <Badge
      variant={getStatusVariant(status)}
      className={cn('gap-1', className)}
    >
      {getStatusIcon(status)}
      {getStatusText(status)}
    </Badge>
  );
}
