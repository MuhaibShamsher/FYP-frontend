import type { UserRole } from '@/types/auth';

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

export const USER_ROLES: UserRole[] = [
  'admin',
  'risk_analyzer',
  'risk_monitor',
];

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  admin: 'Admin',
  risk_analyzer: 'Risk Analyzer',
  risk_monitor: 'Risk Monitor',
};

const ROLE_BADGE_VARIANTS: Record<UserRole, BadgeVariant> = {
  admin: 'default',
  risk_analyzer: 'secondary',
  risk_monitor: 'outline',
};

const ANALYZER_PERMISSIONS = new Set([
  'create_assessment',
  'cancel_assessment',
  'delete_assessment',
]);
const READ_ONLY_PERMISSIONS = new Set(['read_assessment', 'read_assets']);

export function normalizeUserRole(
  role: string | null | undefined
): UserRole | null {
  if (!role) return null;

  const normalized = role.trim().toLowerCase().replace(/\s+/g, '_');
  if (normalized === 'admin') return 'admin';
  if (normalized === 'risk_analyzer') return 'risk_analyzer';
  if (normalized === 'risk_monitor') return 'risk_monitor';

  return null;
}

export function roleBadgeVariant(
  role: string | null | undefined
): BadgeVariant {
  const normalized = normalizeUserRole(role);
  if (!normalized) return 'destructive';
  return ROLE_BADGE_VARIANTS[normalized];
}

export function canAccessUsers(role: string | null | undefined): boolean {
  return normalizeUserRole(role) === 'admin';
}

export function hasPermission(
  role: string | null | undefined,
  permission:
    | 'manage_users'
    | 'create_assessment'
    | 'cancel_assessment'
    | 'delete_assessment'
    | 'read_assessment'
    | 'read_assets'
): boolean {
  const normalized = normalizeUserRole(role);
  if (!normalized) return false;

  if (normalized === 'admin') return true;
  if (permission === 'manage_users') return false;
  if (READ_ONLY_PERMISSIONS.has(permission)) return true;
  if (normalized === 'risk_analyzer' && ANALYZER_PERMISSIONS.has(permission))
    return true;

  return false;
}

export function hasAnyRole(
  role: string | null | undefined,
  allowedRoles: readonly UserRole[]
): boolean {
  const normalized = normalizeUserRole(role);
  return normalized ? allowedRoles.includes(normalized) : false;
}

export function getRoleLabel(role: string | null | undefined): string {
  const normalized = normalizeUserRole(role);
  return normalized ? ROLE_DISPLAY_NAMES[normalized] : 'Unknown Role';
}
