import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {

  title: "FireGuard AI",

  description: "Fire Safety Management System",

};





export default function RootLayout({

  children,

}: Readonly<{

  children: React.ReactNode;

}>) {



  return (


    <html

      lang="en"

      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}

    >



      <body className="min-h-screen bg-slate-100">





<nav className="bg-slate-900 text-white px-8 py-4 shadow-lg">


  <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">


    <h1 className="brand-fire text-2xl font-bold text-green-400">

      🔥 FireGuard AI

    </h1>





    <div className="flex gap-5 text-sm items-center">


      <Link
        href="/"
        className="top-nav-item"
      >
        🏠 Home
      </Link>



      <Link
        href="/admin"
        className="top-nav-item"
      >
        🔐 Admin
      </Link>



      <Link
        href="/patrol"
        className="top-nav-item"
      >
        📋 Patrol
      </Link>



      <Link
        href="/fire-alarm-report"
        className="top-nav-item"
      >
        🚨 Incident
      </Link>



      <Link
        href="/incidents"
        className="top-nav-item"
      >
        📊 History
      </Link>


    </div>


  </div>


</nav>







        <main>

          {children}

        </main>






      </body>



    </html>


  );

}