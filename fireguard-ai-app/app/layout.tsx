import type {
  Metadata,
  Viewport,
} from "next";
import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

import Navbar from "./components/Navbar";
import PwaRegister from "./components/PwaRegister";

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
  description:
    "Fire safety monitoring and FACP location search system",
  applicationName: "FireGuard",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "FireGuard",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#07110f",
  colorScheme: "dark",
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
        <PwaRegister />

        <video
          className="site-background-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source
            src="/14471459_3840_2160_30fps.mp4"
            type="video/mp4"
          />
        </video>

        <div
          className="site-background-overlay"
          aria-hidden="true"
        />

        <div className="site-page-layer">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
