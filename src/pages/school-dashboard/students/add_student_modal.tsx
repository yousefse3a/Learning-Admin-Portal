import { RegisterStudentForm } from "@/components/register_student_form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddEditStudentModalProps {
  isEdit?: boolean; // true if editing, false if adding
  studentData?: any; // The data of the student being edited (optional)
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose?: () => void; // Callback to close the modal
}

export function AddEditStudentModal({
  isEdit = false,
  studentData = null,
  onClose,
  open,
  setOpen,
}: AddEditStudentModalProps) {
  // Determine if we are in add or edit mode
  const modalTitle = isEdit ? "Edit Student" : "Add New Student";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[70rem] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-4rem)]">
          {/* Content inside the modal */}
          <RegisterStudentForm
            isEdit={isEdit}
            studentData={studentData}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
