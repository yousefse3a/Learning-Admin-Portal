import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Images from "@/assets/images/Images";
import GradeSelect from "@/components/shared/grade-select/grade-select";
import LevelSelect from "@/components/shared/level-select/level-select";
import SchoolSelect from "@/components/shared/school-select/school-select";
import { UpdateStudent } from "@/api/services/student.services";
import { toast } from "react-toastify";

interface UpdateStudentCardProps {
  selectedStudent: any;
  onCancel: () => void; // Prop to handle canceling the edit
}

const UpdateStudentCard = ({
  selectedStudent,
  onCancel,
  fetchStudents,
}: UpdateStudentCardProps) => {
  const handleSaveChanges = () => {
    // Logic for saving the updated student data
    console.log("Saving updated student data...");
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    setValue,
    clearErrors,
    watch,
  } = useForm({
    mode: "onChange",
  });

  const gender = watch("Gender");

  const onSubmit = async (data) => {
    const studentData = {
      ...data,
      Password: selectedStudent.TextPass,  // Add the password field here
    };
    console.log(data);
    try {
      const response = await UpdateStudent(studentData);
      fetchStudents();
      toast.success("Student updated successfully!");
      console.log("Success:", response);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to enable submit button only if gender is selected
  const isSubmitEnabled = () => {
    return gender !== undefined && gender !== "";
  };

  useEffect(() => {
    if (selectedStudent?.StudentCode) {
      setValue("StudentCode", selectedStudent?.StudentCode);
      clearErrors("StudentCode");
    }
    if (selectedStudent?.StudentName) {
      setValue("StudentName", selectedStudent?.StudentName);
      clearErrors("StudentName");
    }
    if (selectedStudent?.LevelId) {
      setValue("LevelId", selectedStudent?.LevelId);
      clearErrors("LevelId");
    }
    if (selectedStudent?.GradeId) {
      setValue("GradeId", selectedStudent?.GradeId);
      clearErrors("GradeId");
    }
    if (selectedStudent?.SchoolId) {
      setValue("SchoolId", selectedStudent?.SchoolId);
      clearErrors("SchoolId");
    }
    if (selectedStudent?.Gender) {
      setValue("Gender", selectedStudent?.Gender);
      clearErrors("Gender");
    }
  }, [selectedStudent, setValue, clearErrors]);

  return (
    <div className="student_card mt-6 box_shadow">
      {/* Header for the Update Card */}
      <div className="flex gap-8 items-center justify-center relative mb-6">
        <p className="text-base text-center font-semibold capitalize pe-8">
          Edit {selectedStudent.StudentName}
        </p>
        <button className="absolute end-0" onClick={onCancel}>
          Cancel
        </button>
      </div>

      {/* Form Fields to Edit Student Info */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-4">
          {/* Student Code Field */}
          <div className="mb-3 col-span-12 md:col-span-6">
            <Label className="flex gap-1 items-baseline" htmlFor="StudentCode">
              Student Code
              <span>
                <img className="w-2" src={Images.red_asterisk_icon} alt="pic" />
              </span>
            </Label>
            <div className="mt-2">
              <Input
                id="StudentCode"
                placeholder="Student Code"
                {...register("StudentCode", {
                  required: "Student code is required",
                })}
              />
              {errors.StudentCode && (
                <p className="mt-1 text-[#ff3728] text-[14px] font-[300]">
                  {errors.StudentCode.message}
                </p>
              )}
            </div>
          </div>

          {/* User Name Field */}
          <div className="mb-3 col-span-12 md:col-span-6">
            <Label className="flex gap-1 items-baseline" htmlFor="StudentName">
              User Name
              <span>
                <img className="w-2" src={Images.red_asterisk_icon} alt="pic" />
              </span>
            </Label>
            <div className="mt-2">
              <Input
                id="StudentName"
                placeholder="User Name"
                {...register("StudentName", {
                  required: "Student name is required",
                })}
              />
              {errors.StudentName && (
                <p className="mt-1 text-[#ff3728] text-[14px] font-[300]">
                  {errors.StudentName.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Grades Field */}
          <div className="mb-3 col-span-12 md:col-span-6">
            <div className="">
              <GradeSelect
                name="GradeId"
                label="Grade"
                asterisk={true}
                defaultValue=""
                control={control}
                rules={{ required: "Grade is required" }}
                errors={errors}
              />
            </div>
          </div>

          {/* Level Field */}
          <div className="mb-3 col-span-12 md:col-span-6">
            <div className="">
              <LevelSelect
                name="LevelId"
                label="Level"
                asterisk={true}
                defaultValue=""
                control={control}
                rules={{ required: "Level is required" }}
                errors={errors}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* School Field */}
          <div className="mb-3 col-span-12 md:col-span-6">
            <div className="">
              <SchoolSelect
                name="SchoolId"
                label="School"
                asterisk={true}
                defaultValue=""
                control={control}
                rules={{ required: "School is required" }}
                errors={errors}
              />
            </div>
          </div>

          {/* Gender Field */}
          <div className="mb-3 col-span-12 md:col-span-6">
            <Label className="flex gap-1 items-baseline" htmlFor="Gender">
              Gender
              <span>
                <img className="w-2" src={Images.red_asterisk_icon} alt="pic" />
              </span>
            </Label>
            <div className="mt-2">
              <select
                id="Gender"
                className="w-full border rounded p-2 bg-white"
                {...register("Gender", {
                  required: "Gender is required",
                })}
              >
                <option value="">Select...</option>
                <option value="0">Male</option>
                <option value="1">Female</option>
              </select>
              {errors.Gender && (
                <p className="mt-1 text-[#ff3728] text-[14px] font-[300]">
                  {errors.Gender.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4"></div>

        {/* Submit Button */}
        <div className="flex justify-end items-center mt-6">
          <Button
            className="bg-[#523397] w-full"
            type="submit"
            disabled={!isSubmitEnabled() || isSubmitting} // Disabled until gender is selected
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>

      {/* Save Changes and Cancel buttons */}
      <div className="w-full flex justify-end">
        <button onClick={handleSaveChanges} className="btn-save">
          Save Changes
        </button>
        <button onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateStudentCard;
