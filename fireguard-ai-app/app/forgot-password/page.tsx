"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/app/lib/firebase";


export default function ForgotPasswordPage() {


  const [email,setEmail] = useState("");

  const [message,setMessage] = useState("");

  const [error,setError] = useState("");

  const [loading,setLoading] = useState(false);





  async function resetPassword(){


    setMessage("");

    setError("");



    if(!email){


      setError(
        "⚠️ Please enter your email address"
      );


      return;

    }




    setLoading(true);




    try {



      await sendPasswordResetEmail(

        auth,

        email

      );




      setMessage(

        "✅ Password reset link sent. Check your email."

      );



    }



    catch(error:any){



      setError(

        "❌ Email not found or invalid"

      );



    }



    setLoading(false);



  }






  return (


    <main

      className="relative min-h-screen flex items-center justify-center bg-cover bg-center p-5"

      style={{

        backgroundImage:"url('/fire-bg.jpg')"

      }}

    >


      <div className="absolute inset-0 bg-black/60"></div>





      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl border border-green-500/40 rounded-3xl p-10 shadow-2xl">





        <div className="text-center">


          <p className="text-green-300 tracking-[5px] text-sm uppercase">

            FireGuard AI

          </p>




          <h1 className="text-4xl font-bold text-green-400 mt-3">

            🔑 Reset Password

          </h1>



          <p className="text-gray-300 mt-3">

            Enter your registered email

          </p>


        </div>





        <input


          placeholder="Enter Email"


          className="mt-8 w-full p-4 rounded-xl bg-white text-black border border-green-500 outline-none"


          value={email}


          onChange={(e)=>setEmail(e.target.value)}


        />

        




        <button


          onClick={resetPassword}


          className="mt-6 w-full bg-green-500 text-black font-bold py-4 rounded-xl hover:bg-green-400 transition hover:scale-105"


        >


          {


            loading

            ? "Sending..."

            : "📩 Send Reset Link"


          }


        </button>








        {


          message &&


          <div className="mt-5 bg-green-500/20 border border-green-400 rounded-xl p-3">


            <p className="text-green-300 text-center">

              {message}

            </p>


          </div>


        }







        {


          error &&


          <div className="mt-5 bg-red-500/20 border border-red-400 rounded-xl p-3">


            <p className="text-red-300 text-center">

              {error}

            </p>


          </div>


        }







        <div className="text-center mt-8">


          <Link

            href="/login"

            className="text-green-300 underline hover:text-green-400"

          >

            ← Back to Login

          </Link>


        </div>





      </div>




    </main>


  );


}