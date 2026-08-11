import "server-only";

import { createClient } from "@supabase/supabase-js";

const projectUrl = "https://magpoxmpqlxhifegzwqd.supabase.co";

function readServerEnvironment() {
  const supabaseUrl = process.env.SUPABASE_URL?.trim() || projectUrl;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is missing. Add the rotated Supabase secret key to .env.local and Vercel Environment Variables.",
    );
  }

  if (serviceRoleKey.startsWith("sb_publishable_")) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY contains a publishable key. Use an sb_secret_ key or the legacy service_role key.",
    );
  }

  return { serviceRoleKey, supabaseUrl };
}

export function createServerSupabaseClient() {
  const { serviceRoleKey, supabaseUrl } = readServerEnvironment();

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
