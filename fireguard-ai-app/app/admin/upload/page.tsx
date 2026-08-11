"use client";

import { useState } from "react";
import Link from "next/link";
import { auth } from "@/app/lib/firebase";

type UploadResponse = {
  success?: boolean;
  message?: string;
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);

  async function uploadExcel() {
    if (!file) {
      setStatus("error");
      setMessage("Please select an Excel database file first");
      return;
    }

    setLoading(true);
    setStatus("");
    setMessage("");

    try {
      await auth.authStateReady();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setStatus("error");
        setMessage("Admin session expired. Please login again");
        return;
      }

      const idToken = await currentUser.getIdToken(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: formData,
      });

      const responseText = await response.text();
      let data: UploadResponse = {};

      try {
        data = JSON.parse(responseText) as UploadResponse;
      } catch {
        data = {
          success: false,
          message: responseText || `Server returned ${response.status}`,
        };
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Upload failed. Please check the Excel format");
      }

      setStatus("success");
      setMessage(data.message || "Database uploaded successfully");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Server error. Please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="relative min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/fire-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 max-w-3xl mx-auto pt-10">
        <div className="bg-white/10 backdrop-blur-2xl border border-blue-400/40 rounded-3xl p-10 shadow-2xl">
          <h1 className="text-4xl text-center font-bold text-blue-400">
            📂 Upload FACP Database
          </h1>
          <p className="text-center text-gray-300 mt-3">
            Admin Database Management System
          </p>

          <div className="mt-8 bg-black/30 rounded-2xl p-6 border border-blue-400/20">
            <label className="text-white font-bold" htmlFor="facp-file">
              Select Excel File
            </label>
            <input
              id="facp-file"
              type="file"
              accept=".xlsx,.xls"
              className="mt-4 w-full bg-white text-black p-4 rounded-xl cursor-pointer"
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null);
                setStatus("");
                setMessage("");
              }}
            />
            {file && (
              <p className="text-green-300 mt-3">Selected: {file.name}</p>
            )}
          </div>

          <button
            type="button"
            onClick={uploadExcel}
            disabled={loading}
            className="mt-6 w-full bg-green-500 text-black font-bold py-4 rounded-xl hover:bg-green-400 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "⏳ Uploading..." : "📤 Upload Database"}
          </button>

          {message && (
            <div className="mt-5 bg-black/40 rounded-xl p-4" aria-live="polite">
              <p
                className={`text-center font-bold ${
                  status === "success" ? "text-green-300" : "text-red-300"
                }`}
              >
                {status === "success" ? "✅" : "❌"} {message}
              </p>
            </div>
          )}

          <Link
            href="/admin"
            className="mt-6 block w-full border border-blue-400 text-blue-300 py-3 rounded-xl hover:bg-blue-500/20 transition text-center"
          >
            ← Back Admin Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
