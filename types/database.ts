export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sections: {
        Row: {
          id: string
          title: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          order_index?: number
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          section_id: string
          question_text: string
          order_index: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          section_id: string
          question_text: string
          order_index: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          section_id?: string
          question_text?: string
          order_index?: number
          is_active?: boolean
          created_at?: string
        }
      }
      answer_choices: {
        Row: {
          id: string
          question_id: string
          choice_text: string
          points: number
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          question_id: string
          choice_text: string
          points: number
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          choice_text?: string
          points?: number
          order_index?: number
          created_at?: string
        }
      }
      interpretation_levels: {
        Row: {
          id: string
          min_score: number
          max_score: number
          level_label: string
          description: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          min_score: number
          max_score: number
          level_label: string
          description?: string | null
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          min_score?: number
          max_score?: number
          level_label?: string
          description?: string | null
          order_index?: number
          created_at?: string
        }
      }
      quiz_submissions: {
        Row: {
          id: string
          unique_id: string
          user_name: string
          user_email: string
          total_score: number
          created_at: string
        }
        Insert: {
          id?: string
          unique_id: string
          user_name: string
          user_email: string
          total_score: number
          created_at?: string
        }
        Update: {
          id?: string
          unique_id?: string
          user_name?: string
          user_email?: string
          total_score?: number
          created_at?: string
        }
      }
      submission_answers: {
        Row: {
          id: string
          submission_id: string
          question_id: string
          answer_choice_id: string
          points_earned: number
          created_at: string
        }
        Insert: {
          id?: string
          submission_id: string
          question_id: string
          answer_choice_id: string
          points_earned: number
          created_at?: string
        }
        Update: {
          id?: string
          submission_id?: string
          question_id?: string
          answer_choice_id?: string
          points_earned?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
