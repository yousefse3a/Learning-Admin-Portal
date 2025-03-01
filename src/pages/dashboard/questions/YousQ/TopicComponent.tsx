import { useState } from "react";
import { Control, FieldErrors, useFieldArray } from "react-hook-form";
import FormController from "./FormController";
import { ExamData } from "./AddExamTypes";
import { Button } from "@/components/ui/button";
import QuestionComponent from "./QuestionComponent";

interface TopicProps {
  control: Control<ExamData>;
  errors: FieldErrors<ExamData>;
}

function TopicComponent({ control, errors }: TopicProps) {
  const {
    fields: topics,
    append: addTopic,
    remove: removeTopic,
  } = useFieldArray({
    control,
    name: "topics",
  });

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Topics</h2>

      {topics.map((topic, index) => (
        <div key={topic.id} className="border p-4 mb-6 rounded-lg">
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
                errors={errors}
                type="text"
              />
            </div>
            <div className="col-span-6 md:col-span-3">
              <FormController
                label="Title (En)"
                name={`topics.${index}.title_en`}
                control={control}
                placeholder="Topic Title English"
                errors={errors}
                type="text"
              />
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
            {/* File Upload with Preview */}
            <div className="col-span-6 md:col-span-3">
              <label className="block text-sm font-medium mb-1">
                Upload Topic Image
              </label>
              <FormController
                label=""
                name={`topics.${index}.file`}
                control={control}
                errors={errors}
                type="file"
              />
            </div>
          </div>
          {/* Question Component (Handles Loop for Questions) */}
          <div className="col-span-6">
            <QuestionComponent
              topicIndex={index}
              control={control}
              errors={errors}
            />
          </div>
        </div>
      ))}

      {/* Add Topic Button */}
      <Button
        type="button"
        onClick={() =>
          addTopic({
            title_ar: "",
            title_en: "",
            content: "",
            questions: [{ text: "" }],
          })
        }
        className="bg-green-500 mt-4"
      >
        Add Topic
      </Button>
    </div>
  );
}

export default TopicComponent;
