//import axios from "axios";
import apiInstance from "../axiosInstance";

// School
export const GetSchools = (payload = {}) =>
  apiInstance.post(`/School/Search`, payload);
