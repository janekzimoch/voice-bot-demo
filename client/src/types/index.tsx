import { User } from "@supabase/supabase-js";

export enum Client {
  user,
  bot,
}

export interface MessageType {
  client: Client;
  message: string;
}

export interface Settings {
  salesperson_name: string;
  salesperson_role: string;
  company_name: string;
  company_business: string;
  company_values: string;
  conversation_purpose: string;
  custom_prompt: string;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
}
