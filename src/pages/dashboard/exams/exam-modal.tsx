import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileUploadInput from "@/components/shared/file-upload-input/file-upload-input";
import DatePickerInput from "@/components/shared/date-picker-input/date-picker-input";
import GradeSelect from "@/components/shared/grade-select/grade-select";
import SubjectSelect from "@/components/shared/subject-select/subject-select";
import RoundSelect from "@/components/shared/round-select/round-select";
import { AddExam } from "@/api/services/exam.services";
//import ModelExamSelect from "@/components/shared/model-exam-select/model-exam-select";
import Images from "@/assets/images/Images";

const ExamModal = ({ isOpen, onClose, fetchExam }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileError, setFileError] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm({
    mode: "onChange",
  });

  const handleModalClose = () => {
    onClose();
    reset();
  };

  const handleFileSelect = (file) => {
    setUploadedFile(file);
    setFileError(!file);
  };

  const appendToExamFormData = (data) => {
    const formData = new FormData();
    formData.append("TitleAr", data.TitleAr);
    formData.append("TitleEn", data.TitleEn);
    formData.append("From", data.From.toISOString());
    formData.append("To", data.To.toISOString());
    formData.append("TimerPerMinutes", data.TimerPerMinutes);
    formData.append("SubjectId", data.SubjectId);
    formData.append("GradeId", data.GradeId);
    formData.append("Round", data.Round);
    formData.append("Imag", uploadedFile);

    // If modelExes is an array, loop through it and append each value
    // if (Array.isArray(data.modelExes)) {
    //   data.modelExes.forEach((exe) => {
    //     formData.append("modelExes[]", exe); // Appending each element with the same key (modelExes[])
    //   });
    // }

    console.log(data.modelExes);

    return formData;
  };

  // Add exam
  const onSubmit = async (data) => {
    if (!uploadedFile) {
      setFileError(true);
      return;
    }
    console.log(data);
    const examData = appendToExamFormData(data);
    try {
      const response = await AddExam(examData);
      handleModalClose();
      fetchExam();
      console.log("Success:", response);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   setValue("GradeId", "aaaaaa");
  // }, [setValue]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleModalClose(); 
        }
      }}
    >
      <DialogContent className="sm:max-w-[60rem]">
        <DialogHeader>
          <DialogTitle>Add Exam</DialogTitle>
          {/* <DialogDescription>
            Fill in all fields to add an exam.
          </DialogDescription> */}
        </DialogHeader>
        <div className="overflow-y-auto max-h-[75vh] pe-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-4">
              {/* TitleAr Field */}
              <div className="mb-3 col-span-12 md:col-span-6">
                <Label className="flex gap-1 items-baseline" htmlFor="TitleAr">
                  Title Arabic
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
                    id="TitleAr"
                    placeholder="TitleAr"
                    {...register("TitleAr", {
                      required: "Title is required",
                    })}
                  />
                  {errors.TitleAr && (
                    <p className="mt-1 text-[#ff3728] text-[14px] font-[300]">
                      {errors.TitleAr.message}
                    </p>
                  )}
                </div>
              </div>

              {/* TitleEn Field */}
              <div className="mb-3 col-span-12 md:col-span-6">
                <Label className="flex gap-1 items-baseline" htmlFor="TitleAr">
                  Title English
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
                    id="TitleEn"
                    placeholder="TitleEn"
                    {...register("TitleEn", {
                      required: "Title is required",
                    })}
                  />
                  {errors.TitleEn && (
                    <p className="mt-1 text-[#ff3728] text-[14px] font-[300]">
                      {errors.TitleEn.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              {/* From data Field */}
              <div className="mb-3 col-span-12 md:col-span-6">
                <Label className="flex gap-1 items-baseline" htmlFor="From">
                  From Date
                  <span>
                    <img
                      className="w-2"
                      src={Images.red_asterisk_icon}
                      alt="pic"
                    />
                  </span>
                </Label>
                <div className="mt-2">
                  <DatePickerInput
                    name="From"
                    control={control}
                    label=""
                    rules={{ required: "Date is required" }}
                    errors={errors}
                  />
                </div>
              </div>

              {/* To data Field */}
              <div className="mb-2 col-span-12 md:col-span-6">
                <Label className="flex gap-1 items-baseline" htmlFor="To">
                  To Date
                  <span>
                    <img
                      className="w-2"
                      src={Images.red_asterisk_icon}
                      alt="pic"
                    />
                  </span>
                </Label>
                <div className="mt-2">
                  <DatePickerInput
                    name="To"
                    control={control}
                    label=""
                    rules={{ required: "Date is required" }}
                    errors={errors}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              {/* Timer Field */}
              <div className="mb-3 col-span-12 md:col-span-6">
                <Label
                  className="flex gap-1 items-baseline"
                  htmlFor="TimerPerMinutes"
                >
                  Duration (Minutes) 
                  <span>
                    <img
                      className="w-2"
                      src={Images.red_asterisk_icon}
                      alt="pic"
                    />
                  </span>
                </Label>
                <div className="mt-2">
                  <Controller
                    name="TimerPerMinutes"
                    control={control}
                    rules={{
                      required: "Time is required",
                      pattern: {
                        value: /^\d+$/,
                        message: "Only numbers are allowed",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="TimerPerMinutes"
                        placeholder="Time"
                        type="number"
                        onKeyDown={(e) => {
                          if (
                            ![
                              "Backspace",
                              "Tab",
                              "ArrowLeft",
                              "ArrowRight",
                              "Delete",
                            ].includes(e.key) &&
                            !/^\d$/.test(e.key)
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    )}
                  />
                  {errors.TimerPerMinutes && (
                    <p className="mt-1 text-[#ff3728] text-[14px] font-[300]">
                      {errors.TimerPerMinutes.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Round Field */}
              <div className="mb-3 col-span-12 md:col-span-6">
                <div className="">
                  <RoundSelect
                    name="Round"
                    label="Round"
                    asterisk={true}
                    defaultValue=""
                    control={control}
                    rules={{ required: "Round is required" }}
                    errors={errors}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              {/* Subject Field */}
              <div className="mb-3 col-span-12 md:col-span-6">
                <div className="">
                  <SubjectSelect
                    name="SubjectId"
                    label="Subject"
                    asterisk={true}
                    defaultValue=""
                    control={control}
                    rules={{ required: "Subject is required" }}
                    errors={errors}
                  />
                </div>
              </div>

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
            </div>

            <div className="grid grid-cols-12 gap-4">
              {/* Model Exam Field */}
              {/* <div className="mb-3 col-span-12 md:col-span-12">
                <div className="">
                  <ModelExamSelect
                    name="modelExes"
                    label="Model exam"
                    asterisk={true}
                    defaultValue={[]}
                    control={control}
                    rules={{ required: "Model exam is required" }}
                    errors={errors}
                  />
                </div>
              </div> */}
            </div>

            {/* upload Field */}
            <div className="mb-[30px] mt-1">
              <Label className="mb-2 flex" htmlFor="">
                Exam icon
              </Label>
              <FileUploadInput
                onFileSelect={handleFileSelect}
                fileError=""
                // fileError={fileError}
              />
              {/* Show file error if no file is uploaded */}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end items-center mt-6">
              <Button
                className="bg-[#523397]"
                type="submit"
                disabled={!isValid}
                // disabled={!isValid || !uploadedFile}
              >
                {isSubmitting ? "Submiting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamModal;
