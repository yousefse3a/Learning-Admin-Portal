import { Control, FieldErrors, useFieldArray } from "react-hook-form";
import FormController from "./FormController";
import QuestionComponent from "./QuestionComponent";
import { ExamData } from "./AddExamTypes";
import { Button } from "@/components/ui/button";

interface TopicProps {
  index: number;
  control: Control<ExamData>;
  removeTopic: (index: number) => void;
  errors: FieldErrors<ExamData>;
}

function TopicComponent({ index, control, removeTopic, errors }: TopicProps) {
  const {
    fields: questions,
    append: addQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: `topics.${index}.questions`,
  });

  return (
    <div key={index} className="border p-4 mb-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Topic {index + 1}</h2>
        <Button
          type="button"
          onClick={() => removeTopic(index)}
          className="bg-red-500"
        >
          Remove Topic
        </Button>
      </div>
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-6 md:col-span-3">
          <FormController
            label="Title (Ar)"
            name={`topics.${index}.title_ar`}
            control={control}
            placeholder="Topic Title Arabic"
            errors={errors} // Ensure error message is correctly passed
            type="text"
          />
        </div>
        <div className="col-span-6 md:col-span-3">
          <FormController
            label="Topic (En)"
            name={`topics.${index}.title_en`}
            control={control}
            placeholder="Topic Title English"
            errors={errors}
            type="text"
          />{" "}
        </div>
        <div className="col-span-6 md:col-span-3">
          <FormController
            label="Topic Content"
            name={`topics.${index}.content`}
            control={control}
            placeholder="Topic Content"
            errors={errors}
            type="text"
          />
        </div>
        <div className="col-span-6 md:col-span-3">
          <FormController
            label="Upload Topic Image"
            name="file"
            control={control}
            type="file"
            errors={errors}
          />
        </div>
      </div>

      {/* Questions Section */}
      <h4 className="font-semibold mt-4">Questions</h4>
      <button
        type="button"
        onClick={() => addQuestion({ text: "" })}
        className="mt-2 text-blue-500"
      >
        Add Question
      </button>

      {/* {questions.map((question, qIndex) => (
        <QuestionComponent
          key={question.id}
          index={qIndex}
          topicIndex={index}
          control={control}
          removeQuestion={removeQuestion}
          errors={errors}
        />
      ))} */}
    </div>
  );
}

export default TopicComponent;
