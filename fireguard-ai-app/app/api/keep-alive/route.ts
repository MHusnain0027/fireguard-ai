import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/app/lib/supabase-server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request) {
  const headers = { "Cache-Control": "no-store, max-age=0" };
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false }, { status: 401, headers });
  }

  try {
    const supabase = createServerSupabaseClient();
    const signal = AbortSignal.timeout(25000);
    // Eight lightweight, read-only database queries in one daily run.
    // This runs on Vercel even while every user's browser is closed.
    for (let index = 0; index < 8; index += 1) {
      const { error } = await supabase
        .from("locations")
        .select("id")
        .order("id", { ascending: true })
        .range(index, index)
        .abortSignal(signal);
      if (error) throw new Error(error.message);
    }
    return NextResponse.json(
      { success: true, queries: 8, checkedAt: new Date().toISOString() },
      { headers },
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Database activity check failed" },
      { status: 503, headers },
    );
  }
}
