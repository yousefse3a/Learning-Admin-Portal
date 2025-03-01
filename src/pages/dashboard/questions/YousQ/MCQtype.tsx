import { Control, useFieldArray, FieldErrors } from "react-hook-form";
import { ExamData } from "./AddExamTypes";
import FormController from "./FormController";
import { Button } from "@/components/ui/button";
import { getNestedValue } from "@/lib/utils";
import { error } from "console";

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
    fields: answers,
    append: addAnswer,
    remove: removeAnswer,
  } = useFieldArray({
    control,
    name: `topics.${topicIndex}.questions.${questionIndex}.answers`,
  });
  const rootAnswerError = getNestedValue(
    errors,
    `topics.${topicIndex}.questions.${questionIndex}.answers`
  );
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Question Content */}
      <FormController
        label="Question Content"
        name={`topics.${topicIndex}.questions.${questionIndex}.question_content`}
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

        {answers.map((answer, index) => (
          <div key={answer.id} className="grid grid-cols-6 gap-4">
            {/* Answer Text */}
            <FormController
              label={`Answer ${index + 1}`}
              name={`topics.${topicIndex}.questions.${questionIndex}.answers.${index}.text`}
              control={control}
              placeholder="Enter answer text"
              errors={errors}
              type="text"
              className="col-span-6 md:col-span-3"
            />

            {/* Correct Answer Checkbox */}
            <div className="col-span-6 md:col-span-3 flex items-center justify-around">
              <FormController
                label="Correct"
                name={`topics.${topicIndex}.questions.${questionIndex}.answers.${index}.isCorrect`}
                control={control}
                type="checkbox"
                errors={errors}
              />
              <Button
                type="button"
                onClick={() => removeAnswer(index)}
                className="bg-red-500 text-white p-2"
              >
                remove
              </Button>
            </div>
            {/* Remove Answer Button */}
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
