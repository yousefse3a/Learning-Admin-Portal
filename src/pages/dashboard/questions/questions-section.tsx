/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EQuestionType } from "@/api/adminApis";

const QuestionsSection: React.FC<{
  topics: any[];
  setTopics: (topics: any[]) => void;
  onChange: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
}> = ({ topics, setTopics, onChange, onRemove }) => {
  const handleAddTopic = () => {
    setTopics([
      ...topics,
      {
        TitleAr: "string",
        TitleEn: "string",
        File: "string",
        TopicContent: "string",
        Questions: [
          {
            ContentQuestion: "string",
            File: "string",
            QuestionType: 0,
            DisplayOrder: 0,
            Score: 0,
            Answers: [{ Answer: "", IsCorrect: false }],
          },
        ],
      },
    ]);
  };

  const handleAddQuestion = (tIndex: number) => {
    const updatedTopics = [...topics];
    console.log(updatedTopics);
    updatedTopics[tIndex].Questions.push({
      ContentQuestion: "string",
      File: "string",
      QuestionType: 0,
      DisplayOrder: 0,
      Score: 0,
      Answers: [{ Answer: "", IsCorrect: false }],
    });
    setTopics(updatedTopics);
  };

  const handleAddAnswer = (tIndex: number, qIndex: number) => {
    const updatedTopics = [...topics];
    updatedTopics[tIndex].Questions[qIndex].Answers.push({
      Answer: "",
      IsCorrect: false,
      File: "",
    });
    setTopics(updatedTopics);
  };

  const handleQuestionChange = (
    tIndex: number,
    qIndex: number,
    field: string,
    value: any
  ) => {
    const updatedTopics = [...topics];
    updatedTopics[tIndex].Questions[qIndex][field] = value;
    setTopics(updatedTopics);
  };

  const handleQuestionRemove = (tIndex: number, qIndex: number) => {
    const updatedTopics = [...topics];
    updatedTopics[tIndex].Questions.splice(qIndex, 1); // Remove question at the specified index
    setTopics(updatedTopics);
  };

  const handleAnswerChange = (
    tIndex: number,
    qIndex: number,
    aIndex: number,
    field: string,
    value: any
  ) => {
    const updatedTopics = [...topics];
    updatedTopics[tIndex].Questions[qIndex].Answers[aIndex][field] = value;
    setTopics(updatedTopics);
  };

  const topicFieldConfig = [
    {
      name: "TitleAr",
      label: "Title (Ar)",
      type: "text",
      placeholder: "Enter Question title Ar",
    },
    {
      name: "TitleEn",
      label: "Title (En)",
      type: "text",
      placeholder: "Enter Question title En",
    },
    {
      name: "File",
      label: "File",
      type: "file",
    },
    {
      name: "TopicContent",
      label: "Topic Content",
      type: "text",
      placeholder: "Enter Topic Content",
    },
  ];

  const questionType = Object.entries(EQuestionType).filter(
    ([_, value]) => typeof value === "number"
  );

  const questionFieldConfig = [
    {
      name: "QuestionType",
      label: "Question Type",
      type: "select",
      options: questionType.map(([key, value]) => ({
        id: value,
        name: key,
      })),
    },
    {
      name: "Score",
      label: "Score",
      type: "number",
      placeholder: "Enter Score",
    },
    {
      name: "ContentQuestion",
      label: "Question Content",
      type: "text",
      placeholder: "Enter Question Content",
    },
    {
      name: "File",
      label: "File",
      type: "file",
    },
  ];

  const answerFieldConfig = [
    {
      name: "Answer",
      label: "Answer Content",
      type: "text",
      placeholder: "Enter Answer Content",
    },
    {
      name: "IsCorrect",
      label: "Is Correct",
      type: "checkbox",
    },
  ];

  return (
    <>
      {topics.map((topic, tIndex) => (
        <div key={tIndex} className="border p-4 mb-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Topic {tIndex + 1}</h2>
            <Button onClick={() => onRemove(tIndex)} className="bg-red-500">
              Remove Topic
            </Button>
          </div>
          <div className="grid grid-cols-6 gap-4">
            {topicFieldConfig.map((field) => (
              <div key={field.name} className="col-span-6 md:col-span-3">
                <label className="block text-sm font-medium mb-2">
                  {field.label}
                </label>
                {field.type === "file" ? (
                  <input
                    type="file"
                    onChange={(e) =>
                      onChange(tIndex, field.name, e.target.files?.[0] || "")
                    }
                  />
                ) : (
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={topic[field.name]}
                    onChange={(e) =>
                      onChange(tIndex, field.name, e.target.value)
                    }
                  />
                )}
              </div>
            ))}
          </div>
          {topic?.Questions.map((question: any, qIndex: number) => {
            return (
              <div key={qIndex} className="border p-4 my-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold">Question {qIndex + 1}</h2>
                  <Button
                    onClick={() => handleQuestionRemove(tIndex, qIndex)}
                    className="bg-red-500"
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid grid-cols-6 gap-4">
                  {questionFieldConfig.map((field) => {
                    if (
                      field.type === "file" &&
                      (question.QuestionType === EQuestionType.MCQ ||
                        question.QuestionType === EQuestionType.Drag ||
                        question.QuestionType === EQuestionType.Matching ||
                        question.QuestionType === EQuestionType.Complete)
                    ) {
                      return null; // Skip rendering the file input for MCQ questions
                    }
                    return (
                      <div
                        key={field.name}
                        className="col-span-6 md:col-span-3"
                      >
                        <label className="block text-sm font-medium mb-2">
                          {field.label}
                        </label>
                        {field.type === "select" ? (
                          <select
                            value={question[field.name]}
                            onChange={(e) => {
                              localStorage?.setItem(
                                "QuestionType",
                                e.target.value
                              );

                              handleQuestionChange(
                                tIndex,
                                qIndex,
                                field.name,
                                Number(e.target.value)
                              );
                            }}
                            className="w-full p-2 border rounded"
                          >
                            <option value="">Select {field.label}</option>
                            {field.options?.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        ) : field.type === "checkbox" ? (
                          <input
                            type="checkbox"
                            checked={question[field.name]}
                            onChange={(e) =>
                              handleQuestionChange(
                                tIndex,
                                qIndex,
                                field.name,
                                e.target.checked
                              )
                            }
                          />
                        ) : field.type === "file" ? (
                          <input
                            type="file"
                            onChange={(e) =>
                              handleQuestionChange(
                                tIndex,
                                qIndex,
                                field.name,
                                e.target.files?.[0] || ""
                              )
                            }
                          />
                        ) : (
                          <Input
                            type={field.type}
                            placeholder={field.placeholder}
                            value={question[field.name]}
                            onChange={(e) =>
                              handleQuestionChange(
                                tIndex,
                                qIndex,
                                field.name,
                                e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Answers Section */}
                <div className="mt-6">
                  {!question.QuestionType ||
                    (question.QuestionType !== EQuestionType.Writing && (
                      <>
                        <h3 className="font-medium mb-4">Answers</h3>
                        {question.Answers.map((answer: any, aIndex: number) => (
                          <div
                            key={aIndex}
                            className="border p-2 mb-4 rounded-lg"
                          >
                            <div className="grid grid-cols-6 gap-4">
                              {answerFieldConfig.map((field) => (
                                <div
                                  key={field.name}
                                  className="col-span-6 md:col-span-3"
                                >
                                  <label className="block text-sm font-medium mb-1">
                                    {field.label}
                                  </label>
                                  {field.type === "checkbox" &&
                                  !(
                                    // Hide checkbox for MCQ, Drag, Matching, Complete
                                    (
                                      question.QuestionType ===
                                        EQuestionType.MCQ ||
                                      question.QuestionType ===
                                        EQuestionType.Drag ||
                                      question.QuestionType ===
                                        EQuestionType.Matching ||
                                      question.QuestionType ===
                                        EQuestionType.Complete
                                    )
                                  ) ? (
                                    <input
                                      type="checkbox"
                                      checked={answer[field.name]}
                                      onChange={(e) =>
                                        handleAnswerChange(
                                          tIndex,
                                          qIndex,
                                          aIndex,
                                          field.name,
                                          e.target.checked
                                        )
                                      }
                                    />
                                  ) : question.QuestionType ===
                                      EQuestionType.MCQ ||
                                    question.QuestionType ===
                                      EQuestionType.Drag ||
                                    question.QuestionType ===
                                      EQuestionType.Matching ||
                                    question.QuestionType ===
                                      EQuestionType.Complete ? (
                                    <Input
                                      type="number"
                                      value={answer[field.name]}
                                      onChange={(e) =>
                                        handleAnswerChange(
                                          tIndex,
                                          qIndex,
                                          aIndex,
                                          field.name,
                                          e.target.value
                                        )
                                      }
                                      placeholder="Enter a number"
                                    />
                                  ) : field.type === "file" ? (
                                    <input
                                      type="file"
                                      onChange={(e) =>
                                        handleAnswerChange(
                                          tIndex,
                                          qIndex,
                                          aIndex,
                                          field.name,
                                          e.target.files?.[0] || ""
                                        )
                                      }
                                    />
                                  ) : (
                                    <Input
                                      type={field.type}
                                      placeholder={field.placeholder}
                                      value={answer[field.name]}
                                      onChange={(e) =>
                                        handleAnswerChange(
                                          tIndex,
                                          qIndex,
                                          aIndex,
                                          field.name,
                                          e.target.value
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        <Button
                          onClick={() => handleAddAnswer(tIndex, qIndex)}
                          className="bg-purple-500 mt-2"
                        >
                          Add Answer
                        </Button>
                      </>
                    ))}
                </div>
              </div>
            );
          })}
          <Button
            onClick={() => handleAddQuestion(tIndex)}
            className="bg-green-500 mt-4"
          >
            Add Question
          </Button>
        </div>
      ))}
      <Button onClick={handleAddTopic} className="bg-green-500 mt-4">
        Add Topic
      </Button>
    </>
  );
};

export default QuestionsSection;
