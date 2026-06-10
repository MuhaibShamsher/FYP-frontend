import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Label,
  Input,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import type {
  User,
  UserRole,
  CreateUserRequest,
  UpdateUserRequest,
} from '@/types/auth';
import styles from './UserForm.module.css';

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<any>;
  user?: User;
  mode: 'create' | 'edit';
}

function FieldGroup({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.fieldGroup}>
      <Label className={styles.fieldGroupLabel}>{label}</Label>
      {children}
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}

export default function UserForm({
  open,
  onOpenChange,
  onSubmit,
  user,
  mode,
}: UserFormProps) {
  const [formData, setFormData] = useState<
    CreateUserRequest | UpdateUserRequest
  >(() => {
    if (mode === 'create' || !user) {
      return {
        email: '',
        name: '',
        role: 'risk_monitor',
      };
    } else {
      return {
        name: user.name,
        role: user.role,
        is_active: user.is_active,
      };
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateUserRequest, string>>
  >({});

  const validate = () => {
    const e: Partial<Record<keyof CreateUserRequest, string>> = {};

    if (mode === 'create') {
      const createData = formData as CreateUserRequest;
      if (!createData.name?.trim()) e.name = 'Name is required';
      if (!createData.email?.trim()) e.email = 'Email is required';
    } else {
      const editData = formData as UpdateUserRequest;
      if (!editData.name?.trim()) e.name = 'Name is required';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isCreateMode = mode === 'create';
  const title = isCreateMode ? 'CREATE NEW USER' : 'EDIT USER';
  const submitText = isCreateMode ? 'CREATE USER' : 'SAVE CHANGES';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${styles.dialogContent} sm:max-w-md`}>
        <DialogHeader className={styles.header}>
          <DialogTitle className={styles.dialogTitle}>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className={styles.form}>
          <FieldGroup label="Full Name" error={errors.name}>
            <Input
              value={formData.name ?? ''}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter full name"
              className={styles.input}
            />
          </FieldGroup>

          {isCreateMode ? (
            <FieldGroup label="Email Address" error={errors.email}>
              <Input
                type="email"
                value={(formData as CreateUserRequest).email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email address"
                className={styles.input}
              />
            </FieldGroup>
          ) : (
            <FieldGroup label="Email (read-only)">
              <Input
                value={user?.email || ''}
                disabled
                className={styles.inputDisabled}
              />
            </FieldGroup>
          )}

          <FieldGroup label="Role">
            <Select
              value={formData.role}
              onValueChange={(val) =>
                setFormData({ ...formData, role: val as UserRole })
              }
            >
              <SelectTrigger className={styles.selectTrigger}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={styles.selectContent}>
                <SelectItem value="risk_monitor">Risk Monitor</SelectItem>
                <SelectItem value="risk_analyzer">Risk Analyzer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </FieldGroup>

          {!isCreateMode && (
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="is_active"
                checked={!!(formData as UpdateUserRequest).is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className={styles.checkbox}
              />
              <Label htmlFor="is_active" className={styles.checkboxLabel}>
                ACTIVE ACCOUNT
              </Label>
            </div>
          )}

          <DialogFooter className={styles.dialogFooter}>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'CREATING...' : 'SAVING...'}
                </>
              ) : (
                submitText
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
