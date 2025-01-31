import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Images from "@/assets/images/Images";
import GradeSelect from "@/components/shared/grade-select/grade-select";
import LevelSelect from "@/components/shared/level-select/level-select";
import SchoolSelect from "@/components/shared/school-select/school-select";
import { AddStudent } from "@/api/services/student.services";
import { toast } from "react-toastify";

interface ConfirmDeleteProps {
  isModalOpen: boolean;
  onClose: () => void;
}

const AddStudentModal: React.FC<ConfirmDeleteProps> = ({
  isModalOpen,
  onClose,
  fetchStudents,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    watch,
  } = useForm({
    mode: "onChange",
  });

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const gender = watch("Gender");

  const handleModalClose = () => {
    onClose();
    reset();
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await AddStudent(data);
      handleModalClose();
      fetchStudents();
      toast.success("Student added successfully!");
      console.log("Success:", response);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to enable submit button only if gender is selected
  const isSubmitEnabled = () => {
    return gender !== undefined && gender !== "";
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => {
        handleModalClose();
      }}
    >
      <DialogContent className="sm:max-w-[60rem]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>
        <div className="pe-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-4">
              {/* Student Code Field */}
              <div className="mb-3 col-span-12 md:col-span-6">
                <Label
                  className="flex gap-1 items-baseline"
                  htmlFor="StudentCode"
                >
                  Student Code
                  <span>
                    <img
                      className="w-2"
                      src={Images.red_asterisk_icon}
                      alt="pic"
                    />
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
                <Label
                  className="flex gap-1 items-baseline"
                  htmlFor="StudentName"
                >
                  User Name
                  <span>
                    <img
                      className="w-2"
                      src={Images.red_asterisk_icon}
                      alt="pic"
                    />
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
              {/* Password Field */}
              <div className="mb-3 col-span-12 md:col-span-6">
                <Label className="flex gap-1 items-baseline" htmlFor="Password">
                  Password
                  <span>
                    <img
                      className="w-2"
                      src={Images.red_asterisk_icon}
                      alt="pic"
                    />
                  </span>
                </Label>
                <div className="mt-2 relative">
                  <Input
                    id="Password"
                    placeholder="***"
                    type={showPassword ? "text" : "password"}
                    {...register("Password", {
                      required: "Password is required",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                    className="absolute right-2 top-3 text-gray-500"
                  >
                    {showPassword ? (
                      <img
                        className="w-4 h-4 password_icon"
                        src={Images.show_password_icon}
                        alt="Show password"
                      />
                    ) : (
                      <img
                        className="w-4 h-4 password_icon"
                        src={Images.hide_password_icon}
                        alt="Hide password"
                      />
                    )}
                  </button>
                  {errors.Password && (
                    <p className="mt-1 text-[#ff3728] text-[14px] font-[300]">
                      {errors.Password.message}
                    </p>
                  )}
                </div>
              </div>

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
            </div>

            <div className="grid grid-cols-12 gap-4">
              {/* Gender Field */}
              <div className="mb-3 col-span-12 md:col-span-6">
                <Label className="flex gap-1 items-baseline" htmlFor="Gender">
                  Gender
                  <span>
                    <img
                      className="w-2"
                      src={Images.red_asterisk_icon}
                      alt="pic"
                    />
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentModal;
