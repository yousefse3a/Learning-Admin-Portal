type QuestionType = "1" | "2" | "3" | "4" | "6";

interface BaseQuestion {
  type: QuestionType;
  score: number;
}

interface MCQQuestion extends BaseQuestion {
  question_content_MCQ: string;
  answers_MCQ: { text: string; isCorrect: boolean }[];
}

interface WritingQuestion extends BaseQuestion {
  question_content_Writing: string;
  file_Writing?: { name: string; type: string; size: number };
}

interface MatchingQuestion extends BaseQuestion {
  question_content_Matching: string;
  answer_Matching: string;
  sub_questions: { question_content: string; answer: string }[];
}

interface DragDropQuestion extends BaseQuestion {
  question_content_Drop: string;
  answers_Drop: { content: string; order: number }[];
}

interface TrueFalseQuestion extends BaseQuestion {
  question_content_TF: string;
  answer_TF: "true" | "false";
}

type Question =
  | MCQQuestion
  | WritingQuestion
  | MatchingQuestion
  | DragDropQuestion
  | TrueFalseQuestion;

export type Topic = {
  title_ar: string;
  title_en: string;
  content: string;
  questions: Question[];
};

export type ExamData = {
  name_ar: string;
  name_en: string;
  skill: string;
  subject: string;
  grade: string;
  level: string;
  mandatoryQuestions: number;
  isActive: boolean;
  topics: Topic[];
};
