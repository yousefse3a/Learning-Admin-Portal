import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { formatDatType } from "@/components/shared/date-format/date-format";
import Images from "@/assets/images/Images";

interface StudentCardProps {
  selectedStudent: any;
  openDeleteModal: (studentId: string, studentName: string) => void;
  onEditClick: () => void; // New prop to handle edit click
}

const StudentCard = ({
  selectedStudent,
  openDeleteModal,
  onEditClick, // Destructured here
}: StudentCardProps) => {
  if (!selectedStudent) {
    return <p>Select a student to see details.</p>;
  }

  return (
    <div className="student_card mt-6 box_shadow">
      {/* Student Card Header */}
      <div className="flex gap-8 items-center justify-center relative mb-6">
        <p className="text-base text-center font-semibold capitalize pe-8">
          {selectedStudent.StudentName}
        </p>
        {/* Edit Icon - Clicking on it will trigger the edit mode */}
        <div
          className="cursor-pointer absolute end-0"
          onClick={onEditClick} // Calls the onEditClick function when clicked
        >
          <img src={Images.edit_icon} alt="edit" />
        </div>
      </div>

      {/* Student Details */}
      <div className="box_shadow px-4 py-2 rounded-[5px] text-sm mb-3">
        <span className="text-[#523397] text-[13px] font-semibold">
          Student Code :
        </span>{" "}
        #{selectedStudent?.StudentCode || "N/A"}
      </div>
      <div className="box_shadow px-4 py-2 rounded-[5px] text-sm mb-3">
        <span className="text-[#523397] text-[13px] font-semibold">
          Full Name :
        </span>{" "}
        {selectedStudent?.StudentName || "N/A"}
      </div>
      <div className="box_shadow px-4 py-2 rounded-[5px] text-sm mb-3">
        <span className="text-[#523397] text-[13px] font-semibold">
          Nationality :
        </span>{" "}
        {selectedStudent?.NationalityName || "N/A"}
      </div>
      <div className="box_shadow px-4 py-2 rounded-[5px] text-sm mb-3">
        <span className="text-[#523397] text-[13px] font-semibold">
          Class Name :
        </span>{" "}
        {selectedStudent?.ClassName || "N/A"}
      </div>
      <div className="box_shadow px-4 py-2 rounded-[5px] text-sm mb-3">
        <span className="text-[#523397] text-[13px] font-semibold">
          Birth of Date :
        </span>{" "}
        {formatDatType(selectedStudent?.BirthDate || "N/A")}
      </div>
      <div className="box_shadow px-4 py-2 rounded-[5px] text-sm mb-3">
        <span className="text-[#523397] text-[13px] font-semibold">
          Grade :
        </span>{" "}
        {selectedStudent?.GradeName || "N/A"}
      </div>
      <div className="box_shadow px-4 py-2 rounded-[5px] text-sm mb-3">
        <span className="text-[#523397] text-[13px] font-semibold">
          Is Non-Arab :
        </span>{" "}
        {selectedStudent?.NonArab || "N/A"}
      </div>
      <div className="box_shadow px-4 py-2 rounded-[5px] text-sm mb-3">
        <span className="text-[#523397] text-[13px] font-semibold">
          Gender :
        </span>{" "}
        {selectedStudent?.GenderName || "N/A"}
      </div>
      <div className="box_shadow px-4 py-2 rounded-[5px] text-sm mb-3">
        <span className="text-[#523397] text-[13px] font-semibold">
          Is Citizen-Student :
        </span>{" "}
        {selectedStudent?.CitizenStudent || "N/A"}
      </div>
      <div className="box_shadow px-4 py-2 rounded-[5px] text-sm mb-3">
        <span className="text-[#523397] text-[13px] font-semibold">
          Is Sen-Student :
        </span>{" "}
        {selectedStudent?.SenStudent || "N/A"}
      </div>

      {/* Delete Button */}
      <div className="w-full flex justify-end">
        <Button
          onClick={
            () =>
              openDeleteModal(selectedStudent.Id, selectedStudent.StudentName) // Open modal with student info
          }
          className="mt-4 bg-[#FA053D] text-[#fff]"
        >
          <Trash className="mr-2 w-4" />
          Delete Student File
        </Button>
      </div>
    </div>
  );
};

export default StudentCard;
