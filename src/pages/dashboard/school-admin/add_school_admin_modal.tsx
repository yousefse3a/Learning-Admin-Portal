import { RegisterSchoolAdminForm } from "@/components/school-admin-register";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddEditSchoolAdminModalProps {
  isEdit?: boolean; // true if editing, false if adding
  adminData?: any; // The data of the admin being edited (optional)
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose?: () => void; // Callback to close the modal
}

export function AddEditSchoolAdminModal({
  isEdit = false,
  adminData = null,
  onClose,
  open,
  setOpen,
}: AddEditSchoolAdminModalProps) {
  // Determine if we are in add or edit mode
  const modalTitle = isEdit ? "Edit School Admin" : "Add New School Admin";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[70rem]">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        <RegisterSchoolAdminForm
          isEdit={isEdit}
          adminData={adminData}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
