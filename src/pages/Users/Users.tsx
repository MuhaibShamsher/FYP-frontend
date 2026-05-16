import { useState, type ComponentType } from 'react';
import { useSelector } from 'react-redux';
import { useUserManagement } from '@/hooks';
import { UserForm, DeleteUserModal } from '@/components/modal';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import { LoadingState, ErrorState, SearchFilterBar } from '@/components/custom';
import {
  getRoleLabel,
  roleBadgeVariant,
  canAccessUsers,
} from '@/utils/rbac';
import { formatDateTime } from '@/utils/formatUtils';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import type { RootState } from '@/store';
import styles from './Users.module.css';

const DateCell = ({ value }: { value: string | null | undefined }) => (
  <td className={styles.cellLogin}>{formatDateTime(value ?? null)}</td>
);

const ActionButton = ({
  title,
  onClick,
  icon: Icon,
  variant,
}: {
  title: string;
  onClick: () => void;
  icon: ComponentType<{ className?: string }>;
  variant: 'edit' | 'delete';
}) => (
  <button
    title={title}
    onClick={onClick}
    className={`${styles.iconButton} ${variant === 'edit' ? styles.editButton : styles.deleteButton}`}
  >
    <Icon className="h-3.5 w-3.5" />
  </button>
);

export default function UsersPage() {
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(
    undefined
  );

  const {
    users,
    isLoading,
    isError,
    error,
    showCreateModal,
    showEditModal,
    selectedUser,
    showDeleteModal,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
  } = useUserManagement({
    search: searchTerm || undefined,
    is_active: statusFilter,
  });

  if (isLoading && users.length === 0) {
    return <LoadingState text="LOADING USERS..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="ERROR LOADING USER DATA"
        message={error || 'Unable to retrieve user management data.'}
      />
    );
  }

  if (!canAccessUsers(userRole)) {
    return (
      <ErrorState
        title="ACCESS DENIED"
        message="Only Admin users can access user management."
      />
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerSection}>
        <div>
          <div className={styles.headerLabel}>
            <div className={styles.statusDotActive}></div>
            USER DIRECTORY & ACCESS CONTROL
          </div>
          <h1 className={styles.pageTitle}>User Management</h1>
        </div>
        <div className={styles.headerControls}>
          <SearchFilterBar
            searchPlaceholder="Search by name or email..."
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            filters={[
              {
                value:
                  statusFilter === undefined ? 'all' : statusFilter.toString(),
                onValueChange: (val) =>
                  setStatusFilter(val === 'all' ? undefined : val === 'true'),
                placeholder: 'Status Filter',
                options: [
                  { value: 'all', label: 'All Statuses' },
                  { value: 'true', label: 'Active Only' },
                  { value: 'false', label: 'Inactive Only' },
                ],
              },
            ]}
          />
          <Button onClick={openCreateModal} className={styles.createUserButton}>
            <Plus className="mr-2 h-4 w-4" />
            CREATE USER
          </Button>
        </div>
      </div>

      <Card className={styles.usersCard}>
        <CardContent className={styles.cardContent}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.tableHeaderCell}>USER</th>
                  <th className={styles.tableHeaderCell}>ROLE</th>
                  <th className={styles.tableHeaderCell}>STATUS</th>
                  <th className={styles.tableHeaderCell}>LAST LOGIN</th>
                  <th className={styles.tableHeaderCell}>CREATED</th>
                  <th className={styles.tableHeaderCell}>UPDATED</th>
                  <th className={styles.tableHeaderCell}>ACTIONS</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyState}>
                      NO USERS
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const isActive = u.is_active;
                    return (
                      <tr key={u.id} className={styles.tableRow}>
                        <td className={styles.cellUser}>
                          <div className={styles.userInfo}>
                            <div className={styles.userAvatar}>
                              {u.name?.charAt(0)?.toUpperCase() ?? '?'}
                            </div>
                            <div className={styles.userDetails}>
                              <span className={styles.userName}>
                                {u.name ?? '—'}
                              </span>
                              <span className={styles.userEmail}>
                                {u.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className={styles.cellRole}>
                          <Badge
                            variant={roleBadgeVariant(u.role)}
                            className={styles.roleBadge}
                          >
                            {getRoleLabel(u.role)}
                          </Badge>
                        </td>
                        <td className={styles.cellStatus}>
                          <button
                            className={`${styles.statusToggle} ${isActive ? styles.statusActive : styles.statusInactive}`}
                          >
                            {isActive ? (
                              <ToggleRight className="h-5 w-5" />
                            ) : (
                              <ToggleLeft className="h-5 w-5" />
                            )}
                            {isActive ? 'ACTIVE' : 'INACTIVE'}
                          </button>
                        </td>
                        <DateCell value={u.last_login} />
                        <DateCell value={u.created_at} />
                        <DateCell value={u.updated_at} />
                        <td className={styles.cellActions}>
                          <div className={styles.actionButtons}>
                            <ActionButton
                              title="Edit User"
                              onClick={() => openEditModal(u)}
                              icon={Edit2}
                              variant="edit"
                            />
                            <ActionButton
                              title="Delete User"
                              onClick={() => openDeleteModal(u.id)}
                              icon={Trash2}
                              variant="delete"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <UserForm
        open={showCreateModal}
        onOpenChange={closeCreateModal}
        onSubmit={handleCreateUser}
        mode="create"
      />

      {selectedUser && (
        <UserForm
          open={showEditModal}
          onOpenChange={closeEditModal}
          user={selectedUser}
          onSubmit={handleEditUser}
          mode="edit"
        />
      )}

      <DeleteUserModal
        open={showDeleteModal}
        onOpenChange={closeDeleteModal}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}
