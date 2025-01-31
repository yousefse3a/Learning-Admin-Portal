/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import apiInstance from "@/api/axiosInstance";
import { useSchoolSearch } from "@/hooks/useSchoolSearch";
import { useGradeSearch } from "@/hooks/useGradesSearch";
import { useLevelSearch } from "@/hooks/usseLevelsSearch";
//import { EQuestionType } from "@/api/adminApis";
import MainForm from "./main-form";
import QuestionsSection from "./questions-section";
import { Topic } from "./types";
import { useParams } from "react-router-dom";
import Images from "@/assets/images/Images";
import { toast } from "react-toastify";

const EditModelExamPage: React.FC = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    NameAr: "",
    NameEn: "",
    //piece: "",
    Skill: 0,
    SubjectId: "",
    GradeId: "",
    LevelId: "",
    IsActive: true,
    NumberOfMandatoryQuestions: 0,
  });

  const [topics, setTopics] = useState<Topic[] | any[]>([
    {
      TitleAr: "",
      TitleEn: "",
      File: "",
      TopicContent: "",
      Questions: [
        {
          ContentQuestion: "",
          File: "",
          QuestionType: 0,
          DisplayOrder: 0,
          Score: 0,
          Answers: [{ Answer: "", IsCorrect: false }],
        },
      ],
    },
  ]);

  const handleFormChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleTopicChange = (index: number, field: string, value: any) => {
    const updatedTopics = [...topics];
    updatedTopics[index][field] = value;
    setTopics(updatedTopics);
  };

  const handleRemoveTopic = (index: number) => {
    const updatedTopics = [...topics];
    updatedTopics.splice(index, 1); // Remove question at the specified index
    setTopics(updatedTopics);
  };

  const prepareAddModalExamFormData = (values) => {
    const formData = new FormData();
    const appendIfDefined = (key, value) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    };

    formData.append("Id", id);
    formData.append("NameAr", values.NameAr);
    formData.append("NameEn", values.NameEn);
    //formData.append("piece", values.piece);
    formData.append("Skill", values.Skill);
    formData.append("SubjectId", values.SubjectId);
    formData.append("GradeId", values.GradeId);
    appendIfDefined("LevelId", values.LevelId);
    formData.append("IsActive", values.IsActive);
    appendIfDefined(
      "NumberOfMandatoryQuestions",
      values.NumberOfMandatoryQuestions
    );
    if (Array.isArray(values.Topics) && values.Topics.length > 0) {
      const topics = values.Topics;
      topics.map((topic: Topic, tIndex: number) => {
        formData.append(`Topics[${tIndex}].TitleAr`, topic.TitleAr);
        formData.append(`Topics[${tIndex}].TitleEn`, topic.TitleEn);
        if (topic?.File && typeof topic.File === "object") {
          formData.append(`Topics[${tIndex}].File`, topic.File);
        }
        formData.append(`Topics[${tIndex}].TopicContent`, topic.TopicContent);
        const topicQuestions = topic.Questions;
        if (Array.isArray(topicQuestions) && topicQuestions.length > 0) {
          topicQuestions.map((question, qIndex: number) => {
            formData.append(
              `Topics[${tIndex}].Questions[${qIndex}].ContentQuestion`,
              question.ContentQuestion
            );
            if (question?.File && typeof question.File === "object") {
              formData.append(
                `Topics[${tIndex}].Questions[${qIndex}].File`,
                question.File
              );
            }
            formData.append(
              `Topics[${tIndex}].Questions[${qIndex}].QuestionType`,
              question.QuestionType
            );
            formData.append(
              `Topics[${tIndex}].Questions[${qIndex}].DisplayOrder`,
              qIndex + 1
            );
            formData.append(
              `Topics[${tIndex}].Questions[${qIndex}].Score`,
              question.Score
            );
            const quesitonAnswers = question.Answers;
            if (Array.isArray(quesitonAnswers) && quesitonAnswers.length > 0) {
              quesitonAnswers.map((answer, index) => {
                formData.append(
                  `Topics[${tIndex}].Questions[${qIndex}].Answers[${index}].Answer`,
                  answer.Answer
                );
                formData.append(
                  `Topics[${tIndex}].Questions[${qIndex}].Answers[${index}].IsCorrect`,
                  answer.IsCorrect
                );
              });
            }
          });
        }
      });
    }
    return formData;
  };

  const handleSubmit = async () => {
    try {
      const sanitizedFormData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined
        )
      );

      const sanitizedTopics = topics.map((topic) => ({
        ...Object.fromEntries(
          Object.entries(topic).filter(
            ([_, value]) =>
              value !== "" && value !== null && value !== undefined
          )
        ),
        Questions: topic.Questions?.map(
          (qeustion: {
            [s: string]: unknown;
            Answers?: { Answer: string; IsCorrect: boolean; File: string }[];
          }) => ({
            ...Object.fromEntries(
              Object.entries(qeustion).filter(
                ([_, value]) =>
                  value !== "" && value !== null && value !== undefined
              )
            ),
            Answers: qeustion.Answers?.filter(
              (answer: {
                Answer: string | null | undefined;
                IsCorrect: any;
                File: any;
              }) =>
                answer.Answer !== "" &&
                answer.Answer !== null &&
                answer.Answer !== undefined
            ),
          })
        ),
      }));

      const payload = { ...sanitizedFormData, Topics: sanitizedTopics };
      const formDataPayload = prepareAddModalExamFormData(payload);

      setIsSubmitLoading(true);

      const response = await apiInstance.put(
        "/ModelExam/Update",
        formDataPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Model Exam added successfully:", response.data);
      //alert("Model Exam added successfully!");
      toast.success("Model Exam updated successfully!");

      setFormData({
        NameAr: "",
        NameEn: "",
        //piece: "",
        Skill: 0,
        SubjectId: "",
        GradeId: "",
        LevelId: "",
        IsActive: true,
        NumberOfMandatoryQuestions: 0,
      });
      setTopics([
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
    } catch (error) {
      console.error("Error adding model exam:", error);
      alert("Failed to add model exam.");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const isFormValid = () => {
    // Check if all main form fields are filled
    const isMainFormValid = Object.values(formData).every(
      (value) => value !== "" && value !== null && value !== undefined
    );

    // Check if there is at least one question
    const isQuestionsValid = topics.length > 0;

    return isMainFormValid && isQuestionsValid;
  };

  async function getModelExamById() {
    if (!id) return;
    setIsLoading(true);

    try {
      const { data } = await apiInstance.get(`/ModelExam/GetById?Id=${id}`);
      const modalQuestionData = data?.Data;
      setFormData({
        NameAr: modalQuestionData?.NameAr,
        NameEn: modalQuestionData?.NameEn,
        //piece: modalQuestionData?.piece,
        Skill: modalQuestionData?.Skill,
        SubjectId: modalQuestionData?.SubjectId,
        GradeId: modalQuestionData?.GradeId,
        LevelId: modalQuestionData?.LevelId,
        IsActive: true,
        NumberOfMandatoryQuestions:
          modalQuestionData?.NumberOfMandatoryQuestions,
      });
      if (
        Array.isArray(modalQuestionData?.Topics) &&
        modalQuestionData?.Topics.length > 0
      ) {
        const examTopics = modalQuestionData.Topics?.map((item) => ({
          TitleAr: item.TitleAr,
          TitleEn: item.TitleEn,
          File: item.File,
          TopicContent: item.TopicContent,
          Questions: item.Questions?.map((qItem, qIndex) => ({
            ContentQuestion: qItem.ContentQuestion,
            File: qItem.File,
            QuestionType: qItem.QuestionType,
            DisplayOrder: qIndex + 1,
            Score: qItem.Score ? qItem.Score : 0,
            Answers: qItem.Answers?.map((answer) => ({
              Answer: answer.Answer,
              IsCorrect: !!answer.IsCorrect,
            })),
          })),
        }));
        setTopics(examTopics);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getModelExamById();
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Exam model</h1>
      {isLoading ? (
        <div>
          <div className="flex justify-center items-center min-h-[50vh]">
            <img className="w-[100px]" src={Images.loader_1} alt="Loading..." />
          </div>
        </div>
      ) : (
        <div>
          <MainForm
            formData={formData}
            onChange={handleFormChange}
            useSchoolSearch={useSchoolSearch}
            useGradeSearch={useGradeSearch}
            useLevelSearch={useLevelSearch}
          />
          <QuestionsSection
            topics={topics}
            setTopics={setTopics}
            onChange={handleTopicChange}
            onRemove={handleRemoveTopic} // Pass the remove handler
          />

          <Button
            onClick={handleSubmit}
            className="bg-blue-500 mt-4 ml-3"
            disabled={isSubmitLoading}
          >
            Submit Model Exam
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditModelExamPage;
