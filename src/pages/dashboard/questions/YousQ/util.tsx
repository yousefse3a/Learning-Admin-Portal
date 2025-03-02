import Joi from "joi";

export const validatePlaceholderCount = (
  value: string,
  helpers: Joi.CustomHelpers
) => {
  const count = (value.match(/\.\.\.\./g) || []).length; // Count occurrences of "...."
  if (count < 1) {
    return helpers.error("string.custom", {
      message: 'Question must contain at least one "...."',
    });
  }
  return value;
};
export const jsonToFormData = (
  data: any,
  formData = new FormData(),
  parentKey = ""
) => {
  if (data && typeof data === "object" && !(data instanceof File)) {
    Object.keys(data).forEach((key) => {
      const value = data[key];
      const fieldName = parentKey ? `${parentKey}[${key}]` : key;

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          jsonToFormData(item, formData, `${fieldName}[${index}]`);
        });
      } else if (value instanceof File) {
        formData.append(fieldName, value);
      } else if (typeof value === "object" && value !== null) {
        jsonToFormData(value, formData, fieldName);
      } else {
        formData.append(fieldName, value);
      }
    });
  } else {
    formData.append(parentKey, data);
  }

  return formData;
};
