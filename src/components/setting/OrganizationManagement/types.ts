import type { Organization } from '@/types/auth';

export type OrganizationLike = Pick<
  Organization,
  | 'org_name'
  | 'is_active'
  | 'updated_at'
  | 'city'
  | 'branch_address'
  | 'contact_email'
  | 'contact_phone'
  | 'website_url'
  | 'description'
  | 'compliance_frameworks'
>;

export type OrganizationFormKey =
  | 'org_name'
  | 'city'
  | 'branch_address'
  | 'contact_email'
  | 'contact_phone'
  | 'website_url'
  | 'description';
