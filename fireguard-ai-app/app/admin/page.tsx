"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function AdminPage(){


  const router = useRouter();

  const [checking,setChecking] = useState(true);



  useEffect(()=>{


    const admin = localStorage.getItem(
      "fireguard_admin"
    );


    if(!admin){

      router.push("/login");

    }

    else{

      setChecking(false);

    }


  },[router]);





  function logout(){


    localStorage.removeItem(
      "fireguard_admin"
    );


    router.push("/login");


  }






  if(checking){


    return(

      <main className="min-h-screen flex items-center justify-center bg-black">


        <h1 className="text-green-400 text-3xl font-bold">

          Checking Access...

        </h1>


      </main>

    );


  }







  return(


    <main


      className="relative min-h-screen bg-cover bg-center p-6"


      style={{


        backgroundImage:"url('/fire-bg.jpg')"


      }}


    >




      <div className="absolute inset-0 bg-black/60"></div>






      <div className="relative z-10 max-w-4xl mx-auto mt-10">





        <div className="bg-white/10 backdrop-blur-xl border border-green-400/30 rounded-3xl p-10">





          <h1 className="text-5xl text-center font-bold text-green-400">


            🔐 FireGuard AI Admin Panel


          </h1>





          <p className="text-center text-gray-300 mt-4">


            Manage Fire Alarm Database System


          </p>







          <div className="grid md:grid-cols-2 gap-6 mt-10">






            <Link href="/">


              <div className="bg-green-500/20 border border-green-400 rounded-2xl p-8 text-center hover:bg-green-500/40 transition cursor-pointer">



                <h2 className="text-4xl">

                  🏠

                </h2>



                <p className="text-white font-bold text-xl mt-4">

                  Dashboard

                </p>



                <p className="text-gray-300 mt-2">

                  View FireGuard AI Dashboard

                </p>



              </div>


            </Link>









            <Link href="/admin/upload">



              <div className="bg-blue-500/20 border border-blue-400 rounded-2xl p-8 text-center hover:bg-blue-500/40 transition cursor-pointer">



                <h2 className="text-4xl">

                  📂

                </h2>




                <p className="text-white font-bold text-xl mt-4">

                  Upload Database

                </p>




                <p className="text-gray-300 mt-2">

                  Upload Fire Alarm Excel File

                </p>




              </div>



            </Link>






          </div>









          <button


            onClick={logout}


            className="mt-10 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition"


          >


            🚪 Logout


          </button>







        </div>





      </div>





    </main>



  );


}