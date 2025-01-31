import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RegisterForm } from "@/components/register-form"; // Import the RegisterForm

interface AddEditAdminModalProps {
  isEdit?: boolean; // true if editing, false if adding
  adminData?: any; // The data of the admin being edited (optional)
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose?: () => void; // Callback to close the modal
}

export function AddEditAdminModal({
  isEdit = false,
  adminData = null,
  onClose,
  open,
  setOpen,
}: AddEditAdminModalProps) {
  // Determine if we are in add or edit mode
  const modalTitle = isEdit ? "Edit Admin" : "Add New Admin";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[70rem] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        <RegisterForm isEdit={isEdit} adminData={adminData} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
