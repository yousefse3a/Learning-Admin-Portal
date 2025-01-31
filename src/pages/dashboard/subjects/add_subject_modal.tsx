/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming a UI Checkbox component exists

// Validation schema
const SubjectSchema = z.object({
  NameAr: z
    .string()
    .min(1, "Arabic Name is required")
    .min(3, "Arabic Name must be at least 3 characters")
    .max(250, "Arabic Name cannot exceed 250 characters"),
  NameEn: z
    .string()
    .min(1, "English Name is required")
    .min(3, "English Name must be at least 3 characters")
    .max(250, "English Name cannot exceed 250 characters"),
  IsActive: z.boolean(),
});

interface AddEditSubjectModalProps {
  isEdit?: boolean;
  subjectData?: any;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
}

export function AddEditSubjectModal({
  isEdit = false,
  subjectData = null,
  open,
  setOpen,
  onSubmit,
}: AddEditSubjectModalProps) {
  const form = useForm({
    resolver: zodResolver(SubjectSchema),
    defaultValues: {
      NameAr: subjectData?.NameAr || "",
      NameEn: subjectData?.NameEn || "",
      IsActive: subjectData?.IsActive || false,
    },
  });

  const handleSubmit = async (data: any) => {
    await onSubmit(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[70rem]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Subject" : "Add New Subject"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <label>Arabic Name</label>
            <Input
              {...form.register("NameAr")}
              placeholder="Enter Arabic Name"
            />
            {form.formState.errors.NameAr && (
              <p className="text-red-500">
                {form.formState.errors.NameAr.message?.toString()}
              </p>
            )}
          </div>
          <div>
            <label>English Name</label>
            <Input
              {...form.register("NameEn")}
              placeholder="Enter English Name"
            />
            {form.formState.errors.NameEn && (
              <p className="text-red-500">
                {form.formState.errors.NameEn.message?.toString()}
              </p>
            )}
          </div>
          <div>
            <label>Active Status</label>
            <Controller
              name="IsActive"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value} // Use `field.value` for controlled behavior
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    } // Convert to boolean
                  />
                  <label className="font-medium">Is Active</label>
                </div>
              )}
            />
          </div>
          <Button type="submit">
            {isEdit ? "Update Subject" : "Add Subject"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
