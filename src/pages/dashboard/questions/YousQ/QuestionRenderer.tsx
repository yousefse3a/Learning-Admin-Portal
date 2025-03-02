import { Control, FieldErrors, useWatch } from "react-hook-form";
import { ExamData } from "./AddExamTypes";
import DragDropType from "./QuestionsTypes/DragDropType";
import MatchingType from "./QuestionsTypes/MatchingType";
import MCQtype from "./QuestionsTypes/MCQtype";
import TrueFalseType from "./QuestionsTypes/TrueFalseType";
import WritingType from "./QuestionsTypes/WritingType";
import CompleteType from "./QuestionsTypes/CompleteType";

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
}: QuestionRendererProps) {
  // Watch the selected type for the question
  const selectedType = useWatch({
    control,
    name: `Topics.${topicIndex}.questions.${questionIndex}.QuestionType`,
  });

  return (
    <div className="mt-4">
      {selectedType === "1" && (
        <MCQtype
          topicIndex={topicIndex}
          questionIndex={questionIndex}
          control={control}
          errors={errors}
        />
      )}
      {selectedType === "2" && (
        <WritingType
          topicIndex={topicIndex}
          questionIndex={questionIndex}
          control={control}
          errors={errors}
        />
      )}
      {selectedType === "3" && (
        <MatchingType
          topicIndex={topicIndex}
          questionIndex={questionIndex}
          control={control}
          errors={errors}
        />
      )}
      {selectedType === "4" && (
        <DragDropType
          topicIndex={topicIndex}
          questionIndex={questionIndex}
          control={control}
          errors={errors}
        />
      )}
      {selectedType === "5" && (
        <CompleteType
          topicIndex={topicIndex}
          questionIndex={questionIndex}
          control={control}
          errors={errors}
        />
      )}
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
