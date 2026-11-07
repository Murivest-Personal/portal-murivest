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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      acquisition_criteria: {
        Row: {
          advisor_notes: string | null
          asset_types: string[]
          budget_currency: string
          created_at: string
          financing_preference: string | null
          holding_period_years: number | null
          id: string
          investor_id: string
          is_active: boolean
          markets: string[]
          max_price: number | null
          min_price: number | null
          min_yield: number | null
          notes: string | null
          status: string
          target_income_kes: number | null
          title: string | null
          transaction_structure: string | null
          updated_at: string
        }
        Insert: {
          advisor_notes?: string | null
          asset_types?: string[]
          budget_currency?: string
          created_at?: string
          financing_preference?: string | null
          holding_period_years?: number | null
          id?: string
          investor_id: string
          is_active?: boolean
          markets?: string[]
          max_price?: number | null
          min_price?: number | null
          min_yield?: number | null
          notes?: string | null
          status?: string
          target_income_kes?: number | null
          title?: string | null
          transaction_structure?: string | null
          updated_at?: string
        }
        Update: {
          advisor_notes?: string | null
          asset_types?: string[]
          budget_currency?: string
          created_at?: string
          financing_preference?: string | null
          holding_period_years?: number | null
          id?: string
          investor_id?: string
          is_active?: boolean
          markets?: string[]
          max_price?: number | null
          min_price?: number | null
          min_yield?: number | null
          notes?: string | null
          status?: string
          target_income_kes?: number | null
          title?: string | null
          transaction_structure?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      activity_log: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json
          user_id?: string
        }
        Relationships: []
      }
      asset_briefs: {
        Row: {
          access_level: string
          asset_class: string | null
          confidentiality: string | null
          created_at: string
          highlights: string[] | null
          id: string
          location: string | null
          location_detail: string | null
          metrics: Json | null
          price_kes: number | null
          price_usd: number | null
          requires_order: boolean
          status: string
          teaser: string | null
          title: string
        }
        Insert: {
          access_level?: string
          asset_class?: string | null
          confidentiality?: string | null
          created_at?: string
          highlights?: string[] | null
          id?: string
          location?: string | null
          location_detail?: string | null
          metrics?: Json | null
          price_kes?: number | null
          price_usd?: number | null
          requires_order?: boolean
          status?: string
          teaser?: string | null
          title: string
        }
        Update: {
          access_level?: string
          asset_class?: string | null
          confidentiality?: string | null
          created_at?: string
          highlights?: string[] | null
          id?: string
          location?: string | null
          location_detail?: string | null
          metrics?: Json | null
          price_kes?: number | null
          price_usd?: number | null
          requires_order?: boolean
          status?: string
          teaser?: string | null
          title?: string
        }
        Relationships: []
      }
      brief_orders: {
        Row: {
          amount_kes: number
          amount_usd: number
          brief_title: string | null
          cancellation_reason: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          delivery_method: string | null
          id: string
          order_type: string
          organisation: string | null
          payment_method: string | null
          shipping_address: string | null
          status: string
          tracking_number: string | null
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_kes?: number
          amount_usd?: number
          brief_title?: string | null
          cancellation_reason?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          delivery_method?: string | null
          id?: string
          order_type: string
          organisation?: string | null
          payment_method?: string | null
          shipping_address?: string | null
          status?: string
          tracking_number?: string | null
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_kes?: number
          amount_usd?: number
          brief_title?: string | null
          cancellation_reason?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          delivery_method?: string | null
          id?: string
          order_type?: string
          organisation?: string | null
          payment_method?: string | null
          shipping_address?: string | null
          status?: string
          tracking_number?: string | null
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      document_access: {
        Row: {
          document_id: string
          granted_at: string
          id: string
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          document_id: string
          granted_at?: string
          id?: string
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          document_id?: string
          granted_at?: string
          id?: string
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_access_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          description: string | null
          file_type: string | null
          file_url: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          created_at: string
          id: string
          investor_id: string
          message: string
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          id?: string
          investor_id: string
          message: string
          status?: string
          subject: string
        }
        Update: {
          created_at?: string
          id?: string
          investor_id?: string
          message?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      investment_briefs: {
        Row: {
          access_level: string
          asset_class: string | null
          created_at: string
          details: Json | null
          id: string
          investment_type: string | null
          location: string | null
          location_detail: string | null
          price_kes: number | null
          slug: string
          status: string
          subtitle: string | null
          summary: string | null
          target_irr: string | null
          target_yield: string | null
          teaser: string | null
          title: string
        }
        Insert: {
          access_level?: string
          asset_class?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          investment_type?: string | null
          location?: string | null
          location_detail?: string | null
          price_kes?: number | null
          slug: string
          status?: string
          subtitle?: string | null
          summary?: string | null
          target_irr?: string | null
          target_yield?: string | null
          teaser?: string | null
          title: string
        }
        Update: {
          access_level?: string
          asset_class?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          investment_type?: string | null
          location?: string | null
          location_detail?: string | null
          price_kes?: number | null
          slug?: string
          status?: string
          subtitle?: string | null
          summary?: string | null
          target_irr?: string | null
          target_yield?: string | null
          teaser?: string | null
          title?: string
        }
        Relationships: []
      }
      investment_scenarios: {
        Row: {
          created_at: string
          deal_id: string | null
          id: string
          inputs: Json
          name: string
          results: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deal_id?: string | null
          id?: string
          inputs: Json
          name: string
          results?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deal_id?: string | null
          id?: string
          inputs?: Json
          name?: string
          results?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_scenarios_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "off_market_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      legacy_user_ids: {
        Row: {
          email: string
          imported_at: string
          legacy_id: string
          user_id: string
        }
        Insert: {
          email: string
          imported_at?: string
          legacy_id: string
          user_id: string
        }
        Update: {
          email?: string
          imported_at?: string
          legacy_id?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      off_market_deals: {
        Row: {
          access_level: string
          acquisition_costs_pct: number | null
          asset_class: string | null
          city: string | null
          confidentiality: string | null
          country: string
          created_at: string
          figures_verified: boolean
          gross_annual_income_kes: number | null
          highlights: string[] | null
          id: string
          image_url: string | null
          indicative_price: string | null
          investment_rationale: string | null
          is_visible_to_verified: boolean
          lease_summary: string | null
          location: string | null
          location_detail: string | null
          metrics: Json | null
          minimumTicket: number | null
          occupancy_pct: number | null
          operating_expenses_kes: number | null
          price_kes: number | null
          risks: string | null
          status: string
          summary: string | null
          teaser: string | null
          title: string
          updated_at: string
        }
        Insert: {
          access_level?: string
          acquisition_costs_pct?: number | null
          asset_class?: string | null
          city?: string | null
          confidentiality?: string | null
          country?: string
          created_at?: string
          figures_verified?: boolean
          gross_annual_income_kes?: number | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          indicative_price?: string | null
          investment_rationale?: string | null
          is_visible_to_verified?: boolean
          lease_summary?: string | null
          location?: string | null
          location_detail?: string | null
          metrics?: Json | null
          minimumTicket?: number | null
          occupancy_pct?: number | null
          operating_expenses_kes?: number | null
          price_kes?: number | null
          risks?: string | null
          status?: string
          summary?: string | null
          teaser?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          access_level?: string
          acquisition_costs_pct?: number | null
          asset_class?: string | null
          city?: string | null
          confidentiality?: string | null
          country?: string
          created_at?: string
          figures_verified?: boolean
          gross_annual_income_kes?: number | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          indicative_price?: string | null
          investment_rationale?: string | null
          is_visible_to_verified?: boolean
          lease_summary?: string | null
          location?: string | null
          location_detail?: string | null
          metrics?: Json | null
          minimumTicket?: number | null
          occupancy_pct?: number | null
          operating_expenses_kes?: number | null
          price_kes?: number | null
          risks?: string | null
          status?: string
          summary?: string | null
          teaser?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      opportunity_comparisons: {
        Row: {
          created_at: string
          deal_ids: string[]
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deal_ids?: string[]
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deal_ids?: string[]
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunity_views: {
        Row: {
          deal_id: string
          user_id: string
          viewed_at: string
        }
        Insert: {
          deal_id: string
          user_id: string
          viewed_at?: string
        }
        Update: {
          deal_id?: string
          user_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_views_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "off_market_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_confirmations: {
        Row: {
          amount_kes: number | null
          amount_usd: number | null
          brief_title: string | null
          confirmed_at: string | null
          created_at: string
          id: string
          mpesa_message: string
          order_id: string | null
          order_type: string | null
          payment_method: string
          review_status: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount_kes?: number | null
          amount_usd?: number | null
          brief_title?: string | null
          confirmed_at?: string | null
          created_at?: string
          id?: string
          mpesa_message: string
          order_id?: string | null
          order_type?: string | null
          payment_method?: string
          review_status?: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount_kes?: number | null
          amount_usd?: number | null
          brief_title?: string | null
          confirmed_at?: string | null
          created_at?: string
          id?: string
          mpesa_message?: string
          order_id?: string | null
          order_type?: string | null
          payment_method?: string
          review_status?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_confirmations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "brief_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_holdings: {
        Row: {
          acquired_on: string | null
          annual_operating_expenses_kes: number | null
          annual_rental_income_kes: number | null
          asset_class: string | null
          asset_name: string
          capital_invested_kes: number | null
          created_at: string
          current_valuation_kes: number | null
          debt_outstanding_kes: number | null
          id: string
          location: string | null
          notes: string | null
          purchase_price_kes: number | null
          status: string
          updated_at: string
          user_id: string
          valuation_date: string | null
        }
        Insert: {
          acquired_on?: string | null
          annual_operating_expenses_kes?: number | null
          annual_rental_income_kes?: number | null
          asset_class?: string | null
          asset_name: string
          capital_invested_kes?: number | null
          created_at?: string
          current_valuation_kes?: number | null
          debt_outstanding_kes?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          purchase_price_kes?: number | null
          status?: string
          updated_at?: string
          user_id: string
          valuation_date?: string | null
        }
        Update: {
          acquired_on?: string | null
          annual_operating_expenses_kes?: number | null
          annual_rental_income_kes?: number | null
          asset_class?: string | null
          asset_name?: string
          capital_invested_kes?: number | null
          created_at?: string
          current_valuation_kes?: number | null
          debt_outstanding_kes?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          purchase_price_kes?: number | null
          status?: string
          updated_at?: string
          user_id?: string
          valuation_date?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          aum: string | null
          available_capital_kes: number | null
          avatar_url: string | null
          communication_preferences: Json
          country: string | null
          created_at: string
          email: string | null
          financing_preference: string | null
          full_name: string | null
          id: string
          investment_experience: string | null
          investment_focus: string | null
          investment_horizon_years: number | null
          investment_objectives: string[]
          investor_status: Database["public"]["Enums"]["investor_status"]
          investor_type: string | null
          last_login: string | null
          onboarding_completed_at: string | null
          organisation: string | null
          phone: string | null
          portfolio_value: number | null
          preferred_asset_classes: string[]
          preferred_currency: string
          preferred_markets: string[]
          risk_preference: string | null
          target_yield_pct: number | null
          title: string | null
          updated_at: string
          verification_notes: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          aum?: string | null
          available_capital_kes?: number | null
          avatar_url?: string | null
          communication_preferences?: Json
          country?: string | null
          created_at?: string
          email?: string | null
          financing_preference?: string | null
          full_name?: string | null
          id: string
          investment_experience?: string | null
          investment_focus?: string | null
          investment_horizon_years?: number | null
          investment_objectives?: string[]
          investor_status?: Database["public"]["Enums"]["investor_status"]
          investor_type?: string | null
          last_login?: string | null
          onboarding_completed_at?: string | null
          organisation?: string | null
          phone?: string | null
          portfolio_value?: number | null
          preferred_asset_classes?: string[]
          preferred_currency?: string
          preferred_markets?: string[]
          risk_preference?: string | null
          target_yield_pct?: number | null
          title?: string | null
          updated_at?: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          aum?: string | null
          available_capital_kes?: number | null
          avatar_url?: string | null
          communication_preferences?: Json
          country?: string | null
          created_at?: string
          email?: string | null
          financing_preference?: string | null
          full_name?: string | null
          id?: string
          investment_experience?: string | null
          investment_focus?: string | null
          investment_horizon_years?: number | null
          investment_objectives?: string[]
          investor_status?: Database["public"]["Enums"]["investor_status"]
          investor_type?: string | null
          last_login?: string | null
          onboarding_completed_at?: string | null
          organisation?: string | null
          phone?: string | null
          portfolio_value?: number | null
          preferred_asset_classes?: string[]
          preferred_currency?: string
          preferred_markets?: string[]
          risk_preference?: string | null
          target_yield_pct?: number | null
          title?: string | null
          updated_at?: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      publications: {
        Row: {
          access_level: string
          category: string
          created_at: string
          file_url: string | null
          fliphtml_url: string | null
          id: string
          is_portal_visible: boolean
          methodology: string | null
          published_at: string
          slug: string | null
          subtitle: string | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          access_level?: string
          category?: string
          created_at?: string
          file_url?: string | null
          fliphtml_url?: string | null
          id?: string
          is_portal_visible?: boolean
          methodology?: string | null
          published_at?: string
          slug?: string | null
          subtitle?: string | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          access_level?: string
          category?: string
          created_at?: string
          file_url?: string | null
          fliphtml_url?: string | null
          id?: string
          is_portal_visible?: boolean
          methodology?: string | null
          published_at?: string
          slug?: string | null
          subtitle?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_opportunities: {
        Row: {
          created_at: string
          deal_id: string
          id: string
          note: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          deal_id: string
          id?: string
          note?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          deal_id?: string
          id?: string
          note?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_opportunities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "off_market_deals"
            referencedColumns: ["id"]
          },
        ]
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
      current_investor_status: {
        Args: never
        Returns: Database["public"]["Enums"]["investor_status"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      investor_status: "registered" | "verified" | "premium" | "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      investor_status: ["registered", "verified", "premium", "admin"],
    },
  },
} as const
