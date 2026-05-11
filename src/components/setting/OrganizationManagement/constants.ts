import {
  Building2,
  CalendarDays,
  Globe,
  MapPin,
  Mail,
  Phone,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import type { OrganizationLike } from './types';

export const ORGANIZATION_SUMMARY_FIELDS = [
  {
    key: 'organization',
    label: 'Organization',
    icon: Building2,
    value: (organization: OrganizationLike) => organization.org_name,
  },
  {
    key: 'status',
    label: 'Status',
    icon: ShieldCheck,
    value: (organization: OrganizationLike) =>
      organization.is_active ? 'Active' : 'Inactive',
  },
  {
    key: 'updated',
    label: 'Updated',
    icon: CalendarDays,
    value: (organization: OrganizationLike) =>
      new Date(organization.updated_at).toLocaleDateString(),
  },
] as const;

export const ORGANIZATION_DETAILS_FIELDS = [
  {
    key: 'city',
    label: 'City',
    icon: MapPin,
    field: 'city',
    kind: 'input',
  },
  {
    key: 'branch_address',
    label: 'Branch Address',
    icon: MapPin,
    field: 'branch_address',
    kind: 'input',
  },
  {
    key: 'contact_email',
    label: 'Contact Email',
    icon: Mail,
    field: 'contact_email',
    kind: 'input',
  },
  {
    key: 'contact_phone',
    label: 'Contact Phone',
    icon: Phone,
    field: 'contact_phone',
    kind: 'input',
  },
  {
    key: 'website_url',
    label: 'Website URL',
    icon: Globe,
    field: 'website_url',
    kind: 'input',
  },
  {
    key: 'description',
    label: 'Description',
    icon: FileText,
    field: 'description',
    kind: 'textarea',
  },
] as const;
