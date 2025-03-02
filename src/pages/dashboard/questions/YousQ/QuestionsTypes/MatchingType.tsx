import { Control, FieldErrors, useFieldArray } from "react-hook-form";
import { ExamData } from "../AddExamTypes";
import FormController from "../FormController";
import { Button } from "@/components/ui/button";
import { getNestedValue } from "@/lib/utils";

interface MatchingTypeProps {
  topicIndex: number;
  questionIndex: number;
  control: Control<ExamData>;
  errors: FieldErrors<ExamData>;
}

export default function MatchingType({
  topicIndex,
  questionIndex,
  control,
  errors,
}: MatchingTypeProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `Topics.${topicIndex}.questions.${questionIndex}.RelatedQuestions`,
  });
  const rootAnswerError = getNestedValue(
    errors,
    `Topics.${topicIndex}.questions.${questionIndex}.RelatedQuestions`
  );
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Main Question Content */}
      <FormController
        label="Main Question Content"
        name={`Topics.${topicIndex}.questions.${questionIndex}.ContentQuestion_Matching`}
        control={control}
        placeholder="Enter the main question"
        errors={errors}
        type="text"
        className="col-span-2"
      />

      {/* Main Answer */}
      <FormController
        label="Main Answer"
        name={`Topics.${topicIndex}.questions.${questionIndex}.Answers_Matching`}
        control={control}
        placeholder="Enter the main answer"
        errors={errors}
        type="text"
        className="col-span-2"
      />

      <div className="col-span-4">
        <h4 className="font-semibold mb-2">Sub-Question</h4>
        {rootAnswerError && (
          <p className="text-red-500">{rootAnswerError?.message}</p>
        )}

        {fields.map((subQuestion, subIndex) => (
          <div key={subQuestion.id} className="grid grid-cols-7 gap-4">
            <FormController
              label={`Sub-Question ${subIndex + 1}`}
              name={`Topics.${topicIndex}.questions.${questionIndex}.RelatedQuestions.${subIndex}.ContentQuestion`}
              control={control}
              placeholder="Enter sub-question"
              errors={errors}
              type="text"
              className="col-span-3"
            />

            <FormController
              label="Answer"
              name={`Topics.${topicIndex}.questions.${questionIndex}.RelatedQuestions.${subIndex}.Answers`}
              control={control}
              placeholder="Enter answer"
              errors={errors}
              type="text"
              className="col-span-3"
            />

            <div className="col-span-1 flex items-center justify-around">
              {fields.length > 1 && (
                <Button
                  type="button"
                  onClick={() => remove(subIndex)}
                  className="bg-red-500 text-white p-2 mt-2"
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Add Sub-Question Button */}
        <Button
          type="button"
          onClick={
            () => append({ ContentQuestion_Matching: "", answer: "" }) // Add new empty sub-question
          }
          className="mt-2 bg-blue-500 text-white p-2"
        >
          Add Sub-Question
        </Button>
      </div>
    </div>
  );
}
