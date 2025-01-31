import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";
import { Label } from "@/components/ui/label";
import { GetModelExam } from "@/api/services/exam.services";
import Images from "@/assets/images/Images";

const ModelExamSelect = ({
  name,
  control,
  label,
  rules,
  errors,
  asterisk,
  defaultValue,
}) => {
  const [modelExam, setModelExam] = useState([]);

  const handleSelectChange = (key) => (value) => {
    console.log(`${key}:`, value);
  };

  // Fetch ModelExam
  const fetchModelExam = async () => {
    try {
      const payload = {
        Keyword: "",
        Page: 1,
        Size: 50,
      };
      const response = await GetModelExam(payload);
      setModelExam(response.data.Data.Data || []);
    } catch (error) {
      console.error("Error fetching model exams:", error);
    }
  };

  useEffect(() => {
    fetchModelExam();
  }, []);

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
              {/* <Select
                {...field}
                options={gradeOptions}
                value={field.value} // Bind field value
                onChange={(selectedOptions) => {
                  // Pass the selected options to react-hook-form field
                  field.onChange(selectedOptions);
                  handleSelectChange({ name })(selectedOptions); // Dynamic handler
                }}
                defaultValue={defaultValue}
                className="basic-multi-select"
                classNamePrefix="select"
              /> */}
              <Select
                className="w-full basic-multi-select"
                options={modelExam.map((item) => ({
                  value: item?.Id, // Value should be the ID of the model
                  label: item?.NameEn, // Label should be the NameEn
                }))}
                isMulti
                value={
                  field.value?.map((id) => ({
                    value: id, // Ensure value is mapped properly
                    label: modelExam.find((model) => model.Id === id)?.NameEn, // Find the label based on Id
                  })) || []
                } // Default to empty array if no value is selected
                onChange={(selectedOptions) => {
                  // Pass an array of selected objects to react-hook-form field
                  field.onChange(selectedOptions.map((option) => option.value)); // Passing just the Ids
                  handleSelectChange({name})(selectedOptions);
                }}
                placeholder={"Select a Model"} // Placeholder text
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

export default ModelExamSelect;
