export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      alerts: {
        Row: {
          alert_type: string;
          conditionant_id: string | null;
          created_at: string;
          due_date: string | null;
          id: string;
          message: string;
          project_id: string | null;
          resolved: boolean;
          severity: Database["public"]["Enums"]["risk_level"];
        };
        Insert: {
          alert_type: string;
          conditionant_id?: string | null;
          created_at?: string;
          due_date?: string | null;
          id?: string;
          message: string;
          project_id?: string | null;
          resolved?: boolean;
          severity?: Database["public"]["Enums"]["risk_level"];
        };
        Update: {
          alert_type?: string;
          conditionant_id?: string | null;
          created_at?: string;
          due_date?: string | null;
          id?: string;
          message?: string;
          project_id?: string | null;
          resolved?: boolean;
          severity?: Database["public"]["Enums"]["risk_level"];
        };
        Relationships: [
          {
            foreignKeyName: "alerts_conditionant_id_fkey";
            columns: ["conditionant_id"];
            isOneToOne: false;
            referencedRelation: "conditionants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "alerts_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          action: string;
          created_at: string;
          entity_id: string | null;
          entity_type: string;
          id: string;
          payload: Json | null;
          user_id: string | null;
        };
        Insert: {
          action: string;
          created_at?: string;
          entity_id?: string | null;
          entity_type: string;
          id?: string;
          payload?: Json | null;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          created_at?: string;
          entity_id?: string | null;
          entity_type?: string;
          id?: string;
          payload?: Json | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      conditionant_impact_links: {
        Row: {
          conditionant_id: string;
          created_at: string;
          id: string;
          impact_id: string;
          link_type: string | null;
        };
        Insert: {
          conditionant_id: string;
          created_at?: string;
          id?: string;
          impact_id: string;
          link_type?: string | null;
        };
        Update: {
          conditionant_id?: string;
          created_at?: string;
          id?: string;
          impact_id?: string;
          link_type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "conditionant_impact_links_conditionant_id_fkey";
            columns: ["conditionant_id"];
            isOneToOne: false;
            referencedRelation: "conditionants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conditionant_impact_links_impact_id_fkey";
            columns: ["impact_id"];
            isOneToOne: false;
            referencedRelation: "impacts";
            referencedColumns: ["id"];
          },
        ];
      };
      conditionants: {
        Row: {
          authority_receiver: string | null;
          category_code: Database["public"]["Enums"]["cat_code"] | null;
          confidence_score: number | null;
          created_at: string;
          deadline_date: string | null;
          evidence_type: string | null;
          executive_summary: string | null;
          frequency: Database["public"]["Enums"]["cond_frequency"] | null;
          id: string;
          obligation_type: Database["public"]["Enums"]["cond_obligation"] | null;
          observations: string | null;
          original_text: string;
          page_reference: number | null;
          project_id: string;
          required_evidence: string | null;
          responsible_role: string | null;
          risk_level: Database["public"]["Enums"]["risk_level"];
          source_document_id: string | null;
          stage: Database["public"]["Enums"]["cond_stage"] | null;
          status: Database["public"]["Enums"]["cond_status"];
          updated_at: string;
        };
        Insert: {
          authority_receiver?: string | null;
          category_code?: Database["public"]["Enums"]["cat_code"] | null;
          confidence_score?: number | null;
          created_at?: string;
          deadline_date?: string | null;
          evidence_type?: string | null;
          executive_summary?: string | null;
          frequency?: Database["public"]["Enums"]["cond_frequency"] | null;
          id?: string;
          obligation_type?: Database["public"]["Enums"]["cond_obligation"] | null;
          observations?: string | null;
          original_text: string;
          page_reference?: number | null;
          project_id: string;
          required_evidence?: string | null;
          responsible_role?: string | null;
          risk_level?: Database["public"]["Enums"]["risk_level"];
          source_document_id?: string | null;
          stage?: Database["public"]["Enums"]["cond_stage"] | null;
          status?: Database["public"]["Enums"]["cond_status"];
          updated_at?: string;
        };
        Update: {
          authority_receiver?: string | null;
          category_code?: Database["public"]["Enums"]["cat_code"] | null;
          confidence_score?: number | null;
          created_at?: string;
          deadline_date?: string | null;
          evidence_type?: string | null;
          executive_summary?: string | null;
          frequency?: Database["public"]["Enums"]["cond_frequency"] | null;
          id?: string;
          obligation_type?: Database["public"]["Enums"]["cond_obligation"] | null;
          observations?: string | null;
          original_text?: string;
          page_reference?: number | null;
          project_id?: string;
          required_evidence?: string | null;
          responsible_role?: string | null;
          risk_level?: Database["public"]["Enums"]["risk_level"];
          source_document_id?: string | null;
          stage?: Database["public"]["Enums"]["cond_stage"] | null;
          status?: Database["public"]["Enums"]["cond_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conditionants_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conditionants_source_document_id_fkey";
            columns: ["source_document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
        ];
      };
      documents: {
        Row: {
          ai_summary: Json | null;
          created_at: string;
          doc_type: Database["public"]["Enums"]["doc_type"];
          extracted_text: string | null;
          id: string;
          name: string;
          pages: number | null;
          project_id: string | null;
          status: Database["public"]["Enums"]["doc_status"];
          storage_path: string;
          updated_at: string;
          uploaded_by: string | null;
        };
        Insert: {
          ai_summary?: Json | null;
          created_at?: string;
          doc_type: Database["public"]["Enums"]["doc_type"];
          extracted_text?: string | null;
          id?: string;
          name: string;
          pages?: number | null;
          project_id?: string | null;
          status?: Database["public"]["Enums"]["doc_status"];
          storage_path: string;
          updated_at?: string;
          uploaded_by?: string | null;
        };
        Update: {
          ai_summary?: Json | null;
          created_at?: string;
          doc_type?: Database["public"]["Enums"]["doc_type"];
          extracted_text?: string | null;
          id?: string;
          name?: string;
          pages?: number | null;
          project_id?: string | null;
          status?: Database["public"]["Enums"]["doc_status"];
          storage_path?: string;
          updated_at?: string;
          uploaded_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "documents_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      evidences: {
        Row: {
          conditionant_id: string;
          created_at: string;
          description: string | null;
          evidence_date: string | null;
          evidence_type: string | null;
          file_url: string | null;
          geolocation: string | null;
          id: string;
          updated_at: string;
          uploaded_by: string | null;
          validation_status: Database["public"]["Enums"]["evidence_status"];
        };
        Insert: {
          conditionant_id: string;
          created_at?: string;
          description?: string | null;
          evidence_date?: string | null;
          evidence_type?: string | null;
          file_url?: string | null;
          geolocation?: string | null;
          id?: string;
          updated_at?: string;
          uploaded_by?: string | null;
          validation_status?: Database["public"]["Enums"]["evidence_status"];
        };
        Update: {
          conditionant_id?: string;
          created_at?: string;
          description?: string | null;
          evidence_date?: string | null;
          evidence_type?: string | null;
          file_url?: string | null;
          geolocation?: string | null;
          id?: string;
          updated_at?: string;
          uploaded_by?: string | null;
          validation_status?: Database["public"]["Enums"]["evidence_status"];
        };
        Relationships: [
          {
            foreignKeyName: "evidences_conditionant_id_fkey";
            columns: ["conditionant_id"];
            isOneToOne: false;
            referencedRelation: "conditionants";
            referencedColumns: ["id"];
          },
        ];
      };
      impacts: {
        Row: {
          alert_type: string | null;
          cause: string | null;
          created_at: string;
          environmental_factor: string | null;
          evidence_required: string | null;
          frequency: string | null;
          id: string;
          impact_key: string;
          impact_title: string;
          mitigation_measure: string | null;
          project_id: string | null;
          source_document_id: string | null;
          updated_at: string;
        };
        Insert: {
          alert_type?: string | null;
          cause?: string | null;
          created_at?: string;
          environmental_factor?: string | null;
          evidence_required?: string | null;
          frequency?: string | null;
          id?: string;
          impact_key: string;
          impact_title: string;
          mitigation_measure?: string | null;
          project_id?: string | null;
          source_document_id?: string | null;
          updated_at?: string;
        };
        Update: {
          alert_type?: string | null;
          cause?: string | null;
          created_at?: string;
          environmental_factor?: string | null;
          evidence_required?: string | null;
          frequency?: string | null;
          id?: string;
          impact_key?: string;
          impact_title?: string;
          mitigation_measure?: string | null;
          project_id?: string | null;
          source_document_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "impacts_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "impacts_source_document_id_fkey";
            columns: ["source_document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          activity: string | null;
          authority: string | null;
          coordinates: string | null;
          created_at: string;
          created_by: string | null;
          expediente: string | null;
          id: string;
          location: string | null;
          municipality: string | null;
          name: string;
          promovente: string | null;
          resolution_date: string | null;
          state: string | null;
          surface: string | null;
          updated_at: string;
          vigencia: string | null;
          volume: string | null;
        };
        Insert: {
          activity?: string | null;
          authority?: string | null;
          coordinates?: string | null;
          created_at?: string;
          created_by?: string | null;
          expediente?: string | null;
          id?: string;
          location?: string | null;
          municipality?: string | null;
          name: string;
          promovente?: string | null;
          resolution_date?: string | null;
          state?: string | null;
          surface?: string | null;
          updated_at?: string;
          vigencia?: string | null;
          volume?: string | null;
        };
        Update: {
          activity?: string | null;
          authority?: string | null;
          coordinates?: string | null;
          created_at?: string;
          created_by?: string | null;
          expediente?: string | null;
          id?: string;
          location?: string | null;
          municipality?: string | null;
          name?: string;
          promovente?: string | null;
          resolution_date?: string | null;
          state?: string | null;
          surface?: string | null;
          updated_at?: string;
          vigencia?: string | null;
          volume?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role:
        | "admin"
        | "jefe_ma"
        | "jefe_ma_sgi"
        | "coordinador_ambiental"
        | "supervisor_ambiental"
        | "coordinador_seguridad"
        | "supervisor_seguridad";
      cat_code: "C01" | "C02" | "C03" | "C04" | "C05" | "C06" | "C07" | "C08" | "C09" | "C10";
      cond_frequency:
        | "única"
        | "diaria"
        | "semanal"
        | "mensual"
        | "semestral"
        | "anual"
        | "por incidencia"
        | "cierre";
      cond_obligation:
        | "acción"
        | "prohibición"
        | "permiso"
        | "evidencia"
        | "reporte"
        | "restauración"
        | "monitoreo"
        | "compensación"
        | "restricción";
      cond_stage:
        | "previo"
        | "preparación"
        | "operación"
        | "mantenimiento"
        | "restauración"
        | "cierre";
      cond_status:
        | "pendiente"
        | "en proceso"
        | "cumple"
        | "no cumple"
        | "vencida"
        | "no aplica"
        | "requiere aclaración";
      doc_status: "subido" | "ocr" | "procesando" | "procesado" | "error";
      doc_type: "mia" | "resolucion" | "catalogo" | "evidencia";
      evidence_status: "pendiente" | "validada" | "rechazada" | "faltante";
      risk_level: "crítico" | "alto" | "medio" | "bajo";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

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
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    Enums: {
      app_role: [
        "admin",
        "jefe_ma",
        "jefe_ma_sgi",
        "coordinador_ambiental",
        "supervisor_ambiental",
        "coordinador_seguridad",
        "supervisor_seguridad",
      ],
      cat_code: ["C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C10"],
      cond_frequency: [
        "única",
        "diaria",
        "semanal",
        "mensual",
        "semestral",
        "anual",
        "por incidencia",
        "cierre",
      ],
      cond_obligation: [
        "acción",
        "prohibición",
        "permiso",
        "evidencia",
        "reporte",
        "restauración",
        "monitoreo",
        "compensación",
        "restricción",
      ],
      cond_stage: ["previo", "preparación", "operación", "mantenimiento", "restauración", "cierre"],
      cond_status: [
        "pendiente",
        "en proceso",
        "cumple",
        "no cumple",
        "vencida",
        "no aplica",
        "requiere aclaración",
      ],
      doc_status: ["subido", "ocr", "procesando", "procesado", "error"],
      doc_type: ["mia", "resolucion", "catalogo", "evidencia"],
      evidence_status: ["pendiente", "validada", "rechazada", "faltante"],
      risk_level: ["crítico", "alto", "medio", "bajo"],
    },
  },
} as const;
