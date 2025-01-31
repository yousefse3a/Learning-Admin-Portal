import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import GradeSelect from "@/components/shared/grade-select/grade-select";
import SubjectSelect from "@/components/shared/subject-select/subject-select";
import LevelSelect from "@/components/shared/level-select/level-select";
import SkillSelect from "@/components/shared/skills-select/skills-select";
import Images from "@/assets/images/Images";

const AddModelExamPage = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileError, setFileError] = useState(false);
  const [topicDivs, setTopicDivs] = useState([]);
//console.log(topicDivs)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    setValue, // Import setValue to update form fields dynamically
    watch, // Watch the form state
  } = useForm({
    mode: "onChange",
    defaultValues: {
      IsActive: false,
      Topics: [],
    },
  });

  // // Function to add a new div
  // const addTopic = () => {
  //   // setDivs([...divs, { id: divs.length, text: "New topic" }]);
  //   setTopicDivs([...topicDivs, { id: topicDivs.length }]);
  // };

  // // Function to remove a div by id
  // const removeTopic = (id) => {
  //   setTopicDivs(topicDivs.filter((div) => div.id !== id));
  // };

  // // Function to add a new div (topic)
  // const addTopic = () => {
  //   setTopicDivs((prevDivs) => {
  //     const newDivs = [...prevDivs, { id: prevDivs.length }];
  //     setValue("Topics", newDivs); // Update Topics array in the form
  //     return newDivs;
  //   });
  // };

  // // Function to remove a div (topic) by id
  // const removeTopic = (id) => {
  //   const newDivs = topicDivs.filter((div) => div.id !== id);
  //   setTopicDivs(newDivs);
  //   setValue("Topics", newDivs); // Update Topics array in the form after removal
  // };

  // Function to add a new div (topic)
  const addTopic = () => {
    setTopicDivs((prevDivs) => {
      const newDiv = { id: prevDivs.length }; // Create new topic with unique id
      const newDivs = [...prevDivs, newDiv];
      setValue("Topics", newDivs); // Update Topics array in the form
      return newDivs;
    });
  };

  //setValue("Topics", topicDivs);

  // Function to remove a div (topic) by id
  const removeTopic = (id) => {
    const newDivs = topicDivs.filter((div) => div.id !== id); // Remove topic from the UI state
    setTopicDivs(newDivs);
    setValue("Topics", newDivs); // Update Topics array in the form state after removal
  };

  const onSubmit = (data) => {
    console.log("add model exam:", data);
    setValue("Topics", topicDivs);
  };

  return (
    <div className="py-2 px-4">
      <h1 className="text-xl font-bold mb-6">Add Model Exam</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-6 md:col-span-4">
            <div className="grid grid-cols-12 gap-4 mb-2">
              {/* NameAr Field */}
              <div className="mb-3 col-span-12 md:col-span-6">
                <Label className="flex gap-1 items-baseline" htmlFor="NameAr">
                  Name (Arabic)
                </Label>
                <div className="mt-2">
                  <Input
                    id="NameAr"
                    placeholder="Name arabic"
                    {...register("NameAr", {
                      required: "Arabic name is required",
                    })}
                  />
                  {errors.NameAr && (
                    <p className="mt-1 text-[#ff3728] text-[14px] font-[300]">
                      {errors.NameAr.message}
                    </p>
                  )}
                </div>
              </div>

              {/* NameEn Field */}
              <div className="mb-3 col-span-12 md:col-span-6">
                <Label className="flex gap-1 items-baseline" htmlFor="NameEn">
                  Name (English)
                </Label>
                <div className="mt-2">
                  <Input
                    id="NameEn"
                    placeholder="Name english"
                    {...register("NameEn", {
                      required: "English name is required",
                    })}
                  />
                  {errors.NameEn && (
                    <p className="mt-1 text-[#ff3728] text-[14px] font-[300]">
                      {errors.NameEn.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4  mb-2">
              {/* Subject Field */}
              <div className="mb-1 col-span-12 md:col-span-6">
                <div className="">
                  <SubjectSelect
                    name="SubjectId"
                    label="Subject"
                    asterisk={false}
                    defaultValue=""
                    control={control}
                    rules={{ required: "Subject is required" }}
                    errors={errors}
                  />
                </div>
              </div>

              {/* Grades Field */}
              <div className="mb-1 col-span-12 md:col-span-6">
                <div className="">
                  <GradeSelect
                    name="GradeId"
                    label="Grade"
                    asterisk={false}
                    defaultValue=""
                    control={control}
                    rules={{ required: "Grade is required" }}
                    errors={errors}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 mb-2">
              {/* Levels Field */}
              <div className="mb-3 col-span-12 md:col-span-6">
                <div className="">
                  <LevelSelect
                    name="LevelId"
                    label="Level"
                    asterisk={false}
                    defaultValue=""
                    control={control}
                    rules={{ required: "Level is required" }}
                    errors={errors}
                  />
                </div>
              </div>

              {/* Skill Field */}
              <div className="mb-3 col-span-12 md:col-span-6">
                <div className="">
                  <SkillSelect
                    name="Skill"
                    label="Skill"
                    asterisk={false}
                    defaultValue=""
                    control={control}
                    rules={{ required: "Skill is required" }}
                    errors={errors}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              {/* Number Field */}
              <div className="mb-3 col-span-12 md:col-span-6">
                <Label
                  className="flex gap-1 items-baseline"
                  htmlFor="NumberOfMandatoryQuestions"
                >
                  Number Of Mandatory Questions
                </Label>
                <div className="mt-2">
                  <Controller
                    name="NumberOfMandatoryQuestions"
                    control={control}
                    rules={{
                      required: "Number is required",
                      pattern: {
                        value: /^\d+$/,
                        message: "Only numbers are allowed",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="NumberOfMandatoryQuestions"
                        placeholder="Number"
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const intValue =
                            value === "" ? "" : parseInt(value, 10);
                          field.onChange(intValue);
                        }}
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
                            //Number(e.target.value)
                          }
                        }}
                      />
                    )}
                  />
                  {errors.NumberOfMandatoryQuestions && (
                    <p className="mt-1 text-[#ff3728] text-[14px] font-[300]">
                      {errors.NumberOfMandatoryQuestions.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Active Field */}
              <div className="mb-3 col-span-12 md:col-span-6 flex flex-col justify-evenly">
                <Label className="flex gap-1 items-baseline" htmlFor="IsActive">
                  Active
                </Label>
                <div className="mt-2">
                  <Controller
                    name="IsActive"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="IsActive"
                          name="IsActive"
                          value=""
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                        {/* <label htmlFor="vehicle1"> Active</label> */}
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 mb-2">
              {/* piece Field */}
              <div className="mb-3 col-span-12 md:col-span-12">
                <Label className="flex gap-1 items-baseline" htmlFor="piece">
                  Piece
                </Label>
                <div className="mt-2">
                  <Textarea
                    id="piece"
                    name="piece"
                    rows="6"
                    //cols="50"
                    {...register("piece", {
                      required: "piece is required",
                    })}
                  />
                  {errors.piece && (
                    <p className="mt-1 text-[#ff3728] text-[14px] font-[300]">
                      {errors.piece.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 mb-2">
              {/* Active Field */}
              <div className="mb-3 col-span-12 md:col-span-12">
                <h1 className="text-xl font-bold mb-6">Topics</h1>
                <div className="mt-2">
                  <Controller
                    name="Topics"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-12 gap-4">
                        {/* Button to add a new div */}
                        <button
                          type="button"
                          onClick={addTopic}
                          className="px-4 py-2 bg-blue-500 text-white rounded whitespace-nowrap w-fit"
                        >
                          Add Topic
                        </button>

                        {/* Rendering the dynamic divs */}
                        {topicDivs.map((div) => (
                          <div
                            key={div.id}
                            className="mb-3 col-span-12 md:col-span-12 p-4 border rounded"
                          >
                            <div className="grid grid-cols-12 gap-4">
                              {/* TitleAr Field */}
                              <div className="mb-3 col-span-12 md:col-span-6">
                                <Label
                                  className="flex gap-1 items-baseline"
                                  htmlFor={`Topics[${div.id}].TitleAr`}
                                >
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
                                  <Controller
                                    name={`Topics[${div.id}].TitleAr`}
                                    control={control}
                                    render={({ field }) => (
                                      <Input
                                        placeholder="TitleAr"
                                        {...field}
                                        // Validation example
                                        required
                                      />
                                    )}
                                  />
                                  {errors?.Topics?.[div.id]?.TitleAr && (
                                    <p className="mt-1 text-[#ff3728] text-[14px] font-[300]">
                                      Title is required
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* TitleEn Field */}
                              <div className="mb-3 col-span-12 md:col-span-6">
                                <Label
                                  className="flex gap-1 items-baseline"
                                  htmlFor={`Topics[${div.id}].TitleEn`}
                                >
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
                                  <Controller
                                    name={`Topics[${div.id}].TitleEn`}
                                    control={control}
                                    render={({ field }) => (
                                      <Input
                                        placeholder="TitleEn"
                                        {...field}
                                        // Validation example
                                        required
                                      />
                                    )}
                                  />
                                  {errors?.Topics?.[div.id]?.TitleEn && (
                                    <p className="mt-1 text-[#ff3728] text-[14px] font-[300]">
                                      Title is required
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeTopic(div.id)}
                              className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="mb-3 col-span-12 md:col-span-6"></div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end items-center mt-6">
              <Button
                className="bg-[#523397]"
                type="submit"
                //disabled={!isValid}
                // disabled={!isValid || !uploadedFile}
              >
                {isSubmitting ? "Submiting..." : "Submit"}
              </Button>
            </div>
          </div>
        </div>
        {/* <div className="grid grid-cols-9 gap-4"></div> */}
      </form>
    </div>
  );
};

export default AddModelExamPage;
