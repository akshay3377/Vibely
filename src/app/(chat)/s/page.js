"use client";

import { useState } from "react";

export default function HomePage() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResponse("");

    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    });

    const data = await res.json();
    setResponse(data.output || "No response.");
    setLoading(false);
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gemini AI Search (SDK)</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
        className="border p-2 w-full mb-4 rounded"
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="bg-blue-600  px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Thinking..." : "Search"}
      </button>
      {response && (
        <div className="mt-6 p-4 border rounded ">
          <strong>AI Response:</strong>
          <div
            className="prose" // optional Tailwind styling if you use @tailwindcss/typography
            dangerouslySetInnerHTML={{ __html: response }}
          />
        </div>
      )}
    </main>
  );
}
