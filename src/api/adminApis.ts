/**
 * const value = localStorage.getItem("profile");
 * const Profile = JSON.parse(value);
 * 
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import apiInstance from "./axiosInstance";

// Login function
export const adminLogin = async (email: string, password: string) => {
  try {
    const response = await apiInstance.post("/Account/AdminLogin", {
      email,
      password,
    });

    // Assuming the token is returned in the response data under "token"
    const { token } = response.data.Data;
    // Store the token in localStorage
    if (token) {
      localStorage.setItem("token", "Bearer " + token);
      localStorage.setItem("user", JSON.stringify(response.data.Data));
    }

    return response.data; // Assuming the response contains user data or token
  } catch (error: any) {
    throw error.response ? error.response.data : new Error("Login failed");
  }
};
export const adminSchoolLogin = async (username: string, password: string) => {
  try {
    const response = await apiInstance.post("/Account/AdminSchoolLogin", {
      UserName: username, // Updated key to UserName
      Password: password,
    });

    // Assuming the token is returned in the response data under "token"
    const { token } = response.data.Data;

    // Store the token in localStorage
    if (token) {
      localStorage.setItem("token", "Bearer " + token);
      localStorage.setItem("user", JSON.stringify(response.data.Data));
    }

    return response.data; // Assuming the response contains user data or token
  } catch (error: any) {
    throw error.response ? error.response.data : new Error("Login failed");
  }
};

export const registerAccount = async (data: {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: number;
}) => {
  try {
    const payload: any = {
      Name: data.name,
      Phone: data.phone,
      Email: data.email,
      Gender: data.gender,
    };

    // Conditionally include BirthDate
    if (data.birthDate) {
      payload.BirthDate = data.birthDate;
    }

    const response = await apiInstance.post("/Account/Register", payload);
    return response.data; // Return the successful response data
  } catch (error: any) {
    throw error.response?.data || new Error("Registration failed"); // Handle the error
  }
};

export const updateAccount = async (data: {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: number;
  note?: string; // Optional field for notes
}) => {
  try {
    const payload: any = {
      Id: data.id, // Include the ID for identifying the account
      Name: data.name,
      Phone: data.phone,
      Email: data.email,
      Gender: data.gender,
    };

    // Conditionally include BirthDate
    if (data.birthDate) {
      payload.BirthDate = data.birthDate;
    }

    // Conditionally include Note
    if (data.note) {
      payload.Note = data.note;
    }

    const response = await apiInstance.put("/Account/Edit", payload);
    return response.data; // Return the successful response data
  } catch (error: any) {
    throw error.response?.data || new Error("Update failed"); // Handle the error
  }
};

// Register new School Admin
export const registerSchoolAdmin = async (data: {
  SchoolId: string;
  Name: string;
  Phone: string;
  Email: string;
  Gender: number;
  Password: string;
}) => {
  try {
    const response = await apiInstance.post(
      "/Account/AdminSchoolRegister",
      data
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Registration failed");
  }
};

// Get all school admins with type = 3
export const getAllSchoolAdmins = async () => {
  try {
    const response = await apiInstance.post("/Account/Search", {
      Type: 3,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to fetch school admins");
  }
};

export const addFileStudent = async (
  schoolId: string,
  studentFile: File,
  gradeId?: string
) => {
  try {
    // Create a FormData object to hold the file and other parameters
    const formData = new FormData();
    formData.append("StudentFile", studentFile); // Add the file to the form data

    // Make the POST request with the form data and query parameters
    const response = await apiInstance.post(
      `/Account/AddFileStudent`,
      formData,
      {
        params: {
          GradeId: gradeId, // Query parameter GradeId
          SchoolId: schoolId, // Query parameter SchoolId
        },
        responseType: "blob", // Important: Set the response type to 'blob' for binary data
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the correct content type is set
        },
      }
    );

    // Create a blob from the response data
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    // Create a download link for the blob
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;

    // Get the filename from the response headers if available, or use a default name
    const filename =
      response.headers["content-disposition"]
        ?.split("filename=")[1]
        ?.replace(/['"]/g, "") || "download.xlsx";
    link.download = filename;

    // Programmatically click the link to trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up and remove the link element
    link.remove();

    return response.data; // Return the response data (optional)
  } catch (error: any) {
    throw error.response?.data || new Error("File upload failed");
  }
};

export const downloadStudentsFile = async (
  gradeId: string,
  schoolId: string
) => {
  try {
    // Send the POST request to download the file with the specified GradeId and SchoolId
    const response = await apiInstance.post(
      `/Account/DownloadStudentsFile`,
      { GradeId: gradeId, SchoolId: schoolId }, // Request body containing GradeId and SchoolId
      {
        responseType: "blob", // Set the response type to 'blob' to handle binary data
      }
    );

    // Create a blob from the response data
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    // Create a download link for the blob
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;

    // Get the filename from the response headers if available, or use a default name
    const filename =
      response.headers["content-disposition"]
        ?.split("filename=")[1]
        ?.replace(/['"]/g, "") || "students_file.xlsx";
    link.download = filename;

    // Programmatically click the link to trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up and remove the link element
    link.remove();

    return response.data; // Return the response data (optional)
  } catch (error: any) {
    console.error("Failed to download the file", error);
    throw error.response?.data || new Error("File download failed");
  }
};
export const downloadTemplate = async () => {
  try {
    // Send a GET request to download the template
    const response = await apiInstance.get(`/Account/DownloadTemplate`, {
      responseType: "blob", // Set the response type to 'blob' to handle binary data
    });

    // Create a blob from the response data
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    // Create a download link for the blob
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;

    // Get the filename from the response headers if available, or use a default name
    const filename =
      response.headers["content-disposition"]
        ?.split("filename=")[1]
        ?.replace(/['"]/g, "") || "template.xlsx";
    link.download = filename;

    // Programmatically click the link to trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up and remove the link element
    link.remove();

    return response.data; // Return the response data (optional)
  } catch (error: any) {
    console.error("Failed to download the template", error);
    throw error.response?.data || new Error("Template download failed");
  }
};
export const uploadStudentFile = async (formData: FormData) => {
  try {
    // Send a POST request to upload the student file
    const response = await apiInstance.post(
      `/Account/AddFileStudent`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the correct content type
        },
      }
    );

    console.log("File uploaded successfully:", response.data);
    return response.data; // Return the response data
  } catch (error: any) {
    console.error("Failed to upload the file", error);
    throw error.response?.data || new Error("File upload failed");
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await apiInstance.delete(`/Account/Delete`, {
      params: {
        UserId: userId,
      },
    });
    return response.data; // Assuming success data is returned here
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to delete user");
  }
};

export const getAllUsers = async (
  type: number,
  page = 1,
  size = 20,
  keyword = "",
  sortField?: string,
  sortOrder?: number,
  filters?: Array<{
    columnName: string;
    filterValue: string;
    filterOption: number;
  }>
) => {
  try {
    const requestBody: any = {
      Type: type, // User type (e.g., SuperAdmin, Admin)
      Page: page, // Page number for pagination
      Size: size, // Number of results per page
      Keyword: keyword, // Search keyword for filtering (e.g., user email or name)
    };

    // Add SortObj if sortField and sortOrder are provided
    if (sortField && sortOrder !== undefined) {
      requestBody.SortObj = {
        FieldName: sortField,
        SortOrder: sortOrder,
      };
    }

    // Add FilterParams if filters are provided
    if (filters && filters.length > 0) {
      requestBody.FilterParams = filters.map(
        ({ columnName, filterValue, filterOption }) => ({
          ColumnName: columnName,
          FilterValue: filterValue,
          FilterOption: filterOption,
        })
      );
    }

    const response = await apiInstance.post("/Account/Search", requestBody);

    return response.data; // Return the successful response data containing the list of users
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to fetch users");
  }
};

export const registerStudent = async (data: {
  StudentName: string;
  Name: string;
  Email: string;
  Phone: string;
  Religion: string;
  StateOfMind: string;
  GradeId: string;
  SchoolId: string;
  SchoolName: string;
  Password: string;
  Gender: number;
  Address: string;
  StudentCode: string;
  LevelId: string;
}) => {
  try {
    const response = await apiInstance.post("/Account/StudentRegister", data);
    return response.data; // Return the response data on success
  } catch (error: any) {
    throw error.response?.data || new Error("Student registration failed");
  }
};
export const updateStudent = async (data: {
  Id: string;
  StudentName: string;
  Name: string;
  Email: string;
  GenderId: number;
  StudentCode: string;
  GradeId: string;
  LevelId: string;
  SchoolId: string;
}) => {
  try {
    const response = await apiInstance.put("/Account/EditStudent", data);
    return response.data; // Return the response data on success
  } catch (error: any) {
    throw error.response?.data || new Error("Student update failed");
  }
};

//Schools APIs

export const addSchool = async (data: {
  NameAr: string;
  NameEn: string;
  IsActive: boolean; // New property added
}) => {
  try {
    const response = await apiInstance.post("/School/Add", data);
    return response.data; // Return the successful response data
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to add school");
  }
};

export const updateSchool = async (data: {
  Id: string;
  NameAr: string;
  NameEn: string;
  IsActive: boolean; // New property added
}) => {
  try {
    const response = await apiInstance.put("/School/Update", data);
    return response.data; // Return the successful response data
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to update school");
  }
};

export const deleteSchool = async (schoolId: string) => {
  try {
    const response = await apiInstance.delete("/School/Delete", {
      params: { Id: schoolId },
    });
    return response.data; // Assuming success data is returned here
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to delete school");
  }
};

export const searchSchools = async (
  keyword: string = "",
  page: number = 1,
  size: number = 20,
  sortField: string | null = null, // Optional: field to sort by
  sortOrder: number | null = null, // Optional: sort order (1 for ascending, -1 for descending)
  filters: { field: string; value: string }[] = [] // Optional: array of filters
) => {
  try {
    const requestBody: any = {
      keyword, // The keyword to search for schools
      page, // Page number for pagination
      size, // Page size for pagination
    };

    // Add sort object if sortField and sortOrder are provided
    if (sortField && sortOrder !== null) {
      requestBody.sortObj = {
        FieldName: sortField,
        SortOrder: sortOrder,
      };
    }

    // Add filters if provided
    if (filters.length > 0) {
      requestBody.filterParams = filters.map((filter) => ({
        ColumnName: filter.field,
        FilterValue: filter.value,
      }));
    }

    const response = await apiInstance.post("/School/Search", requestBody);
    return response.data; // Return the response data containing the search results
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to search for schools");
  }
};

// Add a grade
export const addGrade = async (data: {
  NameAr: string;
  NameEn: string;
  IsActive: boolean; // Added IsActive
}) => {
  try {
    const response = await apiInstance.post("/Grade/Add", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to add grade");
  }
};

// Update an existing grade
export const updateGrade = async (data: {
  Id: string;
  NameAr: string;
  NameEn: string;
  IsActive: boolean; // Added IsActive
}) => {
  try {
    const response = await apiInstance.put("/Grade/Update", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to update grade");
  }
};

// Delete a grade by ID
export const deleteGrade = async (id: string) => {
  try {
    const response = await apiInstance.delete("/Grade/Delete", {
      params: { id },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to delete grade");
  }
};

// Get grade by ID
export const getGradeById = async (id: string) => {
  try {
    const response = await apiInstance.get(`/Grade/GetById`, {
      params: { id },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to fetch grade by ID");
  }
};

// Search for grades
export const searchGrades = async (
  keyword: string = "",
  page: number = 1,
  size: number = 20,
  sortField: string | null = null, // Optional: field to sort by
  sortOrder: number | null = null, // Optional: sort order (1 for ascending, -1 for descending)
  filters: { field: string; value: string }[] = [] // Optional: array of filters
) => {
  try {
    const requestBody: any = {
      keyword, // The keyword to search for grades
      page, // Page number for pagination
      size, // Page size for pagination
    };

    // Add sort object if sortField and sortOrder are provided
    if (sortField && sortOrder !== null) {
      requestBody.sortObj = {
        FieldName: sortField,
        SortOrder: sortOrder,
      };
    }

    // Add filters if provided
    if (filters.length > 0) {
      requestBody.filterParams = filters.map((filter) => ({
        ColumnName: filter.field,
        FilterValue: filter.value,
      }));
    }

    const response = await apiInstance.post("/Grade/Search", requestBody);
    return response.data; // Return the response data containing the search results
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to search for grades");
  }
};

// Levels APIs
// Search Levels with sorting, pagination, and filters
export const searchLevels = async (
  keyword: string = "",
  page: number = 1,
  size: number = 20,
  sortField: string | null = null,
  sortOrder: number | null = null,
  filters: { field: string; value: string }[] = []
) => {
  try {
    const requestBody: any = {
      keyword,
      page,
      size,
    };

    if (sortField && sortOrder !== null) {
      requestBody.sortObj = {
        FieldName: sortField,
        SortOrder: sortOrder,
      };
    }

    if (filters.length > 0) {
      requestBody.filterParams = filters.map((filter) => ({
        ColumnName: filter.field,
        FilterValue: filter.value,
      }));
    }

    const response = await apiInstance.post("/Level/Search", requestBody);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to search for levels");
  }
};

// Add a new Level
export const addLevel = async (data: {
  NameAr: string;
  NameEn: string;
  IsActive: boolean;
}) => {
  try {
    const response = await apiInstance.post("/Level/Add", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to add level");
  }
};

// Update an existing Level
export const updateLevel = async (data: {
  Id: string;
  NameAr: string;
  NameEn: string;
  IsActive: boolean;
}) => {
  try {
    const response = await apiInstance.put("/Level/Update", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to update level");
  }
};

// Delete a Level by ID
export const deleteLevel = async (id: string) => {
  try {
    const response = await apiInstance.delete("/Level/Delete", {
      params: { Id: id },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to delete level");
  }
};

// Subject APIs

// Search subjects with sorting, pagination, and filtering
export const searchSubjects = async (
  keyword: string = "",
  page: number = 1,
  size: number = 20,
  sortField: string | null = null,
  sortOrder: number | null = null,
  filters: { field: string; value: string }[] = []
) => {
  try {
    const requestBody: any = {
      keyword,
      page,
      size,
    };

    if (sortField && sortOrder !== null) {
      requestBody.sortObj = {
        FieldName: sortField,
        SortOrder: sortOrder,
      };
    }

    if (filters.length > 0) {
      requestBody.filterParams = filters.map((filter) => ({
        ColumnName: filter.field,
        FilterValue: filter.value,
      }));
    }

    const response = await apiInstance.post("/Subject/Search", requestBody);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to search for subjects");
  }
};

// Add a new subject
export const addSubject = async (data: {
  NameAr: string;
  NameEn: string;
  IsActive: boolean;
}) => {
  try {
    const response = await apiInstance.post("/Subject/Add", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to add subject");
  }
};

// Update an existing subject
export const updateSubject = async (data: {
  Id: string;
  NameAr: string;
  NameEn: string;
  IsActive: boolean;
}) => {
  try {
    const response = await apiInstance.put("/Subject/Update", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to update subject");
  }
};

// Delete a subject by ID
export const deleteSubject = async (id: string) => {
  try {
    const response = await apiInstance.delete(`/Subject/Delete`, {
      params: { Id: id },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to delete subject");
  }
};

export const updateUserProfile = async (data: FormData) => {
  try {
    const response = await apiInstance.post(
      "/Account/UpdateUserProfile",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Set content type
        },
      }
    );
    return response.data; // Return the response data on success
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to update user profile");
  }
};

export const changePassword = async (data: {
  CurrentPassword: string;
  NewPassword: string;
  ConfirmPassword: string;
}) => {
  try {
    const response = await apiInstance.put("/Account/ChangePassword", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to change password");
  }
};

// question APIs
export const addQuestions = async (
  data: Array<{
    ContentQuestion: string;
    File?: string;
    Importance: boolean;
    QuestionType: number; // Use the EQuestionType enum for clarity
    Score: number;
    Answers: Array<{
      Answer: string;
      IsCorrect: boolean;
      File?: string;
    }>;
  }>
) => {
  try {
    const response = await apiInstance.post("/Questions/AddQuestions", data);
    return response.data; // Return the successful response data
  } catch (error: any) {
    throw error.response?.data || new Error("Failed to add questions");
  }
};
export enum EQuestionType {
  MCQ = 1,
  Writing = 2,
  Matching = 3,
  Drag = 4,
  Complete = 5,
  CheckBox = 6,
}

export enum Skills {
  Reading = 1,
  Writing = 3,
  Listening = 2,
  Speaking = 4,
}
