import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "FireGuard | FACP Search System",
  description: "Fire safety monitoring and FACP location search system",
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


<body>


<video
className="site-background-video"
autoPlay
loop
muted
playsInline
preload="metadata"
aria-hidden="true"
>
<source src="/facp-background.mp4" type="video/mp4" />
</video>

<div className="site-background-overlay" aria-hidden="true" />



<Navbar />



<div className="site-page-layer">

{children}

</div>



</body>


</html>


);


}
