import { useState, useEffect } from "react";
import Select from "react-select";
import { GetStudentsExamsSubjects } from "@/api/services/student.services";

const StudentSubjectSelect = ({
  name,
  defaultValue,
  onChange,
}) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedValue, setSelectedValue] = useState(defaultValue || null);

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      const response = await GetStudentsExamsSubjects();
      setSubjects(response?.data?.Data || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Map subjects to react-select options
  const gradeOptions = subjects.map((subject) => ({
    label: subject?.NameEn,
    value: subject?.Id,
  }));

  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption?.value : null;
    setSelectedValue(value);
    if (onChange) onChange(value); // Pass value to parent if needed
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
          placeholder="Subject..."
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </div>
    </div>
  );
};

export default StudentSubjectSelect;
