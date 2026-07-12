"use client";

import { useEffect, useState } from "react";
import Link from "next/link";


export default function IncidentHistoryPage() {


  const [reports,setReports] = useState<any[]>([]);



  useEffect(()=>{


    const data = localStorage.getItem(
      "fireguard_incidents"
    );


    if(data){

      setReports(
        JSON.parse(data)
      );

    }


  },[]);





  function deleteReport(index:number){


    const updated = reports.filter(

      (_,i)=> i !== index

    );


    setReports(updated);


    localStorage.setItem(

      "fireguard_incidents",

      JSON.stringify(updated)

    );


  }





  return (


    <main

      className="relative min-h-screen flex items-center justify-center bg-cover bg-center p-6"

      style={{

        backgroundImage:"url('/fire-bg.jpg')"

      }}

    >



      {/* Background Overlay */}

      <div className="absolute inset-0 bg-black/50"></div>






      {/* White History Card */}

      <div className="relative z-10 w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-8 border border-green-400">





        <div className="text-center">


          <p className="text-green-600 tracking-[5px] text-sm font-bold">

            FIREGUARD AI

          </p>


          <h1 className="text-4xl font-bold text-green-700 mt-3">

            📋 Fire Alarm Incident History

          </h1>



          <p className="text-gray-500 mt-3">

            Saved Fire Alarm Reports Database

          </p>


        </div>







        {

        reports.length === 0 ? (


          <p className="text-center text-gray-500 mt-10">

            No Incident Reports Found

          </p>


        ) : (


          <div className="mt-8 space-y-5">



          {


          reports.map((item,index)=>(



            <div

            key={index}

            className="bg-gray-50 border border-green-300 rounded-2xl p-6 shadow"


            >



              <h2 className="text-green-700 font-bold text-xl">

                🚨 {item["Alarm Type"] || "Fire Alarm"}

              </h2>




              <p className="text-black mt-2">

                📅 {item.Date} &nbsp; ⏰ {item.Time}

              </p>




              <p className="text-black">

                📍 {item.Location}

              </p>




              <p className="text-black">

                Zone: {item.Zone}

              </p>




              <p className="text-black">

                FACP: {item["FACP Panel"]}

              </p>






              <button

              onClick={()=>deleteReport(index)}

              className="mt-5 bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600"

              >

                🗑 Delete

              </button>




            </div>



          ))


          }


          </div>


        )

        }






        <Link href="/">


          <button

          className="mt-8 w-full border border-green-600 text-green-700 py-3 rounded-xl hover:bg-green-600 hover:text-white transition"

          >

            🏠 Back To Home

          </button>


        </Link>





      </div>





    </main>


  );


}