"use client";

import { useState } from "react";
import { locations } from "../data/locations";

export default function Home() {

  const [search, setSearch] = useState("");
  const [result, setResult] = useState<any>(null);


  function searchAlarm() {
    const found = locations.find(
      (item) => item.code === search
    );

    setResult(found || "notfound");
  }


  return (

    <main className="min-h-screen bg-slate-950 text-white p-8">

      {/* Header */}

      <h1 className="text-5xl font-bold text-center">
        🔥 FireGuard AI
      </h1>

      <p className="text-center mt-3 text-gray-300">
        AI Powered Fire Alarm Monitoring System
      </p>


      {/* Dashboard Cards */}

      <div className="grid md:grid-cols-3 gap-5 mt-10">


        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-orange-400 text-xl">
            System Status
          </h2>
          <p className="text-green-400 text-2xl mt-3">
            🟢 ONLINE
          </p>
        </div>


        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-orange-400 text-xl">
            Fire Alarm Status
          </h2>
          <p className="text-green-400 text-2xl mt-3">
            NORMAL
          </p>
        </div>


        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-orange-400 text-xl">
            Monitoring
          </h2>
          <p className="text-2xl mt-3">
            Active Devices
          </p>
        </div>


      </div>



      {/* Search Section */}

      <div className="max-w-xl mx-auto mt-12">

        <h2 className="text-3xl font-bold mb-5">
          🔎 Alarm Location Search
        </h2>


        <input

          className="w-full p-4 text-black rounded-lg"

          placeholder="Enter Fire Alarm Code"

          value={search}

          onChange={(e)=>setSearch(e.target.value)}

        />


        <button

          onClick={searchAlarm}

          className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg"

        >

          Search Location

        </button>



        {result && result !== "notfound" && (

          <div className="bg-slate-800 p-6 mt-8 rounded-xl">


            <h2 className="text-2xl text-red-400 mb-4">
              🚨 Alarm Location Found
            </h2>


            <p>Code: {result.code}</p>

            <p>Location: {result.location}</p>

            <p>Building: {result.building}</p>

            <p>Floor: {result.floor}</p>

            <p>Zone: {result.zone}</p>

            <p>Device: {result.device}</p>


          </div>

        )}



        {result === "notfound" && (

          <div className="bg-red-900 p-5 mt-6 rounded-lg">

            ❌ Location Not Found

          </div>

        )}


      </div>


    </main>

  );
}