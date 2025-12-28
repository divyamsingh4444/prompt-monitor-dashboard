export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      browser_instances: {
        Row: {
          browser_name: string;
          browser_version: string | null;
          device_id: string;
          discovered_at: string | null;
          extension_id: string | null;
          extension_version: string | null;
          instance_id: string;
          last_seen: string | null;
          profile_name: string;
          profile_path: string | null;
        };
        Insert: {
          browser_name: string;
          browser_version?: string | null;
          device_id: string;
          discovered_at?: string | null;
          extension_id?: string | null;
          extension_version?: string | null;
          instance_id: string;
          last_seen?: string | null;
          profile_name: string;
          profile_path?: string | null;
        };
        Update: {
          browser_name?: string;
          browser_version?: string | null;
          device_id?: string;
          discovered_at?: string | null;
          extension_id?: string | null;
          extension_version?: string | null;
          instance_id?: string;
          last_seen?: string | null;
          profile_name?: string;
          profile_path?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "browser_instances_device_id_fkey";
            columns: ["device_id"];
            isOneToOne: false;
            referencedRelation: "devices";
            referencedColumns: ["device_id"];
          },
        ];
      };
      compliance_events: {
        Row: {
          created_at: string | null;
          details: Json | null;
          detected_at: string;
          device_id: string;
          event_id: string;
          event_type: string;
          instance_id: string | null;
          reported_at: string | null;
          resolution_notes: string | null;
          resolved: boolean | null;
          resolved_at: string | null;
          resolved_by: string | null;
          severity: string;
          user_context: string | null;
        };
        Insert: {
          created_at?: string | null;
          details?: Json | null;
          detected_at: string;
          device_id: string;
          event_id: string;
          event_type: string;
          instance_id?: string | null;
          reported_at?: string | null;
          resolution_notes?: string | null;
          resolved?: boolean | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          severity: string;
          user_context?: string | null;
        };
        Update: {
          created_at?: string | null;
          details?: Json | null;
          detected_at?: string;
          device_id?: string;
          event_id?: string;
          event_type?: string;
          instance_id?: string | null;
          reported_at?: string | null;
          resolution_notes?: string | null;
          resolved?: boolean | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          severity?: string;
          user_context?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "compliance_events_device_id_fkey";
            columns: ["device_id"];
            isOneToOne: false;
            referencedRelation: "devices";
            referencedColumns: ["device_id"];
          },
          {
            foreignKeyName: "compliance_events_instance_id_fkey";
            columns: ["instance_id"];
            isOneToOne: false;
            referencedRelation: "browser_instances";
            referencedColumns: ["instance_id"];
          },
        ];
      };
      device_events: {
        Row: {
          browser_name: string | null;
          created_at: string | null;
          description: string | null;
          device_id: string;
          event_type: string;
          id: string;
          metadata: Json | null;
          profile_name: string | null;
          severity: string | null;
          site: string | null;
          timestamp: number;
          username: string | null;
        };
        Insert: {
          browser_name?: string | null;
          created_at?: string | null;
          description?: string | null;
          device_id: string;
          event_type: string;
          id: string;
          metadata?: Json | null;
          profile_name?: string | null;
          severity?: string | null;
          site?: string | null;
          timestamp: number;
          username?: string | null;
        };
        Update: {
          browser_name?: string | null;
          created_at?: string | null;
          description?: string | null;
          device_id?: string;
          event_type?: string;
          id?: string;
          metadata?: Json | null;
          profile_name?: string | null;
          severity?: string | null;
          site?: string | null;
          timestamp?: number;
          username?: string | null;
        };
        Relationships: [];
      };
      devices: {
        Row: {
          browsers: Json | null;
          device_id: string;
          hostname: string | null;
          ips: Json | null;
          last_heartbeat: string | null;
          macs: Json | null;
          os: string | null;
          public_key_pem: string;
          registered_at: string | null;
        };
        Insert: {
          browsers?: Json | null;
          device_id: string;
          hostname?: string | null;
          ips?: Json | null;
          last_heartbeat?: string | null;
          macs?: Json | null;
          os?: string | null;
          public_key_pem: string;
          registered_at?: string | null;
        };
        Update: {
          browsers?: Json | null;
          device_id?: string;
          hostname?: string | null;
          ips?: Json | null;
          last_heartbeat?: string | null;
          macs?: Json | null;
          os?: string | null;
          public_key_pem?: string;
          registered_at?: string | null;
        };
        Relationships: [];
      };
      extension_status: {
        Row: {
          created_at: string | null;
          instance_id: string;
          metadata: Json | null;
          reported_at: string | null;
          reported_by: string | null;
          status: string;
          status_id: string;
        };
        Insert: {
          created_at?: string | null;
          instance_id: string;
          metadata?: Json | null;
          reported_at?: string | null;
          reported_by?: string | null;
          status: string;
          status_id: string;
        };
        Update: {
          created_at?: string | null;
          instance_id?: string;
          metadata?: Json | null;
          reported_at?: string | null;
          reported_by?: string | null;
          status?: string;
          status_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "extension_status_instance_id_fkey";
            columns: ["instance_id"];
            isOneToOne: false;
            referencedRelation: "browser_instances";
            referencedColumns: ["instance_id"];
          },
        ];
      };
      installations: {
        Row: {
          created_at: string | null;
          device_id: string;
          installation_id: string;
          installation_metadata: Json | null;
          installed_at: string | null;
          installed_by_user: string | null;
          installer_version: string;
        };
        Insert: {
          created_at?: string | null;
          device_id: string;
          installation_id: string;
          installation_metadata?: Json | null;
          installed_at?: string | null;
          installed_by_user?: string | null;
          installer_version: string;
        };
        Update: {
          created_at?: string | null;
          device_id?: string;
          installation_id?: string;
          installation_metadata?: Json | null;
          installed_at?: string | null;
          installed_by_user?: string | null;
          installer_version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "installations_device_id_fkey";
            columns: ["device_id"];
            isOneToOne: false;
            referencedRelation: "devices";
            referencedColumns: ["device_id"];
          },
        ];
      };
      login_sessions: {
        Row: {
          active: boolean | null;
          created_at: string | null;
          device_id: string;
          login_at: string;
          logout_at: string | null;
          session_duration: number | null;
          session_id: string;
          username: string;
        };
        Insert: {
          active?: boolean | null;
          created_at?: string | null;
          device_id: string;
          login_at: string;
          logout_at?: string | null;
          session_duration?: number | null;
          session_id: string;
          username: string;
        };
        Update: {
          active?: boolean | null;
          created_at?: string | null;
          device_id?: string;
          login_at?: string;
          logout_at?: string | null;
          session_duration?: number | null;
          session_id?: string;
          username?: string;
        };
        Relationships: [
          {
            foreignKeyName: "login_sessions_device_id_fkey";
            columns: ["device_id"];
            isOneToOne: false;
            referencedRelation: "devices";
            referencedColumns: ["device_id"];
          },
        ];
      };
      metadata_history: {
        Row: {
          captured_at: string;
          created_at: string | null;
          device_id: string;
          history_id: string;
          snapshot_data: Json;
          snapshot_type: string;
        };
        Insert: {
          captured_at: string;
          created_at?: string | null;
          device_id: string;
          history_id: string;
          snapshot_data: Json;
          snapshot_type: string;
        };
        Update: {
          captured_at?: string;
          created_at?: string | null;
          device_id?: string;
          history_id?: string;
          snapshot_data?: Json;
          snapshot_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "metadata_history_device_id_fkey";
            columns: ["device_id"];
            isOneToOne: false;
            referencedRelation: "devices";
            referencedColumns: ["device_id"];
          },
        ];
      };
      prompts: {
        Row: {
          agent_status: string | null;
          browser_name: string | null;
          browser_version: string | null;
          conversation_id: string | null;
          created_at: string | null;
          device_id: string | null;
          extension_version: string | null;
          id: string;
          instance_id: string | null;
          ist_inserted_at: string | null;
          page_title: string | null;
          profile_name: string | null;
          prompt: string | null;
          selector: string | null;
          site: string | null;
          timestamp: number | null;
          trigger: string | null;
          url: string | null;
          username: string | null;
        };
        Insert: {
          agent_status?: string | null;
          browser_name?: string | null;
          browser_version?: string | null;
          conversation_id?: string | null;
          created_at?: string | null;
          device_id?: string | null;
          extension_version?: string | null;
          id: string;
          instance_id?: string | null;
          ist_inserted_at?: string | null;
          page_title?: string | null;
          profile_name?: string | null;
          prompt?: string | null;
          selector?: string | null;
          site?: string | null;
          timestamp?: number | null;
          trigger?: string | null;
          url?: string | null;
          username?: string | null;
        };
        Update: {
          agent_status?: string | null;
          browser_name?: string | null;
          browser_version?: string | null;
          conversation_id?: string | null;
          created_at?: string | null;
          device_id?: string | null;
          extension_version?: string | null;
          id?: string;
          instance_id?: string | null;
          ist_inserted_at?: string | null;
          page_title?: string | null;
          profile_name?: string | null;
          prompt?: string | null;
          selector?: string | null;
          site?: string | null;
          timestamp?: number | null;
          trigger?: string | null;
          url?: string | null;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "prompts_device_id_fkey";
            columns: ["device_id"];
            isOneToOne: false;
            referencedRelation: "devices";
            referencedColumns: ["device_id"];
          },
          {
            foreignKeyName: "prompts_instance_id_fkey";
            columns: ["instance_id"];
            isOneToOne: false;
            referencedRelation: "browser_instances";
            referencedColumns: ["instance_id"];
          },
        ];
      };
      service_status: {
        Row: {
          created_at: string | null;
          device_id: string;
          last_heartbeat: string | null;
          metadata: Json | null;
          reported_at: string | null;
          service_running: boolean;
          status_id: string;
          uptime_seconds: number | null;
        };
        Insert: {
          created_at?: string | null;
          device_id: string;
          last_heartbeat?: string | null;
          metadata?: Json | null;
          reported_at?: string | null;
          service_running: boolean;
          status_id: string;
          uptime_seconds?: number | null;
        };
        Update: {
          created_at?: string | null;
          device_id?: string;
          last_heartbeat?: string | null;
          metadata?: Json | null;
          reported_at?: string | null;
          service_running?: boolean;
          status_id?: string;
          uptime_seconds?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "service_status_device_id_fkey";
            columns: ["device_id"];
            isOneToOne: false;
            referencedRelation: "devices";
            referencedColumns: ["device_id"];
          },
        ];
      };
      used_tokens: {
        Row: {
          device_id: string | null;
          expires_at: string | null;
          jti: string;
          used_at: string | null;
        };
        Insert: {
          device_id?: string | null;
          expires_at?: string | null;
          jti: string;
          used_at?: string | null;
        };
        Update: {
          device_id?: string | null;
          expires_at?: string | null;
          jti?: string;
          used_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
