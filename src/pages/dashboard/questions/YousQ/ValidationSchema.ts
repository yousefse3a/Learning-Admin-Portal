import { z } from "zod";
// import { validatePlaceholderCount } from "./util";

// 🔹 Base Schema (Ensures type is a string)
const baseQuestionSchema = z.object({
  QuestionType: z.enum(["1", "2", "3", "4", "5", "6"]), // ✅ Ensures type is always a string
  Score: z.number().int(),
});

// 🔹 Question Types
const mcqSchema = baseQuestionSchema.extend({
  QuestionType: z
    .literal("1")
    .transform((val) => (typeof val === "string" ? Number(val) : val)),
  ContentQuestion_MCQ: z.string().min(3).nonempty(),
  Answers: z
    .array(
      z.object({
        Answer: z.string().min(3).nonempty(),
        IsCorrect: z.boolean().default(false),
      })
    )
    .min(2),
});

const writingSchema = baseQuestionSchema.extend({
  QuestionType: z
    .literal("2")
    .transform((val) => (typeof val === "string" ? Number(val) : val)),
  ContentQuestion_Writing: z.string().min(3).nonempty(),
  File: z
    .object({
      name: z.string(),
      type: z.enum(["image/jpeg", "image/png", "image/gif", "application/pdf"]),
      size: z.number().max(5 * 1024 * 1024),
    })
    .optional(),
});

const subQuestionSchema = z.object({
  QuestionType: z
    .string()
    .default("3")
    .transform((val) => (typeof val === "string" ? Number(val) : val)),
  ContentQuestion: z.string().min(3).nonempty(),
  Answers: z.string().min(3).nonempty(),
});

const matchingSchema = baseQuestionSchema.extend({
  QuestionType: z
    .literal("3")
    .transform((val) => (typeof val === "string" ? Number(val) : val)),
  ContentQuestion_Matching: z.string().min(3).nonempty(),
  Answers_Matching: z.string().min(3).nonempty(),
  RelatedQuestions: z.array(subQuestionSchema).min(1),
});

const dragDropAnswerSchema = z.object({
  Answer: z.string().min(3).nonempty(),
  CorrectAnswerOrder: z.number().int(),
});

const dragDropSchema = baseQuestionSchema.extend({
  QuestionType: z
    .literal("4")
    .transform((val) => (typeof val === "string" ? Number(val) : val)),
  ContentQuestion_Drop: z.string().min(3).nonempty(),
  Answers_Drop: z.array(dragDropAnswerSchema).min(1),
});
const completeSchema = baseQuestionSchema.extend({
  QuestionType: z
    .literal("5")
    .transform((val) => (typeof val === "string" ? Number(val) : val)),
  ContentQuestion_Complete: z
    .string()
    .min(3)
    .nonempty()
    .refine((val) => val.includes("...."), {
      message: "ContentQuestion_Complete must contain '....'",
    }),
  Answers_Complete: z.array(dragDropAnswerSchema).min(1),
});

const trueFalseSchema = baseQuestionSchema.extend({
  QuestionType: z
    .literal("6")
    .transform((val) => (typeof val === "string" ? Number(val) : val)),
  ContentQuestion_TF: z.string(),
  Answers_TF: z.enum(["true", "false"]),
  File_TF: z
    .object({
      name: z.string(),
      type: z.enum(["image/jpeg", "image/png", "image/gif", "application/pdf"]),
      size: z.number().max(5 * 1024 * 1024),
    })
    .optional(),
});

const questionSchema = z.discriminatedUnion("QuestionType", [
  mcqSchema,
  writingSchema,
  matchingSchema,
  dragDropSchema,
  completeSchema,
  trueFalseSchema,
]);

const topicSchema = z.object({
  title_ar: z.string(),
  title_en: z.string(),
  content: z.string(),
  file: z
    .object({
      name: z.string(),
      type: z.enum(["image/jpeg", "image/png", "image/gif"]),
      size: z.number().max(2 * 1024 * 1024),
    })
    .optional(),
  questions: z.array(questionSchema).min(1),
});

export const examSchema = z.object({
  NameAr: z.string().min(3).max(50),
  NameEn: z.string().min(3).max(50),
  Skill: z.enum(["1", "2", "3", "4"]),
  SubjectId: z.string(),
  GradeId: z.string(),
  LevelId: z.string(),
  NumberOfMandatoryQuestions: z.number().int(),
  IsActive: z.boolean().default(false),
  Topics: z.array(topicSchema).min(1),
});
