import Joi from "joi";

const questionSchema = Joi.object({
  type: Joi.string().valid("1", "2", "3", "4").required(),
  score: Joi.number().min(1).required(),
});

const topicSchema = Joi.object({
  title_ar: Joi.string().required(),
  title_en: Joi.string().required(),
  content: Joi.string().required(),
  file: Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid("image/jpeg", "image/png", "image/gif").required(),
    size: Joi.number()
      .max(2 * 1024 * 1024) // Max 2MB
      .required(),
  }).optional(),
  questions: Joi.array().min(1).items(questionSchema),
});

const examSchema = Joi.object({
  name_ar: Joi.string().min(3).max(50).required(),
  name_en: Joi.string().min(3).max(50).required(),
  skill: Joi.string().valid("1", "2", "3", "4").required(),
  subject: Joi.string().required(),
  grade: Joi.string().required(),
  level: Joi.string().required(),
  mandatoryQuestions: Joi.number().integer().min(1).required(),
  isActive: Joi.boolean().required(),
  topics: Joi.array().min(1).items(topicSchema),
});

export default examSchema;
