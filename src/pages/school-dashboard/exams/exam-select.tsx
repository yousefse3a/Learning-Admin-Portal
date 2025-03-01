import { useState, useEffect } from "react";
import Select from "react-select";
import { GetStudentsExamsList } from "@/api/services/student.services";

const StudentExamSelect = ({ name, defaultValue, onChange }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedValue, setSelectedValue] = useState(defaultValue || null);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // Fetch subjects
  // const fetchSubjects = async () => {
  //   try {
  //     const payload = {
  //       Keyword: searchKeyword,
  //       Page: page,
  //       Size: pageSize,
  //     };
  //     const response = await GetStudentsExamsList(payload);
  //     setSubjects(response?.data?.Data || []);
  //   } catch (error) {
  //     console.error("Error fetching subjects:", error);
  //   }
  // };
  const fetchSubjects = async () => {
    try {
      const payload = {
        Keyword: searchKeyword,
        Page: page,
        Size: pageSize,
      };
      const response = await GetStudentsExamsList(payload);
      console.log("API Response:", response); // Debugging log
      console.log("Extracted Data:", response?.data?.Data); // Debugging log
      setSubjects(
        Array.isArray(response?.data?.Data) ? response.data.Data : []
      );
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Map subjects to react-select options
  const gradeOptions = subjects?.map((subject) => ({
    label: subject?.NameEn,
    value: subject?.Id,
  }));

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption?.value : null;
    setSelectedValue(value);
    if (onChange) onChange(value);
  };

  return (
    <div className="mb-2">
      <div className="mt-2">
        <Select
          name={name}
          value={
            selectedValue
              ? {
                  value: selectedValue,
                  label: subjects.find(
                    (subject) => subject?.Id === selectedValue
                  )?.NameEn,
                }
              : null
          }
          options={gradeOptions}
          onChange={handleSelectChange}
          defaultValue={defaultValue}
          placeholder="Exam..."
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </div>
    </div>
  );
};

export default StudentExamSelect;
