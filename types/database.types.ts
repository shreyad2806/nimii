export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type MessageRole = "system" | "user" | "assistant" | "tool";
export type MemoryType = "fact" | "preference" | "decision" | "research" | "project" | "other";
export type OpenLoopStatus = "pending" | "in_progress" | "completed" | "archived";
export type OpenLoopPriority = "low" | "medium" | "high";

type Relationship<
  Name extends string,
  Columns extends string[],
  Relation extends string,
  ReferencedColumns extends string[],
  OneToOne extends boolean = false,
> = {
  foreignKeyName: Name;
  columns: Columns;
  isOneToOne: OneToOne;
  referencedRelation: Relation;
  referencedColumns: ReferencedColumns;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          Relationship<"conversations_user_id_fkey", ["user_id"], "profiles", ["id"]>,
        ];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: MessageRole;
          content: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: MessageRole;
          content: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: MessageRole;
          content?: string;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [
          Relationship<"messages_conversation_id_fkey", ["conversation_id"], "conversations", ["id"]>,
        ];
      };
      memories: {
        Row: {
          id: string;
          user_id: string;
          source_message_id: string | null;
          content: string;
          memory_type: MemoryType;
          tags: string[];
          importance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source_message_id?: string | null;
          content: string;
          memory_type: MemoryType;
          tags?: string[];
          importance?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          source_message_id?: string | null;
          content?: string;
          memory_type?: MemoryType;
          tags?: string[];
          importance?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          Relationship<"memories_source_message_id_fkey", ["source_message_id"], "messages", ["id"]>,
          Relationship<"memories_user_id_fkey", ["user_id"], "profiles", ["id"]>,
        ];
      };
      sources: {
        Row: {
          id: string;
          message_id: string;
          url: string;
          title: string;
          snippet: string | null;
          domain: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          message_id: string;
          url: string;
          title: string;
          snippet?: string | null;
          domain: string;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          message_id?: string;
          url?: string;
          title?: string;
          snippet?: string | null;
          domain?: string;
          position?: number;
          created_at?: string;
        };
        Relationships: [
          Relationship<"sources_message_id_fkey", ["message_id"], "messages", ["id"]>,
        ];
      };
      open_loops: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          status: OpenLoopStatus;
          priority: OpenLoopPriority;
          due_date: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          status?: OpenLoopStatus;
          priority?: OpenLoopPriority;
          due_date?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          status?: OpenLoopStatus;
          priority?: OpenLoopPriority;
          due_date?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          Relationship<"open_loops_user_id_fkey", ["user_id"], "profiles", ["id"]>,
        ];
      };
      search_logs: {
        Row: {
          id: string;
          user_id: string;
          message_id: string | null;
          query: string;
          duration_ms: number;
          result_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          message_id?: string | null;
          query: string;
          duration_ms: number;
          result_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          message_id?: string | null;
          query?: string;
          duration_ms?: number;
          result_count?: number;
          created_at?: string;
        };
        Relationships: [
          Relationship<"search_logs_message_id_fkey", ["message_id"], "messages", ["id"]>,
          Relationship<"search_logs_user_id_fkey", ["user_id"], "profiles", ["id"]>,
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
