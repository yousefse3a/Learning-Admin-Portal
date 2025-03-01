import { Control, FieldErrors } from "react-hook-form";
import { ExamData } from "./AddExamTypes";
import FormController from "./FormController";

interface QuestionProps {
  index: number;
  topicIndex: number;
  control: Control<ExamData, any>;
  removeQuestion: (qIndex: number) => void;
  errors: FieldErrors<ExamData>;
}

export default function QuestionComponent({
  index,
  topicIndex,
  control,
  removeQuestion,
  errors,
}: QuestionProps) {
  return (
    <div className="mt-2 border p-2 rounded">
      <FormController
        name={`topics.${topicIndex}.questions.${index}.text`}
        control={control}
        placeholder={`Question ${index + 1}`}
        errors={errors}
        type="text"
      />
      <button
        type="button"
        onClick={() => removeQuestion(index)}
        className="text-red-500"
      >
        Remove Question
      </button>
    </div>
  );
}
