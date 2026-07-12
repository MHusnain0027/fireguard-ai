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




    const workbook = XLSX.read(buffer, {

      type:"buffer"

    });




    const sheet = workbook.Sheets[workbook.SheetNames[0]];



    const excelData:any[] = XLSX.utils.sheet_to_json(sheet);




    if(excelData.length === 0){

      return NextResponse.json({

        success:false,

        message:"Excel file is empty"

      });

    }




    const locations = excelData.map((row:any)=>({


      sno:

      String(
        row.SNO ||
        row.sno ||
        ""
      ),



      zone:

      row.Zone ||
      row.zone ||
      "",



      door_name:

      row["Door Name"] ||
      row.doorName ||
      "",



      code:

      row.Code ||
      row.code ||
      ""


    }));





    // Remove old database records

    await supabase

    .from("locations")

    .delete()

    .neq("id",0);





    // Insert new records

    const {error} = await supabase

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