import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Server-side client using anon key
// Since RLS is disabled on tables, anon key works fine for all operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey);

