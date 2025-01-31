/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import apiInstance from "@/api/axiosInstance";
import { useSchoolSearch } from "@/hooks/useSchoolSearch";
import { useGradeSearch } from "@/hooks/useGradesSearch";
import { useLevelSearch } from "@/hooks/usseLevelsSearch";
import { EQuestionType } from "@/api/adminApis";
import MainForm from "./main-form";
import QuestionsSection from "./questions-section";
import { Question } from "./types";

const AddModelExamPage: React.FC = () => {
  const [formData, setFormData] = useState({
    NameAr: "",
    NameEn: "",
    piece: "",
    Skill: 0,
    SubjectId: "",
    GradeId: "",
    LevelId: "",
    IsActive: true,
  });

  const [questions, setQuestions] = useState<Question[] | any[]>([
    {
      ContentQuestion: "",
      File: "",
      Importance: false,
      QuestionType: EQuestionType.MCQ,
      Score: 0,
      RelatedQuestions: [
        {
          ContentQuestion: "",
          File: "",
          Importance: false,
          QuestionType: EQuestionType.MCQ,
          Score: 0,
          Answers: [{ Answer: "", IsCorrect: false, File: "" }],
        },
      ],
      Answers: [{ Answer: "", IsCorrect: false, File: "" }],
    },
  ]);

  const handleFormChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1); // Remove question at the specified index
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    try {
      const sanitizedFormData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined
        )
      );

      const sanitizedQuestions = questions.map((question) => ({
        ...Object.fromEntries(
          Object.entries(question).filter(
            ([_, value]) =>
              value !== "" && value !== null && value !== undefined
          )
        ),
        RelatedQuestions: question.RelatedQuestions?.map(
          (relatedQuestion: {
            [s: string]: unknown;
            Answers?: { Answer: string; IsCorrect: boolean; File: string }[];
          }) => ({
            ...Object.fromEntries(
              Object.entries(relatedQuestion).filter(
                ([_, value]) =>
                  value !== "" && value !== null && value !== undefined
              )
            ),
            Answers: relatedQuestion.Answers?.filter(
              (answer: {
                Answer: string | null | undefined;
                IsCorrect: any;
                File: any;
              }) =>
                answer.Answer !== "" &&
                answer.Answer !== null &&
                answer.Answer !== undefined &&
                (answer.IsCorrect || answer.File)
            ),
          })
        ),
        Answers: question.Answers?.filter(
          (answer: {
            Answer: string | null | undefined;
            IsCorrect: any;
            File: any;
          }) =>
            answer.Answer !== "" &&
            answer.Answer !== null &&
            answer.Answer !== undefined &&
            (answer.IsCorrect || answer.File)
        ),
      }));

      const payload = { ...sanitizedFormData, Questions: sanitizedQuestions };

      console.log(payload, "payload");
      return;
      const response = await apiInstance.post("/ModelExam/Add", payload);
      console.log("Model Exam added successfully:", response.data);
      alert("Model Exam added successfully!");

      setFormData({
        NameAr: "",
        NameEn: "",
        piece: "",
        Skill: 0,
        SubjectId: "",
        GradeId: "",
        LevelId: "",
        IsActive: true,
      });
      setQuestions([
        {
          ContentQuestion: "",
          File: "",
          Importance: false,
          QuestionType: EQuestionType.MCQ,
          Score: 0,
          RelatedQuestions: [
            {
              ContentQuestion: "",
              File: "",
              Importance: false,
              QuestionType: EQuestionType.MCQ,
              Score: 0,
              Answers: [{ Answer: "", IsCorrect: false, File: "" }],
            },
          ],
          Answers: [{ Answer: "", IsCorrect: false, File: "" }],
        },
      ]);
    } catch (error) {
      console.error("Error adding model exam:", error);
      alert("Failed to add model exam.");
    }
  };

  const isFormValid = () => {
    // Check if all main form fields are filled
    const isMainFormValid = Object.values(formData).every(
      (value) => value !== "" && value !== null && value !== undefined
    );

    // Check if there is at least one question
    const isQuestionsValid = questions.length > 0;

    return isMainFormValid && isQuestionsValid;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add Model Exam</h1>
      <MainForm
        formData={formData}
        onChange={handleFormChange}
        useSchoolSearch={useSchoolSearch}
        useGradeSearch={useGradeSearch}
        useLevelSearch={useLevelSearch}
      />
      <QuestionsSection
        questions={questions}
        setQuestions={setQuestions}
        onChange={handleQuestionChange}
        onRemove={handleRemoveQuestion} // Pass the remove handler
      />

      <Button
        onClick={handleSubmit}
        className="bg-blue-500 mt-4 ml-3"
        disabled={!isFormValid()}
      >
        Submit Model Exam
      </Button>
    </div>
  );
};

export default AddModelExamPage;
