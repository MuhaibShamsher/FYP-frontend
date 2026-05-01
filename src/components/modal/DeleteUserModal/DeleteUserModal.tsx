import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
} from '@/components/ui';
import { Trash2 } from 'lucide-react';
import styles from './DeleteUserModal.module.css';

interface DeleteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function DeleteUserModal({
  open,
  onOpenChange,
  onConfirm,
}: DeleteUserModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${styles.dialogContent} sm:max-w-md`}>
        <DialogHeader>
          <DialogTitle className={styles.dialogTitle}>DELETE USER</DialogTitle>
        </DialogHeader>

        <div className={styles.content}>
          <div className={styles.iconContainer}>
            <div className={styles.iconWrapper}>
              <Trash2 className={styles.icon} />
            </div>
            <div>
              <h3 className={styles.confirmationTitle}>
                Confirm User Deletion
              </h3>
              <p className={styles.confirmationText}>
                This action cannot be undone. The user will be permanently
                removed from the system.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className={styles.dialogFooter}>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className={styles.cancelButton}
          >
            CANCEL
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className={styles.deleteButton}
          >
            DELETE USER
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
