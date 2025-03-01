export type Question = {
  text: string;
};

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
