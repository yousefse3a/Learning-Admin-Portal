import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useFieldArray, useForm } from "react-hook-form";
import { ExamData } from "./AddExamTypes";
import GeneralInfo from "./GeneralInfo";
import TopicComponent from "./TopicComponent";
import { Button } from "@/components/ui/button";

const schema = Joi.object({
  name_ar: Joi.string().min(3).max(50).required(),
  name_en: Joi.string().min(3).max(50).required(),
  skill: Joi.string().valid("1", "2", "3", "4").required(),
  subject: Joi.string().required(),
  grade: Joi.string().required(),
  level: Joi.string().required(),
  mandatoryQuestions: Joi.number().integer().min(1).required(),
  isActive: Joi.boolean().required(),
  topics: Joi.array()
    .min(1)
    .items(
      Joi.object({
        title_ar: Joi.string().required(),
        title_en: Joi.string().required(),
        content: Joi.string().required(),
        questions: Joi.array()
          .min(1)
          .items(Joi.object({ text: Joi.string().required() })),
      })
    ),
});

function ExamForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamData>({
    resolver: joiResolver(schema),
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

  const {
    fields: topics,
    append: addTopic,
    remove: removeTopic,
  } = useFieldArray({
    control,
    name: "topics",
  });

  function onSubmit(data: ExamData) {
    console.log("Submitting Exam Data:", JSON.stringify(data, null, 2));
    alert("Exam Submitted Successfully!");
  }
  function handleAddTopic() {
    addTopic({
      title_ar: "",
      title_en: "",
      content: "",
      questions: [{ text: "" }],
    });
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add Exam model</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <GeneralInfo control={control} errors={errors} />

        {topics.map((topic, index) => (
          <TopicComponent
            key={topic.id}
            index={index}
            control={control}
            removeTopic={removeTopic}
            errors={errors?.topics?.[index] || {}}
          />
        ))}
        <Button
          type="button"
          onClick={handleAddTopic}
          className="bg-green-500 mt-4"
        >
          Add Topic
        </Button>
        <button
          type="submit"
          className="mt-4 p-2 bg-blue-600 text-white w-full"
        >
          Submit Exam
        </button>
        <button
          type="button"
          onClick={() => console.log(errors)}
          className="mt-4 p-2 bg-yellow-500 text-white w-full"
        >
          Debug Validation Errors
        </button>
      </form>
    </div>
  );
}

export default ExamForm;
