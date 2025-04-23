export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agent_agreements: {
        Row: {
          agent_id: string
          agreement_type: string
          created_at: string
          effective_date: string | null
          expiration_date: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
        }
        Insert: {
          agent_id: string
          agreement_type: string
          created_at?: string
          effective_date?: string | null
          expiration_date?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
        }
        Update: {
          agent_id?: string
          agreement_type?: string
          created_at?: string
          effective_date?: string | null
          expiration_date?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          attendees: Json | null
          calendly_event_id: string | null
          created_at: string
          description: string | null
          end_time: string
          google_event_id: string | null
          id: string
          meeting_link: string | null
          related_contact_id: string | null
          related_deal_id: string | null
          start_time: string
          status: string
          title: string
        }
        Insert: {
          attendees?: Json | null
          calendly_event_id?: string | null
          created_at?: string
          description?: string | null
          end_time: string
          google_event_id?: string | null
          id?: string
          meeting_link?: string | null
          related_contact_id?: string | null
          related_deal_id?: string | null
          start_time: string
          status?: string
          title: string
        }
        Update: {
          attendees?: Json | null
          calendly_event_id?: string | null
          created_at?: string
          description?: string | null
          end_time?: string
          google_event_id?: string | null
          id?: string
          meeting_link?: string | null
          related_contact_id?: string | null
          related_deal_id?: string | null
          start_time?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string | null
          phone: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name?: string | null
          phone?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          description: string | null
          document_type: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          is_template: boolean | null
          metadata: Json | null
          name: string
          owner_id: string | null
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_type: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          is_template?: boolean | null
          metadata?: Json | null
          name: string
          owner_id?: string | null
          uploaded_by: string
        }
        Update: {
          created_at?: string
          description?: string | null
          document_type?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          is_template?: boolean | null
          metadata?: Json | null
          name?: string
          owner_id?: string | null
          uploaded_by?: string
        }
        Relationships: []
      }
      field_edit_history: {
        Row: {
          changed_by: string
          created_at: string
          field_name: string
          id: string
          new_value: string | null
          old_value: string | null
          record_id: string
          table_name: string
        }
        Insert: {
          changed_by: string
          created_at?: string
          field_name: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          record_id: string
          table_name: string
        }
        Update: {
          changed_by?: string
          created_at?: string
          field_name?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          record_id?: string
          table_name?: string
        }
        Relationships: []
      }
      form_data: {
        Row: {
          created_at: string
          email: string | null
          id: string
          "monthly_processing_volume`": number | null
          phone_number: string | null
          website: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          "monthly_processing_volume`"?: number | null
          phone_number?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          "monthly_processing_volume`"?: number | null
          phone_number?: string | null
          website?: string | null
        }
        Relationships: []
      }
      industries: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      industry_documents: {
        Row: {
          file_name: string
          file_path: string
          file_type: string | null
          id: string
          industry_id: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          file_name: string
          file_path: string
          file_type?: string | null
          id?: string
          industry_id?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          file_name?: string
          file_path?: string
          file_type?: string | null
          id?: string
          industry_id?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "industry_documents_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          business_name: string
          created_at: string
          email: string
          id: number
          phone_number: string
          processing_volume: string
          website: string | null
        }
        Insert: {
          business_name: string
          created_at?: string
          email: string
          id?: number
          phone_number: string
          processing_volume: string
          website?: string | null
        }
        Update: {
          business_name?: string
          created_at?: string
          email?: string
          id?: number
          phone_number?: string
          processing_volume?: string
          website?: string | null
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          last_accessed: string
          lesson_id: number
          user_id: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          last_accessed?: string
          lesson_id: number
          user_id?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          last_accessed?: string
          lesson_id?: number
          user_id?: string | null
        }
        Relationships: []
      }
      merchant_applications: {
        Row: {
          application_data: Json
          completed: boolean
          created_at: string
          expires_at: string
          id: string
          merchant_email: string
          merchant_name: string
          otp: string
          updated_at: string
        }
        Insert: {
          application_data: Json
          completed?: boolean
          created_at?: string
          expires_at: string
          id?: string
          merchant_email: string
          merchant_name: string
          otp: string
          updated_at?: string
        }
        Update: {
          application_data?: Json
          completed?: boolean
          created_at?: string
          expires_at?: string
          id?: string
          merchant_email?: string
          merchant_name?: string
          otp?: string
          updated_at?: string
        }
        Relationships: []
      }
      merchant_documents: {
        Row: {
          created_at: string
          document_type: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          merchant_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          document_type: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          merchant_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          merchant_id?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      quiz_results: {
        Row: {
          correct_answers: number
          created_at: string
          id: string
          incorrect_answers: number
          lesson_id: number
          percentage: number
          score: number
          total_questions: number
          user_id: string | null
        }
        Insert: {
          correct_answers: number
          created_at?: string
          id?: string
          incorrect_answers: number
          lesson_id: number
          percentage: number
          score: number
          total_questions: number
          user_id?: string | null
        }
        Update: {
          correct_answers?: number
          created_at?: string
          id?: string
          incorrect_answers?: number
          lesson_id?: number
          percentage?: number
          score?: number
          total_questions?: number
          user_id?: string | null
        }
        Relationships: []
      }
      training_lessons: {
        Row: {
          content: Json
          created_at: string
          description: string
          estimated_time: number
          id: number
          module_id: number | null
          order_num: number
          title: string
        }
        Insert: {
          content: Json
          created_at?: string
          description: string
          estimated_time: number
          id?: number
          module_id?: number | null
          order_num: number
          title: string
        }
        Update: {
          content?: Json
          created_at?: string
          description?: string
          estimated_time?: number
          id?: number
          module_id?: number | null
          order_num?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "training_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      training_modules: {
        Row: {
          created_at: string
          description: string
          icon: string | null
          id: number
          lessons_count: number
          order_num: number
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string | null
          id?: number
          lessons_count?: number
          order_num: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string | null
          id?: number
          lessons_count?: number
          order_num?: number
          title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: { user_id: string; role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
