import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  created_at: string;
  status: "pending" | "contacted" | "completed";
}
