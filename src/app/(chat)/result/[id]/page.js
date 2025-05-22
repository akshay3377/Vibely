"use client";

import React, { useState, useEffect } from "react";

export default function UserVideosPage({ params }) {
  const { id } = params;

  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
        const res = await fetch(`/api/result-videos?userId=${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch");

        setAnswers(data.answers);
        setSelectedIndex(0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchVideos();
    }
  }, [id]);

  const selected = answers[selectedIndex] || null;

  return (
    <section className="w-full  ">
      <div className="container mx-auto grid grid-cols-12 gap-6 min-h-screen">
        {/* Left side: video and details */}
        <div className="col-span-7 border border-gray-300 rounded-lg p-6 flex flex-col justify-center gap-4 overflow-y-auto">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : !selected ? (
            <p>No answers found.</p>
          ) : (
            <>
             
              <p className="mb-4">Question: {selected.question}</p>
              <video
                src={selected.url}
                controls
                className="w-full max-h-[400px] rounded-lg mb-4"
              />
              <p>
                <strong>Transcript:</strong> {selected.transcript}
              </p>
              <p>
                <strong>Marks:</strong> {selected.marks}
              </p>
              <p>
                <strong>Comment:</strong> {selected.comment}
              </p>
            </>
          )}
        </div>

        {/* Right side: scrollable list */}
        <div className="col-span-5 border border-gray-300 rounded-lg p-4 overflow-y-auto max-h-[80vh]">
          <h3 className="text-lg font-semibold mb-4">All Answers</h3>
          {answers.map((answer, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`cursor-pointer p-3 mb-3 rounded-md ${
                idx === selectedIndex
                  ? "bg-blue-600 "
                  : "bg-"
              }`}
            >
              <p className="font-medium">
                Q{idx + 1}:{" "}
                {answer.question.length > 50
                  ? answer.question.slice(0, 50) + "..."
                  : answer.question}
              </p>
              <p>
                <strong>Marks:</strong> {answer.marks}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
