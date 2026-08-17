export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      concept_edges: {
        Row: {
          created_at: string
          id: string
          relationship_type: string | null
          source_node_id: string
          target_node_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          relationship_type?: string | null
          source_node_id: string
          target_node_id: string
        }
        Update: {
          created_at?: string
          id?: string
          relationship_type?: string | null
          source_node_id?: string
          target_node_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "concept_edges_source_node_id_fkey"
            columns: ["source_node_id"]
            isOneToOne: false
            referencedRelation: "concept_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concept_edges_target_node_id_fkey"
            columns: ["target_node_id"]
            isOneToOne: false
            referencedRelation: "concept_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      concept_nodes: {
        Row: {
          created_at: string
          description: string | null
          difficulty: string | null
          id: string
          importance: number | null
          label: string
          pos_x: number | null
          pos_y: number | null
          pos_z: number | null
          subject_id: string
          topic_id: string | null
          unit_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          importance?: number | null
          label: string
          pos_x?: number | null
          pos_y?: number | null
          pos_z?: number | null
          subject_id: string
          topic_id?: string | null
          unit_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          importance?: number | null
          label?: string
          pos_x?: number | null
          pos_y?: number | null
          pos_z?: number | null
          subject_id?: string
          topic_id?: string | null
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "concept_nodes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concept_nodes_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concept_nodes_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          study_progress: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          study_progress?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          study_progress?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      question_attempts: {
        Row: {
          answer_time_seconds: number | null
          attempted_at: string
          confidence: number | null
          id: string
          is_correct: boolean
          question_id: string
          user_id: string
        }
        Insert: {
          answer_time_seconds?: number | null
          attempted_at?: string
          confidence?: number | null
          id?: string
          is_correct: boolean
          question_id: string
          user_id: string
        }
        Update: {
          answer_time_seconds?: number | null
          attempted_at?: string
          confidence?: number | null
          id?: string
          is_correct?: boolean
          question_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          created_at: string
          id: string
          is_pyq: boolean | null
          marks: number
          question_text: string
          topic_id: string
          year_semester: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_pyq?: boolean | null
          marks: number
          question_text: string
          topic_id: string
          year_semester?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_pyq?: boolean | null
          marks?: number
          question_text?: string
          topic_id?: string
          year_semester?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      revision_sessions: {
        Row: {
          completed_at: string
          duration_minutes: number | null
          id: string
          score_after: number | null
          score_before: number | null
          topic_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          duration_minutes?: number | null
          id?: string
          score_after?: number | null
          score_before?: number | null
          topic_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          duration_minutes?: number | null
          id?: string
          score_after?: number | null
          score_before?: number | null
          topic_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "revision_sessions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      study_materials: {
        Row: {
          analysis: Json | null
          created_at: string
          extracted_text: string | null
          file_path: string | null
          id: string
          kind: string
          status: string
          subject: string
          title: string
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis?: Json | null
          created_at?: string
          extracted_text?: string | null
          file_path?: string | null
          id?: string
          kind?: string
          status?: string
          subject?: string
          title: string
          unit?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis?: Json | null
          created_at?: string
          extracted_text?: string | null
          file_path?: string | null
          id?: string
          kind?: string
          status?: string
          subject?: string
          title?: string
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_plan_items: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          priority: string | null
          scheduled_date: string
          study_plan_id: string
          topic_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          priority?: string | null
          scheduled_date: string
          study_plan_id: string
          topic_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          priority?: string | null
          scheduled_date?: string
          study_plan_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_plan_items_study_plan_id_fkey"
            columns: ["study_plan_id"]
            isOneToOne: false
            referencedRelation: "study_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_plan_items_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      study_plans: {
        Row: {
          created_at: string
          exam_date: string
          id: string
          preparation_level: string | null
          study_hours_per_day: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          exam_date: string
          id?: string
          preparation_level?: string | null
          study_hours_per_day?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          exam_date?: string
          id?: string
          preparation_level?: string | null
          study_hours_per_day?: number | null
          user_id?: string
        }
        Relationships: []
      }
      study_progress: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          subject: string
          topic: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          subject?: string
          topic: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          subject?: string
          topic?: string
          user_id?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      topic_progress: {
        Row: {
          accuracy: number | null
          attempt_count: number | null
          correct_count: number | null
          created_at: string
          id: string
          last_revised_at: string | null
          mastery_score: number | null
          revision_count: number | null
          status: string | null
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          attempt_count?: number | null
          correct_count?: number | null
          created_at?: string
          id?: string
          last_revised_at?: string | null
          mastery_score?: number | null
          revision_count?: number | null
          status?: string | null
          topic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy?: number | null
          attempt_count?: number | null
          correct_count?: number | null
          created_at?: string
          id?: string
          last_revised_at?: string | null
          mastery_score?: number | null
          revision_count?: number | null
          status?: string | null
          topic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          created_at: string
          exam_frequency: number | null
          id: string
          importance: number | null
          marks_weightage: number | null
          title: string
          unit_id: string
        }
        Insert: {
          created_at?: string
          exam_frequency?: number | null
          id?: string
          importance?: number | null
          marks_weightage?: number | null
          title: string
          unit_id: string
        }
        Update: {
          created_at?: string
          exam_frequency?: number | null
          id?: string
          importance?: number | null
          marks_weightage?: number | null
          title?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          created_at: string
          id: string
          subject_id: string
          title: string
          unit_number: number
        }
        Insert: {
          created_at?: string
          id?: string
          subject_id: string
          title: string
          unit_number: number
        }
        Update: {
          created_at?: string
          id?: string
          subject_id?: string
          title?: string
          unit_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "units_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
