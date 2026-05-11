import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  useGetOrganizationQuery,
  usePatchOrganizationMutation,
} from '@/apis/authApis';
import useErrorHandler from './useErrorHandler';
import type { RootState } from '@/store';
import type { Organization, UpdateOrganizationRequest } from '@/types/auth';
import { canManageOrganization } from '@/utils/rbac';
import type { FormEvent } from 'react';

interface OrganizationFormData {
  org_name: string;
  city: string;
  branch_address: string;
  contact_email: string;
  contact_phone: string;
  website_url: string;
  description: string;
}

interface UseOrganizationReturn {
  organization?: Organization;
  organizationForm: OrganizationFormData;
  canEditOrganization: boolean;
  isEditing: boolean;
  isLoadingOrganization: boolean;
  isSavingOrganization: boolean;
  isError: boolean;
  errorMessage: string | null;
  startEditing: () => void;
  cancelEditing: () => void;
  setField: (field: keyof OrganizationFormData, value: string) => void;
  saveOrganization: (e?: FormEvent) => Promise<void>;
  refetchOrganization: () => void;
}

const EMPTY_FORM: OrganizationFormData = {
  org_name: '',
  city: '',
  branch_address: '',
  contact_email: '',
  contact_phone: '',
  website_url: '',
  description: '',
};

function toFormData(organization?: Organization): OrganizationFormData {
  if (!organization) return EMPTY_FORM;

  return {
    org_name: organization.org_name || '',
    city: organization.city || '',
    branch_address: organization.branch_address || '',
    contact_email: organization.contact_email || '',
    contact_phone: organization.contact_phone || '',
    website_url: organization.website_url || '',
    description: organization.description || '',
  };
}

function toUpdatePayload(
  formData: OrganizationFormData
): UpdateOrganizationRequest {
  return {
    org_name: formData.org_name.trim(),
    city: formData.city.trim(),
    branch_address: formData.branch_address.trim(),
    contact_email: formData.contact_email.trim(),
    contact_phone: formData.contact_phone.trim(),
    website_url: formData.website_url.trim(),
    description: formData.description.trim(),
  };
}

export default function useOrganization(): UseOrganizationReturn {
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const canEditOrganization = canManageOrganization(userRole);

  const {
    data: organization,
    isLoading: isLoadingOrganization,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetOrganizationQuery();
  const [patchOrganization, { isLoading: isSavingOrganization }] =
    usePatchOrganizationMutation();

  const { handleAsyncError, handleError } = useErrorHandler({
    showToast: true,
    logToConsole: true,
  });

  const [organizationForm, setOrganizationForm] =
    useState<OrganizationFormData>(EMPTY_FORM);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setOrganizationForm(toFormData(organization));
  }, [organization]);

  const startEditing = useCallback(() => {
    if (!canEditOrganization) {
      handleError('Only administrators can edit organization information.');
      return;
    }

    setIsEditing(true);
  }, [canEditOrganization, handleError]);

  const cancelEditing = useCallback(() => {
    setOrganizationForm(toFormData(organization));
    setIsEditing(false);
  }, [organization]);

  const setField = useCallback(
    (field: keyof OrganizationFormData, value: string) => {
      setOrganizationForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const saveOrganization = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();

      if (!canEditOrganization) {
        handleError('Only administrators can edit organization information.');
        return;
      }

      await handleAsyncError(async () => {
        await patchOrganization(toUpdatePayload(organizationForm)).unwrap();
        setIsEditing(false);
      }, 'Failed to update organization information');
    },
    [
      canEditOrganization,
      handleAsyncError,
      handleError,
      organizationForm,
      patchOrganization,
    ]
  );

  const errorMessage = isError
    ? 'data' in (error as { data?: { message?: string } } | null | undefined)
      ? ((error as { data?: { message?: string } }).data?.message ?? null)
      : 'Unable to load organization details.'
    : null;

  return {
    organization,
    organizationForm,
    canEditOrganization,
    isEditing,
    isLoadingOrganization:
      isLoadingOrganization || (isFetching && !organization),
    isSavingOrganization,
    isError,
    errorMessage,
    startEditing,
    cancelEditing,
    setField,
    saveOrganization,
    refetchOrganization: refetch,
  };
}
