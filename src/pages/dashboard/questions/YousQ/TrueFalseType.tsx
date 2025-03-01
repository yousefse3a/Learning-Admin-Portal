import { Control, FieldErrors } from "react-hook-form";
import { ExamData } from "./AddExamTypes";
import FormController from "./FormController";

interface TrueFalseTypeProps {
  topicIndex: number;
  questionIndex: number;
  control: Control<ExamData>;
  errors: FieldErrors<ExamData>;
}

export default function TrueFalseType({
  topicIndex,
  questionIndex,
  control,
  errors,
}: TrueFalseTypeProps) {
  return (
    <div className="grid grid-cols-7 gap-4">
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

      {/* True/False Selection */}
      <FormController
        label="Answer"
        name={`topics.${topicIndex}.questions.${questionIndex}.answer`}
        control={control}
        errors={errors}
        type="select"
        options={[
          { value: "true", label: "True" },
          { value: "false", label: "False" },
        ]}
        className="col-span-2"
      />

      {/* File Upload */}
      <FormController
        label="Upload Image"
        name={`topics.${topicIndex}.questions.${questionIndex}.file`}
        control={control}
        errors={errors}
        type="file"
        className="col-span-2"
      />
    </div>
  );
}
