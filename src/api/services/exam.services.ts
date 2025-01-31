//import axios from "axios";
import apiInstance from "../axiosInstance";

// All Exams
export const GetExams = (payload = {}) =>
  apiInstance.post(`/Exam/Search`, payload);

// SubjectId
export const GetSubject = (payload = {}) =>
  apiInstance.post(`/Subject/Search`, payload);

// GradeId
export const GetGrade = (payload = {}) =>
  apiInstance.post(`/Grade/Search`, payload);

// Level
export const GetLevel = (payload = {}) =>
  apiInstance.post(`/Level/Search`, payload);

// ModelExam
export const GetModelExam = (payload = {}) =>
  apiInstance.post(`/ModelExam/Search`, payload);

// Add Exams
export const AddExam = (data) =>
  apiInstance.post(`/Exam/Add`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Delete Exams
export const DeleteExams = (id: number) =>
  apiInstance.delete(`/Exam/Delete?Id=${id}`);

// Get Exams By Id
export const GetExamById = (id: number) =>
  apiInstance.get(`/Exam/GetById?Id=${id}`);

// Update Exams
export const UpdateExams = (data) =>
  apiInstance.put(`/Exam/Update`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
