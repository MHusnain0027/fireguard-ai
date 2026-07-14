import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { supabase } from "@/app/lib/supabase";

export async function POST(req: Request) {

  try {

    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({
        success: false,
        message: "No file selected"
      });
    }


    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);


    const workbook = XLSX.read(buffer, {
      type: "buffer"
    });


    const sheet = workbook.Sheets[workbook.SheetNames[0]];


    const excelData: any[] = XLSX.utils.sheet_to_json(sheet);


    console.log("EXCEL RECORDS:", excelData.length);


    if (excelData.length === 0) {

      return NextResponse.json({
        success: false,
        message: "Excel file is empty"
      });

    }


    const locations = excelData.map((row: any) => ({

      SNO: String(row.SNO ?? ""),

      District_Code: String(
        row["District Code"] ?? row.District_Code ?? ""
      ),

      District_Name: String(
        row["District Name"] ?? row.District_Name ?? ""
      ),

      Code: String(
        row.Code ?? ""
      ),

      Door_Name: String(
        row["Door Name"] ?? row.Door_Name ?? ""
      ),

      Zone: String(
        row.Zone ?? ""
      )

    }));


    console.log("DATA TO INSERT:", locations);



    // INSERT NEW RECORDS ONLY
    // Old data will remain safe

    const { data, error } = await supabase

      .from("locations")

      .insert(locations)

      .select();



    if (error) {

      console.log(
        "INSERT ERROR:",
        error
      );


      return NextResponse.json({

        success:false,

        message:error.message

      });

    }



    return NextResponse.json({

      success:true,

      total:data.length,

      message:"Excel uploaded successfully"

    });



  }


  catch(error:any) {


    console.log(
      "UPLOAD ERROR:",
      error
    );


    return NextResponse.json({

      success:false,

      message:error.message

    });


  }

}