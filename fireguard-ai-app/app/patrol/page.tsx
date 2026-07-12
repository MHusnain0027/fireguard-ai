"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";


export default function PatrolPage() {


  const [message,setMessage] = useState("");

  const [reports,setReports] = useState<any[]>([]);



  const [form,setForm] = useState({

    date: new Date().toLocaleDateString(),

    time: new Date().toLocaleTimeString(),

    callSign:"",

    patrolType:"",

    location:"",

    description:"",

    remarks:"",

    tnSr:""

  });






  useEffect(()=>{


    const saved = localStorage.getItem(

      "fireguard_patrol_reports"

    );


    if(saved){

      setReports(

        JSON.parse(saved)

      );

    }


  },[]);








  function updateField(e:any){


    setForm({

      ...form,

      [e.target.name]:e.target.value

    });


  }









  function addReport(){



    if(

      !form.callSign ||

      !form.patrolType ||

      !form.location ||

      !form.description

    ){

      setMessage(

        "⚠️ Please fill required fields"

      );


      return;

    }






    const newReport = {


      ...form,

      date:new Date().toLocaleDateString(),

      time:new Date().toLocaleTimeString()


    };





    const updated = [


      ...reports,

      newReport


    ];





    setReports(updated);




    localStorage.setItem(

      "fireguard_patrol_reports",

      JSON.stringify(updated)

    );





    setMessage(

      "✅ Patrol Entry Added Successfully"

    );





    setForm({

      ...form,

      callSign:"",

      patrolType:"",

      location:"",

      description:"",

      remarks:"",

      tnSr:""

    });



  }







  function deleteReport(index:number){



    const updated = reports.filter(

      (_,i)=>i!==index

    );



    setReports(updated);



    localStorage.setItem(

      "fireguard_patrol_reports",

      JSON.stringify(updated)

    );


  }









  function downloadReport(){



    if(reports.length===0){


      setMessage(

        "⚠️ No Patrol Records Available"

      );


      return;

    }






    const data = reports.map((item,index)=>({


      "S/N":index+1,

      Date:item.date,

      Time:item.time,

      "Call Sign":item.callSign,

      "Patrol Type":item.patrolType,

      Location:item.location,

      Description:item.description,

      Remarks:item.remarks,

      "TN/SR":item.tnSr


    }));





    const worksheet = XLSX.utils.json_to_sheet(data);



    const workbook = XLSX.utils.book_new();



    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      "Daily Patrol Report"

    );





    XLSX.writeFile(

      workbook,

      "FireGuard_Daily_Patrol_Report.xlsx"

    );



    setMessage(

      "📥 Daily Report Downloaded"

    );



  }


    return (


    <main

    className="relative min-h-screen bg-cover bg-center p-6"

    style={{

      backgroundImage:"url('/fire-bg.jpg')"

    }}

    >



      <div className="absolute inset-0 bg-black/40"></div>





      <div className="relative z-10 max-w-5xl mx-auto">





        <div className="bg-white rounded-3xl shadow-2xl p-10">





          <h1 className="text-4xl text-green-700 font-bold text-center">

            📋 Daily Patrolling Report Generator

          </h1>




          <p className="text-gray-600 text-center mt-3">

            FireGuard AI Security Reporting System

          </p>






          <div className="grid md:grid-cols-2 gap-4 mt-8">





            <input

            value={form.date}

            readOnly

            className="p-3 rounded-lg bg-gray-100 border text-black"

            />






            <input

            value={form.time}

            readOnly

            className="p-3 rounded-lg bg-gray-100 border text-black"

            />







            <input

            name="callSign"

            value={form.callSign}

            placeholder="Call Sign *"

            className="p-3 rounded-lg border text-black"

            onChange={updateField}

            />







            <input

            name="patrolType"

            value={form.patrolType}

            placeholder="Patrol Type *"

            className="p-3 rounded-lg border text-black"

            onChange={updateField}

            />








            <input

            name="location"

            value={form.location}

            placeholder="Location *"

            className="p-3 rounded-lg border text-black md:col-span-2"

            onChange={updateField}

            />








            <textarea

            name="description"

            value={form.description}

            placeholder="Description / Finding *"

            className="p-3 rounded-lg border text-black md:col-span-2 h-28"

            onChange={updateField}

            />








            <textarea

            name="remarks"

            value={form.remarks}

            placeholder="Remarks"

            className="p-3 rounded-lg border text-black md:col-span-2 h-24"

            onChange={updateField}

            />








            <input

            name="tnSr"

            value={form.tnSr}

            placeholder="TN / SR Number"

            className="p-3 rounded-lg border text-black md:col-span-2"

            onChange={updateField}

            />





          </div>








          <button

          onClick={addReport}

          className="mt-8 w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700"

          >

            ➕ Add Patrol Entry

          </button>









          <button

          onClick={downloadReport}

          className="mt-4 w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700"

          >

            📥 Download End Of Day Report

          </button>








          {

          message &&

          <p className="text-center text-green-700 font-bold mt-5">

            {message}

          </p>

          }









          <div className="mt-10">


            <h2 className="text-2xl font-bold text-green-700">

              Today's Patrol Entries ({reports.length})

            </h2>






            <div className="mt-5 space-y-4">



            {

            reports.length===0 ? (


              <p className="text-gray-500">

                No patrol entries available

              </p>


            )

            :


            reports.map((item,index)=>(



              <div

              key={index}

              className="border rounded-xl p-5 bg-gray-50"

              >




                <p className="font-bold text-green-700">

                  #{index+1} {item.patrolType}

                </p>





                <p className="text-black">

                  📅 {item.date} | ⏰ {item.time}

                </p>





                <p className="text-black">

                  📍 {item.location}

                </p>





                <p className="text-black">

                  📝 {item.description}

                </p>





                <p className="text-black">

                  Remarks: {item.remarks}

                </p>






                <button

                onClick={()=>deleteReport(index)}

                className="mt-3 bg-red-500 text-white px-5 py-2 rounded-lg"

                >

                  Delete

                </button>





              </div>



            ))



            }



            </div>



          </div>









          <Link href="/">

            <button

            className="mt-8 w-full border border-green-600 text-green-700 py-3 rounded-xl"

            >

              🏠 Back To Home

            </button>

          </Link>





        </div>





      </div>





    </main>


  );


}