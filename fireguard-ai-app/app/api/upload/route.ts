import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { supabase } from "@/app/lib/supabase";


export async function POST(req: Request) {

  try {

    const formData = await req.formData();

    const file = formData.get("file") as File;


    if(!file){

      return NextResponse.json({
        success:false,
        message:"No file selected"
      });

    }


    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);



    const workbook = XLSX.read(buffer,{
      type:"buffer"
    });



    const sheet = workbook.Sheets[workbook.SheetNames[0]];


    const excelData:any[] =
      XLSX.utils.sheet_to_json(sheet);



    if(excelData.length === 0){

      return NextResponse.json({
        success:false,
        message:"Excel is empty"
      });

    }



    const locations = excelData.map((row:any)=>({

      SNO:
      String(row.SNO || ""),


      District_Code:
      String(row["District Code"] || ""),


      District_Name:
      String(row["District Name"] || ""),


      Code:
      String(row.Code || ""),


      Door_Name:
      String(row["Door Name"] || ""),


      Zone:
      String(row.Zone || "")

    }));




    // Remove old records

    const {error:deleteError}=await supabase
    .from("locations")
    .delete()
    .gte("id",0);



    if(deleteError){

      return NextResponse.json({

        success:false,

        message:deleteError.message

      });

    }





    // Insert new records

    const {error}=await supabase
    .from("locations")
    .insert(locations);



    if(error){

      return NextResponse.json({

        success:false,

        message:error.message

      });

    }



    return NextResponse.json({

      success:true,

      total:locations.length

    });



  }

  catch(error:any){


    return NextResponse.json({

      success:false,

      message:error.message

    });


  }

}