import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import { ExamData } from "./AddExamTypes";
import GeneralInfo from "./GeneralInfo";
import TopicComponent from "./TopicComponent";
import examSchema from "./ValidationSchema";

function ExamForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamData>({
    resolver: joiResolver(examSchema),
    defaultValues: {
      name_ar: "",
      name_en: "",
      skill: "",
      subject: "",
      grade: "",
      level: "",
      mandatoryQuestions: 1,
      isActive: true,
      topics: [],
    },
  });

  function onSubmit(data: ExamData) {
    console.log("Submitting Exam Data:", JSON.stringify(data, null, 2));
    alert("Exam Submitted Successfully!");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add Exam Model</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* General Info */}
        <GeneralInfo control={control} errors={errors} />

        {/* Topics Section (Now handled inside TopicComponent) */}
        <TopicComponent control={control} errors={errors} />

        <button
          type="submit"
          className="mt-4 p-2 bg-blue-600 text-white w-full"
        >
          Submit Exam
        </button>
        <button
          type="button"
          onClick={() => {
            console.log("errors", errors);
          }}
          className="mt-4 p-2 bg-blue-600 text-white w-full"
        >
          debbug
        </button>
      </form>
    </div>
  );
}

export default ExamForm;
