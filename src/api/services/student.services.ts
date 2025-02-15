//import axios from "axios";
import apiInstance from "../axiosInstance";

// All Students
export const GetStudents = (payload = {}) =>
  apiInstance.post(`/Student/Search`, payload);

// Add Student
export const AddStudent = (data) =>
  apiInstance.post(`/Account/StudentRegister`, data);

// // Delete Student
// export const DeleteExams = (id: number) =>
//   apiInstance.delete(`/Exam/Delete?Id=${id}`);

// Update Student
export const UpdateStudent = (data) =>
  apiInstance.put(`/Account/EditStudent`, data);

// All Students Exams
export const GetStudentsExams = (payload = {}) =>
  apiInstance.post(`/Student/GetByGroupStudent`, payload);
// Students Exams subjects
export const GetStudentsExamsSubjects = () =>
  apiInstance.get(`/Student/GetBySubject`);
// Students Exams AcademicYear
export const GetAcademicYear = () =>
  apiInstance.get(`/Student/GetAcademicYear`);
// Students Exams List
export const GetStudentsExamsList = (payload = {}) =>
  apiInstance.post(`/Student/ListExam`, payload);
