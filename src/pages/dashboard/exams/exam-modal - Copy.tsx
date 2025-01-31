import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GetSubject,
  GetGrade,
  GetModelExam,
  AddExam,
} from "@/api/services/exam.services";
import { ROUND_TYPE } from "@/lib/constant";
import FileUploadInput from "@/components/shared/file-upload-input/file-upload-input";
import DatePickerInput from "@/components/shared/date-picker-input/date-picker-input";
import Images from "@/assets/images/Images";

const ExamModal = ({ isOpen, onClose, fetchExam }) => {
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [modelExam, setModelExam] = useState([]);
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

  const handleSelectChange = (key) => (value) => {
    console.log(`${key}:`, value);
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
    formData.append("modelExes", data.modelExes);

    return formData;
  };

  const handleModalClose = () => {
    onClose();
    reset();
  };

  const handleFileSelect = (file) => {
    setUploadedFile(file);
    setFileError(!file);
  };

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      const payload = {
        Keyword: "",
        Page: 1,
        Size: 50,
      };
      const response = await GetSubject(payload);
      setSubjects(response.data.Data.Data || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  // Fetch grades
  const fetchGrades = async () => {
    try {
      const payload = {
        Keyword: "",
        Page: 1,
        Size: 50,
      };
      const response = await GetGrade(payload);
      setGrades(response.data.Data.Data || []);
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };

  // Fetch ModelExam
  const fetchModelExam = async () => {
    try {
      const payload = {
        Keyword: "",
        Page: 1,
        Size: 50,
      };
      const response = await GetModelExam(payload);
      setModelExam(response.data.Data.Data || []);
    } catch (error) {
      console.error("Error fetching model exams:", error);
    }
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

  useEffect(() => {
    if (isOpen) {
      fetchSubjects();
      fetchGrades();
      fetchModelExam();
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      // onOpenChange={(open) => {
      //   console.log(open, "open");
      //   handleModalClose();
      // }}
      onOpenChange={(open) => {
        if (!open) {
          handleModalClose(); // Close modal only when `open` changes to `false`
        }
      }}
    >
      <DialogContent className="sm:max-w-[60rem]">
        <DialogHeader>
          <DialogTitle>Add Exam</DialogTitle>
          <DialogDescription>
            Fill in all fields to add an exam.
          </DialogDescription>
        </DialogHeader>
        <div className="">
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
                  Timer Per Minutes
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
                <Label className="flex gap-1 items-baseline" htmlFor="Round">
                  Round
                  <span>
                    <img
                      className="w-2"
                      src={Images.red_asterisk_icon}
                      alt="pic"
                    />
                  </span>
                </Label>
                <div className="mt-2">
                  {/* <Controller
                    name="Round"
                    control={control}
                    rules={{ required: "Round is required" }}
                    render={({ field }) => (
                      <Select
                        className="w-full basic-multi-select"
                        options={[
                          {
                            value: ROUND_TYPE.round1.value,
                            label: ROUND_TYPE.round1.name,
                          },
                          {
                            value: ROUND_TYPE.round2.value,
                            label: ROUND_TYPE.round2.name,
                          },
                          {
                            value: ROUND_TYPE.round3.value,
                            label: ROUND_TYPE.round3.name,
                          },
                        ]}
                        value={field.value} // Bind field value
                        onChange={(selectedOptions) => {
                          // Pass the selected options to react-hook-form field
                          field.onChange(selectedOptions);
                          handleSelectChange("Round")(selectedOptions); // Dynamic handler
                        }}
                        placeholder={
                          "Select a Round"
                        } 
                        classNamePrefix="select"
                      />
                    )}
                  /> */}
                  <Controller
                    name="Round"
                    control={control}
                    rules={{ required: "Round is required" }}
                    render={({ field }) => (
                      <Select
                        className="w-full basic-multi-select"
                        options={[
                          {
                            value: ROUND_TYPE.round1.value,
                            label: ROUND_TYPE.round1.name,
                          },
                          {
                            value: ROUND_TYPE.round2.value,
                            label: ROUND_TYPE.round2.name,
                          },
                          {
                            value: ROUND_TYPE.round3.value,
                            label: ROUND_TYPE.round3.name,
                          },
                        ]}
                        value={
                          field.value
                            ? {
                                value: field.value,
                                label: ROUND_TYPE[field.value]?.name,
                              }
                            : null
                        } // Bind field value
                        onChange={(selectedOption) => {
                          // Ensure only the value is passed to react-hook-form
                          field.onChange(
                            selectedOption ? selectedOption.value : null
                          );
                        }}
                        placeholder={"Select a Round"}
                        classNamePrefix="select"
                      />
                    )}
                  />

                  {errors.Round && (
                    <p className="mt-1 text-[#ff3728] text-[14px] font-[300]">
                      {errors.Round.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              {/* Subject Field */}
              <div className="mb-3 col-span-12 md:col-span-6">
                <Label
                  className="flex gap-1 items-baseline"
                  htmlFor="SubjectId"
                >
                  Subject
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
                    name="SubjectId"
                    control={control}
                    rules={{ required: "Subject is required" }}
                    render={({ field }) => (
                      <Select
                        className="w-full basic-multi-select"
                        options={subjects.map((item) => ({
                          value: item?.Id,
                          label: item?.NameEn,
                        }))}
                        value={
                          field.value
                            ? {
                                value: field.value,
                                label: subjects.find(
                                  (subject) => subject.Id === field.value
                                )?.NameEn,
                              }
                            : null
                        }
                        onChange={(selectedOption) => {
                          field.onChange(
                            selectedOption ? selectedOption.value : null
                          );
                        }}
                        placeholder={"Select a Subject"}
                        classNamePrefix="select"
                      />
                    )}
                  />

                  {errors.SubjectId && (
                    <p className="mt-1 text-[#ff3728] text-[14px] font-[300]">
                      {errors.SubjectId.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Grade Field */}
              <div className="mb-3 col-span-12 md:col-span-6">
                <Label className="flex gap-1 items-baseline" htmlFor="GradeId">
                  Grade
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
                    name="GradeId"
                    control={control}
                    rules={{ required: "Grade is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={grades.map((item) => ({
                          value: item?.Id,
                          label: item?.NameEn,
                        }))}
                        value={
                          field.value
                            ? {
                                value: field.value,
                                label: grades.find(
                                  (grade) => grade.Id === field.value
                                )?.NameEn,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          field.onChange(
                            selectedOption ? selectedOption.value : null
                          )
                        }
                        placeholder="Select a Grade"
                        classNamePrefix="select"
                      />
                    )}
                  />
                  {errors.GradeId && (
                    <p className="mt-1 text-[#ff3728] text-[14px] font-[300]">
                      {errors.GradeId.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              {/* Model Exam Field */}
              <div className="mb-2 col-span-12 md:col-span-12">
                <Label
                  className="flex gap-1 items-baseline"
                  htmlFor="modelExes"
                >
                  Model exam
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
                    name="modelExes"
                    control={control}
                    rules={{ required: "Model exam is required" }}
                    render={({ field }) => (
                      <Select
                        className="w-full basic-multi-select"
                        options={modelExam.map((item) => ({
                          value: item?.Id, // Value should be the ID of the model
                          label: item?.NameEn, // Label should be the NameEn
                        }))}
                        isMulti
                        value={
                          field.value?.map((id) => ({
                            value: id, // Ensure value is mapped properly
                            label: modelExam.find((model) => model.Id === id)
                              ?.NameEn, // Find the label based on Id
                          })) || []
                        } // Default to empty array if no value is selected
                        onChange={(selectedOptions) => {
                          // Pass an array of selected objects to react-hook-form field
                          field.onChange(
                            selectedOptions.map((option) => option.value)
                          ); // Passing just the Ids
                          handleSelectChange("modelExes")(selectedOptions); 
                        }}
                        placeholder={"Select a Model"} // Placeholder text
                        classNamePrefix="select"
                      />
                    )}
                  />

                  {errors.modelExes && (
                    <p className="mt-1 text-[#ff3728] text-[14px] font-[300]">
                      {errors.modelExes.message}
                    </p>
                  )}
                </div>
              </div>
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
