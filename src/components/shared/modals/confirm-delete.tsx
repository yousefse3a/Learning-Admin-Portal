import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Images from "@/assets/images/Images";

interface ConfirmDeleteProps {
  isModalOpen: boolean;
  handleDelete: () => void;
  onClose: () => void;
  loading: boolean;
  deleteItem: string;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  isModalOpen,
  loading,
  onClose,
  handleDelete,
  deleteItem,
}) => {
  const handleModalClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => {
        handleModalClose();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 pb-4">
          <div className="flex justify-center">
            <img className="w-[80px]" src={Images.delete_icon} alt="pic" />
          </div>
          <h3 className="font-semibold text-center">Delete This Item?</h3>
          <p className="text-[#71717a] text-sm text-center">
            Are you sure you want to delete this
            <span className="font-semibold text-[#09090b] ps-2 pe-2">
              "{deleteItem}"
            </span>{" "}
            ?
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            loading={loading}
          >
            {/* {loading ? "Deleting..." : "Delete"} */}
            {loading ? (
              <>
                <img className="w-6 me-[6px]" src={Images.btn_spinner} alt="pic" />{" "}
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDelete;
