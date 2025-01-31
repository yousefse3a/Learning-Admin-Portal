import { Controller } from "react-hook-form";
import Select from "react-select";
import { Label } from "@/components/ui/label";
import Images from "@/assets/images/Images";
import { ROUND_TYPE } from "@/lib/constant";

const RoundSelect = ({
  name,
  control,
  label,
  rules,
  errors,
  asterisk,
  defaultValue,
  placeholder,
}) => {
  const handleSelectChange = (key) => (value) => {
    console.log(`${key}:`, value);
  };

  // Map grades to react-select
  const gradeOptions = [
    {
      value: ROUND_TYPE.round1.value,
      label: ROUND_TYPE.round1.name,
    },
    {
      value: ROUND_TYPE.round2.value,
      label: ROUND_TYPE.round2.name,
    },
    {
      value: ROUND_TYPE.round3.value,
      label: ROUND_TYPE.round3.name,
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
                options={gradeOptions}
                value={gradeOptions.find(
                  (option) => option.value === field.value
                )} // Make sure the value is found in options
                onChange={(selectedOption) => {
                  // React Hook Form expects the value, so we pass only the selected value
                  field.onChange(selectedOption ? selectedOption.value : null); // If no option selected, pass null
                  handleSelectChange({ name })(selectedOption); // Dynamic handler
                }}
                className="basic-multi-select"
                classNamePrefix="select"
                // onChange={(selectedOptions) => {
                //   // Pass the selected options to react-hook-form field
                //   field.onChange(selectedOptions);
                //   handleSelectChange("Round")(selectedOptions); // Dynamic handler
                // }}
                defaultValue={defaultValue}
                placeholder={placeholder} // Placeholder text
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

export default RoundSelect;
