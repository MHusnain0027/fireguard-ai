"use client";

import { useState } from "react";
import Link from "next/link";
import { locations } from "@/data/locations";
import { uploadedLocations } from "@/data/uploaded";

export default function Home() {

  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("all");


  const allLocations = [
    ...locations,
    ...uploadedLocations
  ];


  const results = search.trim()
    ? allLocations.filter((item:any) => {

        const code = item.code?.toLowerCase() || "";
        const door = item.doorName?.toLowerCase() || "";
        const zone = item.zone?.toLowerCase() || "";

        const value = search.toLowerCase();


        if(mode === "exact"){
          return code === value;
        }


        if(mode === "partial"){
          return code.includes(value);
        }


        return (
          code.includes(value) ||
          door.includes(value) ||
          zone.includes(value)
        );

      })
    : [];



  return (

    <main
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:"url('/fire-bg.jpg')"
      }}
    >


      <div className="absolute inset-0 bg-black/70"></div>



      <div className="relative z-10 w-[720px] bg-black/80 backdrop-blur-xl rounded-3xl p-10 border border-green-500/20">


        <h1 className="text-center text-5xl font-bold text-green-400">
          FACP SEARCH SYSTEM
        </h1>


        <p className="text-center text-gray-400 mt-3 text-xl">
          Building Information Database
        </p>



        <div className="flex gap-3 mt-10">


          <input
            className="flex-1 p-5 rounded-xl text-black text-xl"
            placeholder="Search code / room / zone..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />


          <button className="bg-green-500 px-10 rounded-xl font-bold">
            SEARCH
          </button>


        </div>




        <div className="flex gap-3 justify-center mt-5">


          <button
          onClick={()=>setMode("all")}
          className="bg-green-500 px-5 py-2 rounded-full">

            All

          </button>



          <button
          onClick={()=>setMode("exact")}
          className="border border-green-500 text-green-400 px-5 py-2 rounded-full">

            Exact Code

          </button>



          <button
          onClick={()=>setMode("partial")}
          className="border border-green-500 text-green-400 px-5 py-2 rounded-full">

            Partial

          </button>


        </div>





        <div className="mt-8 max-h-80 overflow-y-auto">


        {results.map((item:any,index)=>(

          <div
          key={index}
          className="bg-gray-900 p-4 rounded-xl mb-3 border border-green-500/20">


            <p className="text-green-400 font-bold">
              {item.code || "NO CODE"}
            </p>


            <p className="text-white">
              {item.doorName || "Unknown Location"}
            </p>


            <p className="text-gray-400">
              {item.zone || "No Zone"}
            </p>


          </div>

        ))}


        </div>





        {/* Admin & Report Buttons */}

        <div className="flex flex-col items-center gap-5 mt-10">


          <Link href="/admin">

            <button
            className="bg-gray-800 text-gray-300 px-12 py-3 rounded-lg hover:bg-gray-700">

              🔐 Admin Panel

            </button>

          </Link>



          <button
          className="border border-green-500 text-green-400 px-8 py-3 rounded-lg hover:bg-green-500 hover:text-black">

            📋 Create Patrolling Reports

          </button>


        </div>





        <p className="text-center text-gray-400 mt-10">

          Type something to search...

        </p>




        <div className="flex justify-center mt-8">


          <div className="border border-green-500 px-8 py-3 rounded-full">

            <span className="text-green-400 font-bold">

              MADE BY ARSLAN

            </span>

          </div>


        </div>



      </div>


    </main>

  );
}