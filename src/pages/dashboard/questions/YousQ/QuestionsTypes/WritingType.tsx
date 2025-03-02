import { Control, FieldErrors } from "react-hook-form";
import FormController from "../FormController";
import { ExamData } from "../AddExamTypes";

interface WritingTypeProps {
  topicIndex: number;
  questionIndex: number;
  control: Control<ExamData>;
  errors: FieldErrors<ExamData>;
}

export default function WritingType({
  topicIndex,
  questionIndex,
  control,
  errors,
}: WritingTypeProps) {
  return (
    <div className="grid grid-cols-6 gap-4">
      {/* Question Content (Text Input) */}
      <FormController
        label="Question Content"
        name={`Topics.${topicIndex}.questions.${questionIndex}.ContentQuestion_Writing`}
        control={control}
        placeholder="Enter the question content"
        errors={errors}
        type="text"
        className="col-span-6 md:col-span-3"
      />

      {/* Image Upload */}
      <FormController
        label="Upload Image (Optional)"
        name={`Topics.${topicIndex}.questions.${questionIndex}.File`}
        control={control}
        errors={errors}
        type="file"
        className="col-span-6 md:col-span-3"
      />
    </div>
  );
}
