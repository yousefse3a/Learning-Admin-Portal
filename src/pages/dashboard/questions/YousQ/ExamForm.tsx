import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ExamData } from "./AddExamTypes";
import GeneralInfo from "./GeneralInfo";
import Topics from "./Topics";
import { examSchema } from "./ValidationSchema";
import { jsonToFormData } from "./util";

function ExamForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamData>({
    resolver: zodResolver(examSchema),
    mode: "all",
  });

  function onSubmit(data: ExamData) {
    console.log("Submitting Exam Data:", JSON.stringify(data, null, 2));
    console.log("first,jsonToFormData",jsonToFormData(data))
    alert("Exam Submitted Successfully!");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add Exam Model</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* General Info */}
        <GeneralInfo control={control} errors={errors} />

        {/* Topics Section (Now handled inside TopicComponent) */}
        <Topics control={control} errors={errors} />

        <button
          type="submit"
          // onClick={onSubmit}
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
