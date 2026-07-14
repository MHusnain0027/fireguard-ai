"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

export default function Home() {

  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("all");
  const [time, setTime] = useState("");
  const [incidents, setIncidents] = useState(0);
  const [databaseLocations, setDatabaseLocations] = useState<any[]>([]);


  useEffect(() => {

    const timer = setInterval(() => {
      setTime(new Date().toLocaleString());
    }, 1000);


    const saved = localStorage.getItem(
      "fireguard_incidents"
    );

    if(saved){
      setIncidents(JSON.parse(saved).length);
    }


    async function loadLocations(){

      const {data} = await supabase
        .from("locations")
        .select("*");


      if(data){
        setDatabaseLocations(data);
      }

    }


    loadLocations();


    return ()=>clearInterval(timer);


  },[]);



  const results = search.trim()

  ? databaseLocations.filter((item:any)=>{


      const code =
(item.Code || item.code || "")
.toLowerCase()
.replace(/-0+(\d+)$/, "-$1");


      const door =
      (item.Door_Name || "").toLowerCase();


      const zone =
      (item.Zone || "").toLowerCase();


      const districtCode =
      (item.District_Code || "").toLowerCase();


      const districtName =
      (item.District_Name || "").toLowerCase();

const value =
search
.toLowerCase()
.replace(/-0+(\d+)$/, "-$1");



      if(mode==="exact"){
        return code === value;
      }


      if(mode==="partial"){
        return code.includes(value) ||
code.endsWith("-" + value);
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

className="relative min-h-screen bg-cover bg-center p-4"

style={{
backgroundImage:"url('/fire-bg.jpg')"
}}

>


<div className="absolute inset-0 bg-black/50"></div>



<div className="relative z-10 max-w-5xl mx-auto">





<div className="text-center mt-3">


<p className="text-green-300 tracking-[6px] text-sm">

FIRE SAFETY INTELLIGENCE

</p>


<h1 className="text-4xl font-bold text-green-400 mt-2">

🔥 FireGuard AI

</h1>


<p className="text-white text-lg mt-2">

FACP Search & Incident Management System

</p>


<p className="text-green-300 mt-2">

🕒 {time}

</p>


</div>





<div className="grid md:grid-cols-4 gap-3 mt-6">


<div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 text-center border border-green-400/30">

<h2 className="text-3xl text-green-400 font-bold">
{databaseLocations.length}
</h2>

<p className="text-white">
FACP Locations
</p>

</div>




<div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 text-center border border-green-400/30">

<h2 className="text-3xl text-green-400 font-bold">
{databaseLocations.length}
</h2>

<p className="text-white">
Uploaded Data
</p>

</div>




<div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 text-center border border-red-400/30">

<h2 className="text-3xl text-red-400 font-bold">
{incidents}
</h2>

<p className="text-white">
Incidents
</p>

</div>




<div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 text-center border border-green-400/30">

<h2 className="text-3xl">
🟢
</h2>

<p className="text-white">
System Online
</p>

</div>


</div>





<div className="mt-8 bg-white/10 backdrop-blur-xl rounded-3xl p-5 border border-green-400/30">


<h2 className="text-2xl text-green-400 font-bold text-center">

🔍 FACP Search System

</h2>


<p className="text-center text-gray-200 mt-2">

Search Building Code / Room / Zone

</p>


<input

className="w-full mt-5 p-3 rounded-xl bg-white text-black text-base hover-scale fire-glow"

placeholder="Search code / room / zone..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>


<div className="flex justify-center gap-3 mt-4 flex-wrap">


<button
onClick={()=>setMode("all")}
className="bg-green-500 text-black px-5 py-2 rounded-full font-bold"
>
All
</button>


<button
onClick={()=>setMode("exact")}
className="border border-green-400 text-green-300 px-5 py-2 rounded-full"
>
Exact Code
</button>


<button
onClick={()=>setMode("partial")}
className="border border-green-400 text-green-300 px-5 py-2 rounded-full"
>
Partial
</button>


</div>

<div className="mt-6 max-h-72 overflow-y-auto">


{
results.map((item:any,index)=>(


<div

key={index}

className="bg-black/40 rounded-xl p-4 mb-3 border border-green-400/20"

>


<p className="text-green-400 font-bold text-lg">

{item.Code || "NO CODE"}

</p>


<p className="text-yellow-300 font-bold mt-2">

🏢 {item.District_Name || "No District"}

</p>


<p className="text-gray-300">

District Code: {item.District_Code || "N/A"}

</p>


<p className="text-white">

{item.Door_Name || "Unknown Location"}

</p>


<p className="text-gray-300">

{item.Zone || "No Zone"}

</p>


</div>


))

}


</div>


</div>







<div className="grid md:grid-cols-3 gap-4 mt-8">



<Link href="/fire-alarm-report">

<div className="bg-red-500/20 border border-red-400 rounded-2xl p-4 text-center hover:bg-red-500/40 cursor-pointer transition hover-scale">


<h2 className="text-2xl">

🚨

</h2>


<p className="text-white font-bold mt-2">

Fire Alarm Report

</p>


</div>

</Link>





<Link href="/patrol">


<div className="bg-green-500/20 border border-green-400 rounded-2xl p-4 text-center hover:bg-green-500/40 cursor-pointer transition hover-scale">


<h2 className="text-2xl">

📋

</h2>


<p className="text-white font-bold mt-2">

Patrol Report

</p>


</div>


</Link>







<Link href="/incidents">


<div className="bg-blue-500/20 border border-blue-400 rounded-2xl p-4 text-center hover:bg-blue-500/40 cursor-pointer transition hover-scale">


<h2 className="text-2xl">

📊

</h2>


<p className="text-white font-bold mt-2">

Incident History

</p>


</div>


</Link>


</div>











<div className="text-center mt-10 pb-5">


<p className="text-gray-300">

FireGuard AI Security Management Platform

</p>




<a

href="https://wa.me/971505677023"

target="_blank"

className="inline-block mt-3 border border-green-400 px-6 py-2 rounded-full hover:bg-green-500/20 transition"

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
