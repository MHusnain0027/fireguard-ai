"use client";

import { useState } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";

export default function PatrolPage() {

  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    callSign: "",
    patrolType: "",
    location: "",
    description: "",
    remarks: "",
    tnSr: ""
  });



  function updateField(e:any){

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  }




  function createReport(){


    if(
      !form.callSign ||
      !form.patrolType ||
      !form.location ||
      !form.description
    ){

      setMessage("⚠️ Please fill all required fields");

      return;

    }



    const worksheet = XLSX.utils.json_to_sheet([

      {
        Date: form.date,
        Time: form.time,
        "Call Sign": form.callSign,
        "Patrol Type": form.patrolType,
        Location: form.location,
        Description: form.description,
        Remarks: form.remarks,
        "TN/SR": form.tnSr
      }

    ]);



    const workbook = XLSX.utils.book_new();



    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Patrol Report"
    );



    XLSX.writeFile(
      workbook,
      "FireGuard_Patrolling_Report.xlsx"
    );



    setMessage("✅ Report created successfully");


  }




  return (


    <main className="min-h-screen bg-black flex items-center justify-center p-5">



      <div className="w-[700px] bg-gray-900 border border-green-500/30 rounded-3xl p-10">



        <h1 className="text-4xl text-green-400 font-bold text-center">

          📋 Patrolling Report Generator

        </h1>



        <p className="text-gray-400 text-center mt-3">

          FireGuard AI Security Reporting System

        </p>




        <div className="grid grid-cols-2 gap-4 mt-8">



          <input
          name="date"
          value={form.date}
          readOnly
          className="p-3 rounded-lg text-black"
          />



          <input
          name="time"
          value={form.time}
          readOnly
          className="p-3 rounded-lg text-black"
          />



          <input
          name="callSign"
          placeholder="Call Sign *"
          className="p-3 rounded-lg text-black"
          onChange={updateField}
          />



          <input
          name="patrolType"
          placeholder="Patrol Type *"
          className="p-3 rounded-lg text-black"
          onChange={updateField}
          />



          <input
          name="location"
          placeholder="Location *"
          className="p-3 rounded-lg text-black col-span-2"
          onChange={updateField}
          />



          <textarea
          name="description"
          placeholder="Description of Finding *"
          className="p-3 rounded-lg text-black col-span-2 h-28"
          onChange={updateField}
          />



          <textarea
          name="remarks"
          placeholder="Remarks"
          className="p-3 rounded-lg text-black col-span-2 h-24"
          onChange={updateField}
          />



          <input
          name="tnSr"
          placeholder="TN / SR Number"
          className="p-3 rounded-lg text-black col-span-2"
          onChange={updateField}
          />



        </div>




        <button

        onClick={createReport}

        className="mt-8 w-full bg-green-500 text-black font-bold py-3 rounded-xl hover:bg-green-400">

          📥 Create Excel Report

        </button>




        {message && (

          <p className="text-center text-green-400 mt-5">

            {message}

          </p>

        )}




        <Link href="/">

          <button

          className="mt-5 w-full border border-green-500 text-green-400 py-3 rounded-xl">

            🏠 Back To Home

          </button>

        </Link>




      </div>


    </main>

  );

}