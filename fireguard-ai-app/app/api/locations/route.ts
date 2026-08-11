import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/app/lib/supabase-server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("locations")
      .select("id,SNO,District_Code,District_Name,Code,Door_Name,Zone")
      .order("id", { ascending: true })
      .range(0, 4999);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          locations: [],
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
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
