import { Control, Controller, FieldErrors } from "react-hook-form";
import { ExamData } from "./AddExamTypes";
import { useState } from "react";

interface FormControllerProps {
  label: string;
  name: string;
  control: Control<ExamData>;
  placeholder?: string;
  errors: FieldErrors<ExamData>;
  type: "text" | "select" | "checkbox" | "number" | "file";
  options?: { value: string; label: string }[];
  isLoading?: boolean;
}

function FormController({
  label,
  name,
  control,
  placeholder,
  errors,
  type,
  options,
  isLoading,
}: FormControllerProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          switch (type) {
            case "text":
            case "number":
              return (
                <input
                  {...field}
                  type={type}
                  className="border p-2 w-full"
                  placeholder={placeholder}
                />
              );
            case "select":
              return (
                <div className="relative">
                  <select {...field} className="border p-2 w-full">
                    <option value="">{placeholder}</option>
                    {isLoading ? (
                      <option disabled>Loading...</option>
                    ) : (
                      options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              );
            case "checkbox":
              return (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...field}
                    checked={field.value}
                    className="mr-2"
                  />
                  <label>{placeholder}</label>
                </div>
              );
            case "file":
              return (
                <div className="flex flex-col items-start">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id={name}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (!file.type.startsWith("image/")) {
                          setFileError("Only image files are allowed!");
                          setPreview(null);
                          field.onChange(null);
                        } else {
                          setFileError(null);
                          field.onChange(file);

                          // Generate preview URL
                          const reader = new FileReader();
                          reader.onloadend = () =>
                            setPreview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }
                    }}
                  />
                  {/* Clickable Image Preview */}
                  <label htmlFor={name} className="cursor-pointer">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                    ) : (
                      <div className="w-32 h-32 flex items-center justify-center border rounded-md bg-gray-100 text-gray-500">
                        Click to Upload
                      </div>
                    )}
                  </label>
                  {fileError && (
                    <p className="text-red-500 mt-2">{fileError}</p>
                  )}
                </div>
              );
            default:
              return null;
          }
        }}
      />
      {errors[name] && <p className="text-red-500">{errors[name]?.message}</p>}
    </div>
  );
}

export default FormController;
