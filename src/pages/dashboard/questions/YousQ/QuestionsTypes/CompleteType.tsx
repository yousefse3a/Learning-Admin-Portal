import { Control, FieldErrors, useFieldArray } from "react-hook-form";
import FormController from "../FormController";
import { ExamData } from "../AddExamTypes";
import { Button } from "@/components/ui/button";
import { getNestedValue } from "@/lib/utils";

interface CompleteTypeProps {
  topicIndex: number;
  questionIndex: number;
  control: Control<ExamData>;
  errors: FieldErrors<ExamData>;
}

export default function CompleteType({
  topicIndex,
  questionIndex,
  control,
  errors,
}: CompleteTypeProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `Topics.${topicIndex}.questions.${questionIndex}.Answers_Complete`,
  });
  const rootAnswerError = getNestedValue(
    errors,
    `Topics.${topicIndex}.questions.${questionIndex}.Answers_Complete`
  );
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Main Question Content */}
      <FormController
        label="Main Question Content"
        name={`Topics.${topicIndex}.questions.${questionIndex}.ContentQuestion_Complete`}
        control={control}
        placeholder="Enter the main question"
        errors={errors}
        type="text"
        className="col-span-3"
      />

      {/* Multiple Answers with Add/Remove */}
      <div className="col-span-4">
        <h4 className="font-semibold mb-2">Answers</h4>
        {rootAnswerError && (
          <p className="text-red-500">{rootAnswerError?.message}</p>
        )}

        {fields.map((answer, index) => (
          <div key={answer.id} className="grid grid-cols-7 gap-4">
            <FormController
              label={`Answer ${index + 1}`}
              name={`Topics.${topicIndex}.questions.${questionIndex}.Answers_Complete.${index}.Answer`}
              control={control}
              placeholder="Enter answer content"
              errors={errors}
              type="text"
              className="col-span-3"
            />
            <FormController
              label="Order"
              name={`Topics.${topicIndex}.questions.${questionIndex}.Answers_Complete.${index}.CorrectAnswerOrder`}
              control={control}
              placeholder="Enter order number"
              errors={errors}
              type="number"
              className="col-span-3"
            />
            <div className="col-span-1 flex items-center justify-around">
              {fields.length > 1 && (
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  className={"bg-red-500 text-white p-2 mt-2"}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Add Answer Button */}
        <Button
          type="button"
          onClick={
            () => append({ content: "", order: fields.length + 1 }) // Auto increment order
          }
          className="mt-2 bg-blue-500 text-white p-2"
        >
          Add Answer
        </Button>
      </div>
    </div>
  );
}
