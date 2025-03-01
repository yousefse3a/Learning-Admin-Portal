import { Control, FieldErrors, useFieldArray } from "react-hook-form";
import { ExamData } from "./AddExamTypes";
import { Button } from "@/components/ui/button";
import FormController from "./FormController";
import { EQuestionType } from "@/api/adminApis";
import QuestionRenderer from "./QuestionRenderer";

interface QuestionsProps {
  topicIndex: number;
  control: Control<ExamData>;
  errors: FieldErrors<ExamData>;
}

export default function Questions({
  topicIndex,
  control,
  errors,
  clearErrors,
}: QuestionsProps) {
  const {
    fields: questions,
    append: addQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: `topics.${topicIndex}.questions`,
  });
  const questionType = Object.entries(EQuestionType)
    .filter(([_key, value]) => typeof value === "number")
    .map(([key, value]) => ({ value: value.toString(), label: key }));

  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold mb-2">Questions</h4>

      {questions.map((question, index) => (
        <div key={question.id} className="mt-2 border p-2 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Question {index + 1}</h2>
            <Button
              type="button"
              onClick={() => {
                removeQuestion(index);
              }}
              className="bg-red-500 text-white p-2 ml-2"
            >
              Remove Question
            </Button>
          </div>
          <div className="grid grid-cols-6 gap-4">
            <FormController
              label="Question Type"
              name={`topics.${topicIndex}.questions.${index}.type`}
              control={control}
              placeholder="select Question Type"
              errors={errors}
              type="select"
              options={questionType}
              className="col-span-6 md:col-span-3"
            />
            <FormController
              label="Score"
              name={`topics.${topicIndex}.questions.${index}.score`}
              control={control}
              placeholder="enter question score"
              errors={errors}
              type="number"
              className="col-span-6 md:col-span-3"
            />
            <div className="col-span-6">
              <QuestionRenderer
                topicIndex={topicIndex}
                questionIndex={index}
                control={control}
                errors={errors}
                clearErrors={clearErrors}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add Question Button */}
      <Button
        type="button"
        onClick={() => addQuestion({ type: "1", score: 1 })}
        className="mt-2 bg-blue-500 text-white p-2"
      >
        Add Question
      </Button>
    </div>
  );
}
