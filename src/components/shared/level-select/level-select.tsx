import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";
import { Label } from "@/components/ui/label";
import { GetLevel } from "@/api/services/exam.services";
import Images from "@/assets/images/Images";

const LevelSelect = ({
  name,
  control,
  label,
  rules,
  errors,
  asterisk,
  defaultValue,
}) => {
  const [levels, setLevels] = useState([]);

  const handleSelectChange = (key) => (value) => {
    console.log(`${key}:`, value);
  };

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      const payload = {
        Keyword: "",
        Page: 1,
        Size: 50,
      };
      const response = await GetLevel(payload);
      setLevels(response.data.Data.Data || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Map subjects to react-select
  const gradeOptions = levels.map((level) => ({
    label: level.NameEn,
    value: level.Id,
  }));
  return (
    <div className="mb-2">
      <Label className="flex gap-1 items-baseline" htmlFor={name}>
        {label}
        {asterisk && (
          <span>
            <img className="w-2" src={Images.red_asterisk_icon} alt="pic" />
          </span>
        )}
      </Label>
      <div className="mt-2">
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => (
            <>
              <Select
                {...field}
                options={gradeOptions}
                //value={field.value}
                value={
                  field.value
                    ? {
                        value: field.value,
                        label: levels.find(
                          (level) => level.Id === field.value
                        )?.NameEn,
                      }
                    : null
                }
                onChange={(selectedOption) => {
                  field.onChange(selectedOption ? selectedOption.value : null);
                }}
                defaultValue={defaultValue}
                className="basic-multi-select"
                classNamePrefix="select"
              />
              {errors[name] && (
                <p className="mt-1 text-[#ff3728] text-[14px] font-[300]">
                  {errors[name]?.message}
                </p>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
};

export default LevelSelect;
