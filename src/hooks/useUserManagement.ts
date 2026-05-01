import { useCallback, useState } from 'react';
import {
  useGetUsersQuery,
  useRegisterMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '@/apis';
import { useErrorHandler } from '@/hooks';
import type { CreateUserRequest, UpdateUserRequest, User } from '@/types/auth';

export default function useUserManagement(params?: { search?: string; is_active?: boolean }) {
  const { handleAsyncError } = useErrorHandler({ showToast: true });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // 1. Fetch Users
  const {
    data: users = [],
    isLoading,
    isError,
    error: fetchError,
    refetch,
  } = useGetUsersQuery(params);

  // 2. Mutations
  const [createUserMutation, { isLoading: isCreating }] = useRegisterMutation();
  const [updateUserMutation, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUserMutation, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Modal handlers
  const openCreateModal = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false);
  }, []);

  const openEditModal = useCallback((user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
    setSelectedUser(null);
  }, []);

  const openDeleteModal = useCallback((userId: string) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  }, []);

  const handleCreateUser = useCallback(
    async (data: CreateUserRequest | UpdateUserRequest) => {
      const ok = await handleAsyncError(async () => {
        await createUserMutation(data as CreateUserRequest).unwrap();
        return true;
      }, 'Failed to create user');
      if (ok) closeCreateModal();
      return ok;
    },
    [createUserMutation, handleAsyncError, closeCreateModal]
  );

  const handleEditUser = useCallback(
    async (data: CreateUserRequest | UpdateUserRequest) => {
      if (!selectedUser) return false;
      const ok = await handleAsyncError(async () => {
        await updateUserMutation({
          id: selectedUser.id,
          data: data as UpdateUserRequest,
        }).unwrap();
        return true;
      }, 'Failed to update user');
      if (ok) closeEditModal();
      return ok;
    },
    [selectedUser, updateUserMutation, handleAsyncError, closeEditModal]
  );

  const handleDeleteUser = useCallback(async () => {
    if (!userToDelete) return false;
    const ok = await handleAsyncError(async () => {
      await deleteUserMutation(userToDelete).unwrap();
      return true;
    }, 'Failed to delete user');
    if (ok) closeDeleteModal();
    return ok;
  }, [userToDelete, deleteUserMutation, handleAsyncError, closeDeleteModal]);

  return {
    users,
    isLoading: isLoading || isCreating || isUpdating || isDeleting,
    isError,
    error: fetchError ? 'Failed to synchronize user list' : null,
    pagination: {
      page: 1,
      pageSize: users.length,
      total: users.length,
      totalPages: 1,
    },
    fetchUsers: refetch,
    clearError: () => {},
    showCreateModal,
    showEditModal,
    selectedUser,
    showDeleteModal,
    userToDelete,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
  };
}
