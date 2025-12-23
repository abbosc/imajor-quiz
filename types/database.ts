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
      questions: {
        Row: {
          id: string
          question_text: string
          explanation: string | null
          order_index: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          question_text: string
          explanation?: string | null
          order_index: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          question_text?: string
          explanation?: string | null
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
      quiz_submissions: {
        Row: {
          id: string
          unique_id: string
          user_name: string
          user_email: string
          total_score: number
          max_score: number | null
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          unique_id: string
          user_name: string
          user_email: string
          total_score: number
          max_score?: number | null
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          unique_id?: string
          user_name?: string
          user_email?: string
          total_score?: number
          max_score?: number | null
          user_id?: string | null
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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string
          avatar_url: string | null
          grade_level: string | null
          school_name: string | null
          country: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email: string
          avatar_url?: string | null
          grade_level?: string | null
          school_name?: string | null
          country?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string
          avatar_url?: string | null
          grade_level?: string | null
          school_name?: string | null
          country?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      exploration_tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string | null
          order_index: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category?: string | null
          order_index?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string | null
          order_index?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_task_progress: {
        Row: {
          id: string
          user_id: string
          task_id: string
          status: 'not_started' | 'in_progress' | 'completed'
          notes: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id: string
          status?: 'not_started' | 'in_progress' | 'completed'
          notes?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string
          status?: 'not_started' | 'in_progress' | 'completed'
          notes?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_universities: {
        Row: {
          id: string
          user_id: string
          name: string
          deadline: string | null
          status: 'researching' | 'applying' | 'applied' | 'accepted' | 'rejected' | 'waitlisted' | 'withdrawn'
          major: string | null
          decision_type: 'early_decision' | 'early_action' | 'regular' | 'rolling' | null
          scholarship_info: string | null
          notes: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          deadline?: string | null
          status?: 'researching' | 'applying' | 'applied' | 'accepted' | 'rejected' | 'waitlisted' | 'withdrawn'
          major?: string | null
          decision_type?: 'early_decision' | 'early_action' | 'regular' | 'rolling' | null
          scholarship_info?: string | null
          notes?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          deadline?: string | null
          status?: 'researching' | 'applying' | 'applied' | 'accepted' | 'rejected' | 'waitlisted' | 'withdrawn'
          major?: string | null
          decision_type?: 'early_decision' | 'early_action' | 'regular' | 'rolling' | null
          scholarship_info?: string | null
          notes?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_tests: {
        Row: {
          id: string
          user_id: string
          test_name: string
          status: 'planned' | 'preparing' | 'scheduled' | 'completed'
          test_date: string | null
          target_score: string | null
          result_score: string | null
          certificate_url: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          test_name: string
          status?: 'planned' | 'preparing' | 'scheduled' | 'completed'
          test_date?: string | null
          target_score?: string | null
          result_score?: string | null
          certificate_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          test_name?: string
          status?: 'planned' | 'preparing' | 'scheduled' | 'completed'
          test_date?: string | null
          target_score?: string | null
          result_score?: string | null
          certificate_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_activities: {
        Row: {
          id: string
          user_id: string
          activity_name: string
          activity_type: string
          position_title: string | null
          organization_name: string | null
          hours_per_week: number | null
          weeks_per_year: number | null
          years_participated: string | null
          description: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_name: string
          activity_type: string
          position_title?: string | null
          organization_name?: string | null
          hours_per_week?: number | null
          weeks_per_year?: number | null
          years_participated?: string | null
          description?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_name?: string
          activity_type?: string
          position_title?: string | null
          organization_name?: string | null
          hours_per_week?: number | null
          weeks_per_year?: number | null
          years_participated?: string | null
          description?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_honors: {
        Row: {
          id: string
          user_id: string
          honor_name: string
          level: 'school' | 'state' | 'regional' | 'national' | 'international'
          year_received: string | null
          description: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          honor_name: string
          level: 'school' | 'state' | 'regional' | 'national' | 'international'
          year_received?: string | null
          description?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          honor_name?: string
          level?: 'school' | 'state' | 'regional' | 'national' | 'international'
          year_received?: string | null
          description?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_essays: {
        Row: {
          id: string
          user_id: string
          title: string
          prompt: string | null
          content: string | null
          word_count: number
          status: 'draft' | 'in_review' | 'final'
          university_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          prompt?: string | null
          content?: string | null
          word_count?: number
          status?: 'draft' | 'in_review' | 'final'
          university_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          prompt?: string | null
          content?: string | null
          word_count?: number
          status?: 'draft' | 'in_review' | 'final'
          university_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_recommendations: {
        Row: {
          id: string
          user_id: string
          recommender_name: string
          recommender_email: string | null
          subject_taught: string | null
          relationship: string | null
          status: 'not_requested' | 'requested' | 'in_progress' | 'submitted'
          due_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recommender_name: string
          recommender_email?: string | null
          subject_taught?: string | null
          relationship?: string | null
          status?: 'not_requested' | 'requested' | 'in_progress' | 'submitted'
          due_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          recommender_name?: string
          recommender_email?: string | null
          subject_taught?: string | null
          relationship?: string | null
          status?: 'not_requested' | 'requested' | 'in_progress' | 'submitted'
          due_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      majors: {
        Row: {
          id: string
          name: string
          is_active: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          is_active?: boolean
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          is_active?: boolean
          order_index?: number
          created_at?: string
        }
      }
      user_majors: {
        Row: {
          id: string
          user_id: string
          major_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          major_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          major_id?: string
          created_at?: string
        }
      }
      college_tv_videos: {
        Row: {
          id: string
          title: string
          description: string | null
          youtube_url: string
          youtube_id: string
          thumbnail_url: string | null
          tags: string[]
          order_index: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          youtube_url: string
          youtube_id: string
          thumbnail_url?: string | null
          tags?: string[]
          order_index?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          youtube_url?: string
          youtube_id?: string
          thumbnail_url?: string | null
          tags?: string[]
          order_index?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      college_tv_tags: {
        Row: {
          id: string
          name: string
          slug: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          color?: string
          created_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          is_read?: boolean
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

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ExplorationTask = Database['public']['Tables']['exploration_tasks']['Row']
export type UserTaskProgress = Database['public']['Tables']['user_task_progress']['Row']
export type UserUniversity = Database['public']['Tables']['user_universities']['Row']
export type UserTest = Database['public']['Tables']['user_tests']['Row']
export type UserActivity = Database['public']['Tables']['user_activities']['Row']
export type UserHonor = Database['public']['Tables']['user_honors']['Row']
export type UserEssay = Database['public']['Tables']['user_essays']['Row']
export type UserRecommendation = Database['public']['Tables']['user_recommendations']['Row']
export type Major = Database['public']['Tables']['majors']['Row']
export type UserMajor = Database['public']['Tables']['user_majors']['Row']
export type CollegeTvVideo = Database['public']['Tables']['college_tv_videos']['Row']
export type CollegeTvTag = Database['public']['Tables']['college_tv_tags']['Row']
export type ContactMessage = Database['public']['Tables']['contact_messages']['Row']
