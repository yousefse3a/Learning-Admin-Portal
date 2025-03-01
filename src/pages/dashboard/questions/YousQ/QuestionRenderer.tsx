import { Control, useWatch, FieldErrors } from "react-hook-form";
import { ExamData } from "./AddExamTypes";
import FormController from "./FormController";
import MCQtype from "./MCQtype";
import TrueFalseType from "./TrueFalsetype";
import { useEffect } from "react";

interface QuestionRendererProps {
  topicIndex: number;
  questionIndex: number;
  control: Control<ExamData>;
  errors: FieldErrors<ExamData>;
}

export default function QuestionRenderer({
  topicIndex,
  questionIndex,
  control,
  errors,
  clearErrors,
}: QuestionRendererProps) {
  // Watch the selected type for the question
  const selectedType = useWatch({
    control,
    name: `topics.${topicIndex}.questions.${questionIndex}.type`,
  });
  // useEffect(() => {
  //   clearErrors();
  // }, [selectedType]);

  return (
    <div className="mt-4">
      {/* Render Based on Question Type */}
      {selectedType === "1" && (
        <MCQtype
          topicIndex={topicIndex}
          questionIndex={questionIndex}
          control={control}
          errors={errors}
        />
      )}
      {/* Render TrueFalseInput if Type is True/False */}
      {selectedType === "6" && (
        <TrueFalseType
          topicIndex={topicIndex}
          questionIndex={questionIndex}
          control={control}
          errors={errors}
        />
      )}
    </div>
  );
}
