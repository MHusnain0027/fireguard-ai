"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";

import { auth } from "@/app/lib/firebase";


export default function LoginPage() {


  const router = useRouter();


  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  async function forgotPassword(){

  if(!email){

    setError("❌ Please enter your email first");

    return;

  }


  try{

    await sendPasswordResetEmail(
      auth,
      email
    );


    setError(
      "✅ Password reset link sent to your email"
    );


  }

  catch(error:any){

    setError(
      "❌ Email not found or reset failed"
    );

  }

}



  async function login(){


    setError("");
    setLoading(true);



    try {


      const userCredential = await signInWithEmailAndPassword(

        auth,

        email,

        password

      );



      localStorage.setItem(

        "fireguard_admin",

        userCredential.user.email || ""

      );



      router.push("/admin");



    }


    catch(error:any){


      setError(
        "❌ Invalid Email or Password"
      );


      setLoading(false);


    }


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
            🔐 Admin Login
          </h1>


          <p className="text-gray-300 mt-3">
            Firebase Secure Authentication
          </p>


        </div>

        
        <input

          placeholder="Enter Email"

          className="mt-8 w-full p-4 rounded-xl bg-white text-black outline-none border border-green-500"

          value={email}

          onChange={(e)=>setEmail(e.target.value)}

        />




        <input

          placeholder="Enter Password"

          type="password"

          className="mt-4 w-full p-4 rounded-xl bg-white text-black outline-none border border-green-500"

          value={password}

          onChange={(e)=>setPassword(e.target.value)}

        />





        <button


          onClick={login}


          className="mt-6 w-full bg-green-500 text-black font-bold py-4 rounded-xl hover:bg-green-400 transition hover:scale-105"


        >


          {

            loading

            ? "Checking..."

            : "🚀 Login"

          }


        </button>

        <button

onClick={forgotPassword}

className="mt-4 w-full bg-transparent border border-green-400 text-green-300 font-bold py-3 rounded-xl hover:bg-green-500/20 transition"

>

🔑 Forgot Password

</button>





        {


          error &&


          <div className="mt-5 bg-red-500/20 border border-red-400 rounded-xl p-3">


            <p className="text-red-300 text-center">

              {error}

            </p>


          </div>


        }





        <div className="text-center mt-8">


          <p className="text-gray-400 text-sm">

            FireGuard AI Secure System

          </p>


        </div>




      </div>



    </main>


  );


}