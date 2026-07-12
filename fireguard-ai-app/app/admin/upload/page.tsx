"use client";

import { useState } from "react";
import Link from "next/link";

export default function UploadPage() {

  const [file, setFile] = useState<File | null>(null);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);



  async function uploadExcel() {


    if(!file){

      setMessage("⚠️ Please select Excel database file first");

      return;

    }



    setLoading(true);

    setMessage("");



    try{


      const formData = new FormData();


      formData.append(
        "file",
        file
      );



      const response = await fetch(
        "/api/upload",
        {
          method:"POST",
          body:formData
        }
      );



      const data = await response.json();




      if(data.success){


        setMessage(
          `✅ Database Updated Successfully - ${data.total} Locations Added`
        );


      }
      else{


        setMessage(
          "❌ Upload Failed. Please check Excel format"
        );


      }



    }
    catch(error){


      setMessage(
        "❌ Server Error. Please try again"
      );


    }
    finally{


      setLoading(false);


    }


  }





  return(


    <main

      className="relative min-h-screen bg-cover bg-center p-6"

      style={{

        backgroundImage:"url('/fire-bg.jpg')"

      }}

    >



      <div className="absolute inset-0 bg-black/60"></div>




      <div className="relative z-10 max-w-3xl mx-auto pt-10">



        <div className="bg-white/10 backdrop-blur-2xl border border-blue-400/40 rounded-3xl p-10 shadow-2xl">





          <h1 className="text-4xl text-center font-bold text-blue-400">

            📂 Upload FACP Database

          </h1>




          <p className="text-center text-gray-300 mt-3">

            Admin Database Management System

          </p>






          <div className="mt-8 bg-black/30 rounded-2xl p-6 border border-blue-400/20">


            <label className="text-white font-bold">

              Select Excel File

            </label>



            <input

              type="file"

              accept=".xlsx,.xls"

              className="mt-4 w-full bg-white text-black p-4 rounded-xl cursor-pointer"

              onChange={(e)=>

                setFile(
                  e.target.files?.[0] || null
                )

              }

            />



            {

              file &&

              <p className="text-green-300 mt-3">

                Selected: {file.name}

              </p>

            }


          </div>







          <button


            onClick={uploadExcel}


            disabled={loading}


            className="mt-6 w-full bg-green-500 text-black font-bold py-4 rounded-xl hover:bg-green-400 transition disabled:bg-gray-400"


          >


            {

              loading

              ?

              "⏳ Uploading..."

              :

              "📤 Upload Database"

            }


          </button>







          {

            message &&


            <div className="mt-5 bg-black/40 rounded-xl p-4">


              <p className="text-center text-green-300 font-bold">

                {message}

              </p>


            </div>


          }







          <Link href="/admin">


            <button


              className="mt-6 w-full border border-blue-400 text-blue-300 py-3 rounded-xl hover:bg-blue-500/20 transition"


            >

              ⬅ Back Admin Dashboard

            </button>


          </Link>





        </div>



      </div>




    </main>


  );


}
