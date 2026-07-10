"use client";

import { useState } from "react";

export default function AdminPage() {

  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");



  async function uploadExcel(){

    if(!file){
      setMessage("Please select Excel file first");
      return;
    }


    const formData = new FormData();

    formData.append("file", file);



    const res = await fetch("/api/upload", {

      method:"POST",

      body:formData

    });



    const data = await res.json();


    if(data.success){

      setMessage(
        `✅ Upload successful - ${data.total} records found`
      );

    }
    else{

      setMessage("❌ Upload failed");

    }

  }



  return (

    <main className="min-h-screen flex items-center justify-center bg-black">


      <div className="w-[600px] bg-gray-900 rounded-3xl p-10 border border-green-500/30">


        <h1 className="text-4xl text-green-400 font-bold text-center">
          🔥 FireGuard AI Admin Panel
        </h1>


        <p className="text-gray-400 text-center mt-3">
          Upload FACP Excel Database
        </p>



        <input

          type="file"

          accept=".xlsx,.xls"

          className="mt-10 w-full bg-white text-black p-3 rounded-xl"

          onChange={(e)=>
            setFile(e.target.files?.[0] || null)
          }

        />



        <button

          onClick={uploadExcel}

          className="mt-8 w-full bg-green-500 text-black font-bold py-3 rounded-xl"

        >

          Upload Excel

        </button>



        {message && (

          <p className="text-green-400 text-center mt-5">

            {message}

          </p>

        )}



      </div>


    </main>

  );

}