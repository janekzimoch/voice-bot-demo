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
      settings: {
        Row: {
          company_business: string | null
          company_name: string | null
          company_values: string | null
          conversation_purpose: string | null
          conversation_type: string | null
          custom_prompt: string | null
          id: number
          salesperson_name: string
          salesperson_role: string | null
          use_custom_prompt: boolean | null
          user_id: string | null
        }
        Insert: {
          company_business?: string | null
          company_name?: string | null
          company_values?: string | null
          conversation_purpose?: string | null
          conversation_type?: string | null
          custom_prompt?: string | null
          id?: number
          salesperson_name?: string
          salesperson_role?: string | null
          use_custom_prompt?: boolean | null
          user_id?: string | null
        }
        Update: {
          company_business?: string | null
          company_name?: string | null
          company_values?: string | null
          conversation_purpose?: string | null
          conversation_type?: string | null
          custom_prompt?: string | null
          id?: number
          salesperson_name?: string
          salesperson_role?: string | null
          use_custom_prompt?: boolean | null
          user_id?: string | null
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
