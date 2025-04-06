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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
