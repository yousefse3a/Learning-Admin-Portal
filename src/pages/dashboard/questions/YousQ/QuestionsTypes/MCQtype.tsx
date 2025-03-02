import { Button } from "@/components/ui/button";
import { getNestedValue } from "@/lib/utils";
import { Control, FieldErrors, useFieldArray } from "react-hook-form";
import { ExamData } from "../AddExamTypes";
import FormController from "../FormController";

interface MCQInputProps {
  topicIndex: number;
  questionIndex: number;
  control: Control<ExamData>;
  errors: FieldErrors<ExamData>;
}

export default function MCQtype({
  topicIndex,
  questionIndex,
  control,
  errors,
}: MCQInputProps) {
  const {
    fields: Answers,
    append: addAnswer,
    remove: removeAnswer,
  } = useFieldArray({
    control,
    name: `Topics.${topicIndex}.questions.${questionIndex}.Answers`,
  });
  const rootAnswerError = getNestedValue(
    errors,
    `Topics.${topicIndex}.questions.${questionIndex}.Answers.root`
  );
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Question Content */}
      <FormController
        label="Question Content"
        name={`Topics.${topicIndex}.questions.${questionIndex}.ContentQuestion_MCQ`}
        control={control}
        placeholder="Enter the question text"
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

        {Answers.map((answer, index) => (
          <div key={answer.id} className="grid grid-cols-7 gap-4">
            {/* Answer Text */}
            <FormController
              label={`Answer ${index + 1}`}
              name={`Topics.${topicIndex}.questions.${questionIndex}.Answers.${index}.Answer`}
              control={control}
              placeholder="Enter answer text"
              errors={errors}
              type="text"
              className="col-span-3"
            />
            <FormController
              label="Correct"
              name={`Topics.${topicIndex}.questions.${questionIndex}.Answers.${index}.IsCorrect`}
              control={control}
              type="checkbox"
              errors={errors}
              className="col-span-3"
            />
            <div className="col-span-1 flex items-center justify-around">
              {Answers.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeAnswer(index)}
                  className="bg-red-500 text-white p-2"
                >
                  remove
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Add Answer Button */}
        <Button
          type="button"
          onClick={() => addAnswer({ text: "", isCorrect: false })}
          className="mt-2 bg-[#a87dc1] text-white p-2"
        >
          + Add Answer
        </Button>
      </div>
    </div>
  );
}
