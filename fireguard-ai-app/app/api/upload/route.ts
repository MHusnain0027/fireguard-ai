import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { uploadedLocations } from "@/data/uploaded";


export async function POST(req: Request) {

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



  const data:any = XLSX.utils.sheet_to_json(sheet);



  uploadedLocations.length = 0;


  data.forEach((row:any)=>{

    uploadedLocations.push({

      sno: row.SNO || row.sno,

      zone: row.Zone || row.zone,

      doorName: row["Door Name"] || row.doorName,

      code: row.Code || row.code

    });

  });



  return NextResponse.json({

    success:true,

    total: uploadedLocations.length

  });


}