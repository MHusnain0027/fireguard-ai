import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/app/lib/supabase-server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const data: Record<string, unknown>[] = [];
    const ids = new Set<unknown>();
    const signal = AbortSignal.timeout(25000);
    let expectedTotal: number | undefined;

    // Supabase caps each response independently of the requested range.
    // Advance by the number actually returned, keeping duplicate Codes.
    do {
      const { data: page, error, count } = await supabase
        .from("locations")
        .select("id,SNO,District_Code,District_Name,Code,Door_Name,Zone", {
          count: "exact",
        })
        .order("id", { ascending: true })
        .range(data.length, data.length + 499)
        .abortSignal(signal);

      if (error) throw new Error(error.message);
      if (!page || count === null) throw new Error("Incomplete locations response");
      if (expectedTotal !== undefined && count !== expectedTotal) {
        throw new Error("Locations changed during sync. Please retry.");
      }
      expectedTotal = count;
      for (const row of page) {
        if (row.id == null || ids.has(row.id)) {
          throw new Error("Locations changed during sync. Please retry.");
        }
        ids.add(row.id);
        data.push(row);
      }
      if ((!page.length && data.length < count) || data.length > count) {
        throw new Error("Incomplete locations response");
      }
    } while (data.length < expectedTotal);

    return NextResponse.json(
      {
        success: true,
        complete: true,
        syncedAt: new Date().toISOString(),
        total: data.length,
        locations: data,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Database connection failed",
        locations: [],
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  }
}
