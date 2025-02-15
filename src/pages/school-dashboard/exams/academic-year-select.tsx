import { useState, useEffect } from "react";
import Select from "react-select";
import { GetAcademicYear } from "@/api/services/student.services";

const AcademicYearSelect = ({
  name,
  defaultValue,
  onChange,
}) => {
  const [years, setYears] = useState([]);
  const [selectedValue, setSelectedValue] = useState(defaultValue || null);

  // Fetch academic year
  const fetchAcademicYear = async () => {
    try {
      const response = await GetAcademicYear();
      setYears(response?.data.Data || []);
    } catch (error) {
      console.error("Error fetching academic year:", error);
    }
  };

  useEffect(() => {
    fetchAcademicYear();
  }, []);

  // Map subjects to react-select options
  const gradeOptions = years.map((year) => ({
    label: year?.Name,
    value: year?.Id,
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
                  label: years.find(
                    (year) => year?.Id === selectedValue
                  )?.Name,
                }
              : null
          }
          options={gradeOptions}
          onChange={handleSelectChange}
          defaultValue={defaultValue}
          placeholder="Academic year..."
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </div>
    </div>
  );
};

export default AcademicYearSelect;
