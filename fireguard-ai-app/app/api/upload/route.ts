import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { firebaseAdminAuth } from "@/app/lib/firebase-admin";
import { createServerSupabaseClient } from "@/app/lib/supabase-server";

type ExcelRow = Record<string, unknown>;

type LocationInsert = {
  SNO: string;
  District_Code: string;
  District_Name: string;
  Code: string;
  Door_Name: string;
  Zone: string;
};

export const runtime = "nodejs";

function readExcelValue(row: ExcelRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];

    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }

  return "";
}

function createLocationKey(location: LocationInsert) {
  return [
    location.District_Code,
    location.District_Name,
    location.Code,
    location.Door_Name,
    location.Zone,
  ]
    .map((value) => value.trim().toLowerCase().replace(/\s+/g, " "))
    .join("\u001f");
}

async function verifyAdmin(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";

  if (!authorization.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  await firebaseAdminAuth.verifyIdToken(token);
}

export async function POST(request: Request) {
  try {
    await verifyAdmin(request);

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No Excel file selected" },
        { status: 400 },
      );
    }

    const fileName = file.name.toLowerCase();

    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
      return NextResponse.json(
        { success: false, message: "Only .xlsx or .xls files are allowed" },
        { status: 400 },
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Excel file must be smaller than 10 MB" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const workbook = XLSX.read(Buffer.from(bytes), { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      return NextResponse.json(
        { success: false, message: "Excel workbook has no worksheet" },
        { status: 400 },
      );
    }

    const sheet = workbook.Sheets[firstSheetName];
    const excelData = XLSX.utils.sheet_to_json<ExcelRow>(sheet, {
      defval: "",
    });

    if (excelData.length === 0) {
      return NextResponse.json(
        { success: false, message: "Excel file is empty" },
        { status: 400 },
      );
    }

    const locations: LocationInsert[] = excelData.map((row) => ({
      SNO: readExcelValue(row, ["SNO", "Sno", "sno"]),
      District_Code: readExcelValue(row, [
        "District_Code",
        "District Code",
        "district_code",
      ]),
      District_Name: readExcelValue(row, [
        "District_Name",
        "District Name",
        "district_name",
      ]),
      Code: readExcelValue(row, ["Code", "CODE", "code"]),
      Door_Name: readExcelValue(row, [
        "Door_Name",
        "Door Name",
        "door_name",
        "DoorName",
      ]),
      Zone: readExcelValue(row, ["Zone", "ZONE", "zone"]),
    }));

    const invalidIndex = locations.findIndex(
      (location) =>
        !location.SNO ||
        !location.District_Code ||
        !location.District_Name ||
        !location.Code ||
        !location.Door_Name ||
        !location.Zone,
    );

    if (invalidIndex !== -1) {
      return NextResponse.json(
        {
          success: false,
          message: `Excel row ${invalidIndex + 2} is missing a required value`,
        },
        { status: 400 },
      );
    }

    const supabase = createServerSupabaseClient();
    const { data: existingRows, error: existingError } = await supabase
      .from("locations")
      .select("SNO,District_Code,District_Name,Code,Door_Name,Zone")
      .range(0, 9999);

    if (existingError) {
      throw new Error(existingError.message);
    }

    const knownLocations = new Set(
      (existingRows ?? []).map((row) =>
        createLocationKey(row as LocationInsert),
      ),
    );
    const newLocations: LocationInsert[] = [];
    let skippedLocations = 0;

    for (const location of locations) {
      const locationKey = createLocationKey(location);

      if (knownLocations.has(locationKey)) {
        skippedLocations += 1;
        continue;
      }

      knownLocations.add(locationKey);
      newLocations.push(location);
    }

    if (newLocations.length === 0) {
      return NextResponse.json({
        success: true,
        inserted: 0,
        skipped: skippedLocations,
        total: existingRows?.length ?? 0,
        message: `No new locations were added. ${skippedLocations} duplicate location(s) skipped. Existing data was kept.`,
      });
    }

    const { data: insertedRows, error: insertError } = await supabase
      .from("locations")
      .insert(newLocations)
      .select("id");

    if (insertError) {
      throw new Error(insertError.message);
    }

    return NextResponse.json({
      success: true,
      inserted: insertedRows.length,
      skipped: skippedLocations,
      total: (existingRows?.length ?? 0) + insertedRows.length,
      message: `${insertedRows.length} new location(s) added. ${skippedLocations} duplicate location(s) skipped. Existing data was kept.`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";

    if (message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, message: "Admin login required" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
