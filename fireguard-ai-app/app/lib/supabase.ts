import { createClient } from "@supabase/supabase-js";

// Supabase's /rest/v1/ address belongs to PostgREST. The JavaScript client
// needs the project base URL, so the supplied project ID is used here.
const supabaseUrl = "https://magpoxmpqlxhifegzwqd.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
