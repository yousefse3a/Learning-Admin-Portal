import { Controller } from "react-hook-form";
import Select from "react-select";
import { Label } from "@/components/ui/label";
import { SKILL_TYPE } from "@/lib/constant";
import Images from "@/assets/images/Images";

const SkillSelect = ({
  name,
  control,
  label,
  rules,
  errors,
  asterisk,
  defaultValue,
  //placeholder,
}) => {
  const handleSelectChange = (key) => (value) => {
    console.log(`${key}:`, value);
  };

  // Map grades to react-select
  const skillsOptions = [
    {
      value: SKILL_TYPE.Reading.value,
      label: SKILL_TYPE.Reading.name,
    },
    {
      value: SKILL_TYPE.Writing.value,
      label: SKILL_TYPE.Writing.name,
    },
    {
      value: SKILL_TYPE.Listening.value,
      label: SKILL_TYPE.Listening.name,
    },
    {
      value: SKILL_TYPE.Speaking.value,
      label: SKILL_TYPE.Speaking.name,
    },
  ];

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
                options={skillsOptions}
                value={skillsOptions.find(
                  (option) => option.value === field.value
                )}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption ? selectedOption.value : null); 
                  handleSelectChange({ name })(selectedOption);
                }}
                className="basic-multi-select"
                classNamePrefix="select"
                defaultValue={defaultValue}
                //placeholder={placeholder}
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

export default SkillSelect;
