"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { supabase } from "@/app/lib/supabase";


export default function Home() {


  const [search,setSearch] = useState("");

  const [mode,setMode] = useState("all");

  const [time,setTime] = useState("");

  const [incidents,setIncidents] = useState(0);

  const [databaseLocations,setDatabaseLocations] = useState<any[]>([]);




  useEffect(()=>{


    const timer = setInterval(()=>{

      setTime(
        new Date().toLocaleString()
      );

    },1000);



    const saved = localStorage.getItem(
      "fireguard_incidents"
    );


    if(saved){

      setIncidents(
        JSON.parse(saved).length
      );

    }




    async function loadLocations(){


      const {data,error}=await supabase

      .from("locations")

      .select("*");



      if(data){

        setDatabaseLocations(data);

      }


    }


    loadLocations();



    return ()=>clearInterval(timer);



  },[]);





 const allLocations = databaseLocations;





  const results = search.trim()

  ? allLocations.filter((item:any)=>{


      const code =
      (item.Code || item.code || "").toLowerCase();


      const door =
      (
        item.Door_Name ||
        item.door_name ||
        item.doorName ||
        ""
      ).toLowerCase();



      const zone =
      (item.Zone || item.zone || "").toLowerCase();



      const value =
      search.toLowerCase();

      const districtCode =
(item.District_Code || item.district_code || "").toLowerCase();


const districtName =
(item.District_Name || item.district_name || "").toLowerCase();




      if(mode==="exact"){

        return code === value;

      }





      if(mode==="partial"){

        return code.includes(value);

      }





      return (

code.includes(value) ||

door.includes(value) ||

zone.includes(value) ||

districtCode.includes(value) ||

districtName.includes(value)

);



  })

  : [];





return (

    <main

    className="relative min-h-screen bg-cover bg-center p-6"

    style={{

      backgroundImage:"url('/fire-bg.jpg')"

    }}

    >


      <div className="absolute inset-0 bg-black/50"></div>



      <div className="relative z-10 max-w-6xl mx-auto">





        <div className="text-center mt-5">


          <p className="text-green-300 tracking-[8px]">

            FIRE SAFETY INTELLIGENCE

          </p>



          <h1 className="text-5xl font-bold text-green-400 mt-3">

            🔥 FireGuard AI

          </h1>




          <p className="text-white text-2xl mt-2">

            FACP Search & Incident Management System

          </p>




          <p className="text-green-300 mt-3">

            🕒 {time}

          </p>


        </div>





        <div className="grid md:grid-cols-4 gap-5 mt-10">


          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-5 text-center border border-green-400/30">

            <h2 className="text-4xl text-green-400 font-bold">

              {allLocations.length}

            </h2>

            <p className="text-white">

              FACP Locations

            </p>

          </div>




          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-5 text-center border border-green-400/30">

            <h2 className="text-4xl text-green-400 font-bold">

              {databaseLocations.length}

            </h2>

            <p className="text-white">

              Uploaded Data

            </p>

          </div>




          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-5 text-center border border-red-400/30">

            <h2 className="text-4xl text-red-400 font-bold">

              {incidents}

            </h2>

            <p className="text-white">

              Incidents

            </p>

          </div>




          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-5 text-center border border-green-400/30">

            <h2 className="text-4xl text-green-400 font-bold">

              🟢

            </h2>

            <p className="text-white">

              System Online

            </p>

          </div>



        </div>





        <div className="mt-10 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-green-400/30">


          <h2 className="text-3xl text-green-400 font-bold text-center">

            🔍 FACP Search System

          </h2>



          <p className="text-center text-gray-200 mt-2">

            Search Building Code / Room / Zone

          </p>





          <input

          className="w-full mt-8 p-5 rounded-xl bg-white text-black text-xl"

          placeholder="Search code / room / zone..."

          value={search}

          onChange={(e)=>setSearch(e.target.value)}

          />





          <div className="flex justify-center gap-3 mt-5 flex-wrap">


            <button

            onClick={()=>setMode("all")}

            className="bg-green-500 text-black px-6 py-2 rounded-full font-bold"

            >

              All

            </button>




            <button

            onClick={()=>setMode("exact")}

            className="border border-green-400 text-green-300 px-6 py-2 rounded-full"

            >

              Exact Code

            </button>




            <button

            onClick={()=>setMode("partial")}

            className="border border-green-400 text-green-300 px-6 py-2 rounded-full"

            >

              Partial

            </button>


          </div>






          <div className="mt-8 max-h-72 overflow-y-auto">


          {

          results.map((item:any,index)=>(


            <div

            key={index}

            className="bg-black/40 rounded-xl p-5 mb-3 border border-green-400/20"

            >


              <p className="text-green-400 font-bold text-xl">

                {item.Code || item.code || "NO CODE"}

              </p>


              <p className="text-yellow-300 font-bold mt-2">

🏢 {item.District_Name || item.district_name || "No District"}

</p>


<p className="text-gray-300">

District Code: {item.District_Code || item.district_code || "N/A"}

</p>



              <p className="text-white">

                {item.Door_Name || item.door_name || item.doorName || "Unknown Location"}

              </p>



              <p className="text-gray-300">

                {item.Zone || item.zone || "No Zone"}

              </p>


            </div>


          ))

          }


          </div>


        </div>






        <div className="grid md:grid-cols-3 gap-5 mt-10">



          <Link href="/fire-alarm-report">

          <div className="bg-red-500/20 border border-red-400 rounded-2xl p-6 text-center hover:bg-red-500/40 cursor-pointer">

            <h2 className="text-3xl">🚨</h2>

            <p className="text-white font-bold mt-3">

              Fire Alarm Report

            </p>

          </div>

          </Link>





          <Link href="/patrol">

          <div className="bg-green-500/20 border border-green-400 rounded-2xl p-6 text-center hover:bg-green-500/40 cursor-pointer">

            <h2 className="text-3xl">📋</h2>

            <p className="text-white font-bold mt-3">

              Patrol Report

            </p>

          </div>

          </Link>





          <Link href="/incidents">

          <div className="bg-blue-500/20 border border-blue-400 rounded-2xl p-6 text-center hover:bg-blue-500/40 cursor-pointer">

            <h2 className="text-3xl">📊</h2>

            <p className="text-white font-bold mt-3">

              Incident History

            </p>

          </div>

          </Link>


        </div>






        <div className="flex justify-center mt-8">

          <Link href="/admin">

          <button

          className="bg-white/20 border border-green-400 text-white px-12 py-3 rounded-xl hover:bg-green-500 hover:text-black transition"

          >

            🔐 Admin Panel

          </button>

          </Link>


        </div>







        <div className="text-center mt-12 pb-5">


          <p className="text-gray-300">

            FireGuard AI Security Management Platform

          </p>




          <a

          href="https://wa.me/971505677023"

          target="_blank"

          className="inline-block mt-4 border border-green-400 px-8 py-3 rounded-full hover:bg-green-500/20 transition"

          >


          <span className="text-green-400 font-bold">

            Developed by Muhammad Husnain 💬

          </span>


          </a>



        </div>





      </div>


    </main>

  );


}
