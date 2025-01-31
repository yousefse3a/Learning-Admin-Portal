//import axios from "axios";
import apiInstance from "../axiosInstance";

// All Model Exams
export const GetModelExam = (payload = {}) =>
    apiInstance.post(`/ModelExam/Search`, payload);

// Delete Exams
export const DeleteModelExams = (id: number) =>
    apiInstance.delete(`/ModelExam/Delete?Id=${id}`);