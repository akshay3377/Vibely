
"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function PDFUpload() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [error, setError] = useState("");


  const  router = useRouter()

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setExtractedText("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !name || !role) {
      setError("Please fill all fields and select a PDF file.");
      return;
    }

    setLoading(true);
    setError("");
    setExtractedText("");

    try {
      const formData = new FormData();
      formData.append("FILE", file);
      formData.append("name", name);
      formData.append("role", role);

      const response = await fetch("/api/register-userinfo", {
        method: "POST",
        body: formData,
      });

      // if (!response.ok) {
      //   const msg = await response.text();
      //   throw new Error(msg || "Failed to extract PDF text");
      // }

      // const text = await response.text();
      // setExtractedText(text);

const data =  await response.json()
      console.log('response', data?.user?._id)

router.push(`/interview/${data.user._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Upload Resume & Enter Info</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Job Role (e.g., Frontend Developer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Upload & Extract"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

      {extractedText && (
        <div className="mt-6 bg-white border border-gray-300 rounded-md p-4 max-h-96 overflow-y-auto whitespace-pre-wrap font-mono text-sm text-gray-800">
          {extractedText}
        </div>
      )}
    </div>
  );
}