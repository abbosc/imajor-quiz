export interface QuizQuestion {
  id: string;
  question_text: string;
  explanation: string | null;
  order_index: number;
  is_active: boolean;
  answer_choices: AnswerChoice[];
}

export interface AnswerChoice {
  id: string;
  question_id: string;
  choice_text: string;
  points: number;
  order_index: number;
}

export interface QuizAnswer {
  question_id: string;
  answer_choice_id: string;
  points: number;
}

export interface QuizSubmission {
  id: string;
  unique_id: string;
  user_name: string;
  user_email: string;
  total_score: number;
  created_at: string;
}

export interface QuizResults {
  submission: QuizSubmission;
  zero_point_questions: QuizQuestion[];
}
