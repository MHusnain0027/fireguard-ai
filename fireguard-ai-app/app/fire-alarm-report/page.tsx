"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { locations } from "@/data/locations";
import { uploadedLocations } from "@/data/uploaded";


export default function FireAlarmReportPage() {


  const now = new Date();


  const allLocations = [
    ...locations,
    ...uploadedLocations
  ];



  const [form, setForm] = useState({

    date: now.toISOString().split("T")[0],

    time: now.toLocaleTimeString(),

    location: "",
    building: "",
    zone: "",
    facp: "",
    device: "",
    alarmType: "",
    cause: "",
    actionTaken: "",
    attendedBy: "",
    technician: "",
    tnSr: ""

  });





  function updateField(e:any){

    setForm({

      ...form,
      [e.target.name]: e.target.value

    });

  }





  function selectLocation(e:any){

    const value = e.target.value;


    const selected = allLocations.find(

      (item:any)=>

      `${item.code || ""} - ${item.doorName || ""} - ${item.zone || ""}` === value

    );



    if(selected){


      setForm({

        ...form,

        location:value,

        zone:selected.zone || "",

        facp:selected.code || ""

      });


    }

    else{


      setForm({

        ...form,

        location:value

      });


    }


  }





  function generateReport(){


    const newReport = {


      Date: form.date,

      Time: form.time,

      Location: form.location,

      Building: form.building,

      Zone: form.zone,

      "FACP Panel": form.facp,

      Device: form.device,

      "Alarm Type": form.alarmType,

      Cause: form.cause,

      "Action Taken": form.actionTaken,

      "Attended By": form.attendedBy,

      Technician: form.technician,

      "TN/SR": form.tnSr


    };



    const oldReports = JSON.parse(

      localStorage.getItem("fireguard_incidents") || "[]"

    );



    oldReports.push(newReport);



    localStorage.setItem(

      "fireguard_incidents",

      JSON.stringify(oldReports)

    );




    const worksheet = XLSX.utils.json_to_sheet([

      newReport

    ]);



    const workbook = XLSX.utils.book_new();



    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      "Incident Report"

    );



    XLSX.writeFile(

      workbook,

      "FireGuard_Incident_Report.xlsx"

    );


  }

    return (


    <main

      className="relative min-h-screen flex items-center justify-center p-5 bg-cover bg-center"

      style={{

        backgroundImage:"url('/fire-bg.jpg')"

      }}

    >



      <div className="absolute inset-0 bg-black/40"></div>






      <div className="relative z-10 w-full max-w-4xl bg-white/90 backdrop-blur-xl border border-green-500/40 rounded-3xl p-10 shadow-2xl">





        <h1 className="text-4xl text-green-700 font-bold text-center">

          🚨 Fire Alarm Incident Report

        </h1>




        <p className="text-gray-600 text-center mt-3">

          FireGuard AI Incident Management System

        </p>






        <div className="grid grid-cols-2 gap-4 mt-8">





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








          <div className="col-span-2">


          <input

          list="locationList"

          name="location"

          placeholder="Search Location / FACP Code"

          className="w-full p-3 rounded-lg bg-white border text-black"

          onChange={selectLocation}

          />



          <datalist id="locationList">


          {

          allLocations.map((item:any,index)=>(


            <option

            key={index}

            value={`${item.code || ""} - ${item.doorName || ""} - ${item.zone || ""}`}

            />


          ))

          }


          </datalist>



          </div>








          <input

          name="building"

          placeholder="Building"

          className="p-3 rounded-lg bg-white border text-black"

          onChange={updateField}

          />







          <input

          name="zone"

          value={form.zone}

          placeholder="Zone"

          className="p-3 rounded-lg bg-white border text-black"

          onChange={updateField}

          />








          <input

          name="facp"

          value={form.facp}

          placeholder="FACP Panel"

          className="p-3 rounded-lg bg-white border text-black"

          onChange={updateField}

          />








          <input

          name="device"

          placeholder="Device Address / Type"

          className="p-3 rounded-lg bg-white border text-black"

          onChange={updateField}

          />









          <select

          name="alarmType"

          className="p-3 rounded-lg bg-white border text-black col-span-2"

          onChange={updateField}

          >

          <option>Select Alarm Type</option>

          <option>Smoke Detector</option>

          <option>Heat Detector</option>

          <option>Manual Call Point (MCP)</option>

          <option>Sprinkler Flow</option>

          <option>Sprinkler Tamper</option>

          <option>Fire Fault</option>

          <option>System Trouble</option>

          <option>Other</option>


          </select>








          <textarea

          name="cause"

          placeholder="Cause of Alarm"

          className="p-3 rounded-lg bg-white border text-black col-span-2 h-28"

          onChange={updateField}

          />








          <textarea

          name="actionTaken"

          placeholder="Action Taken"

          className="p-3 rounded-lg bg-white border text-black col-span-2 h-28"

          onChange={updateField}

          />








          <input

          name="attendedBy"

          placeholder="Attended By"

          className="p-3 rounded-lg bg-white border text-black"

          onChange={updateField}

          />








          <input

          name="technician"

          placeholder="Technician Details"

          className="p-3 rounded-lg bg-white border text-black"

          onChange={updateField}

          />








          <input

          name="tnSr"

          placeholder="TN / SR Number"

          className="p-3 rounded-lg bg-white border text-black col-span-2"

          onChange={updateField}

          />





        </div>








        <button

        onClick={generateReport}

        className="mt-8 w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition"

        >

          📥 Generate Incident Report

        </button>





      </div>





    </main>


  );


}