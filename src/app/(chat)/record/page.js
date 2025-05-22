"use client";

import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function InterviewPage({ params }) {
  const { id } = params;

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState("prep"); // prep | record | done
  const [timer, setTimer] = useState(10);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);
  const videoRef = useRef(null);
  const lastTranscriptRef = useRef("");
  const { transcript, resetTranscript } = useSpeechRecognition();

  // Fetch 10 questions on mount
  useEffect(() => {
    async function load() {
      const resUser = await fetch(`/api/user/${id}`);
      const user = await resUser.json();

      const res = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: user.resumeText }),
      });
      const data = await res.json();
      setQuestions(data.questions || []);
    }

    load();
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (!questions.length || current >= questions.length || phase === "done") return;
    if (timer === 0) {
      if (phase === "prep") {
        startRecording();
      } else if (phase === "record") {
        stopRecording();
      }
      return;
    }

    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, phase]);

  useEffect(() => {
    lastTranscriptRef.current = transcript;
  }, [transcript]);

  const startRecording = async () => {
    resetTranscript();
    videoChunksRef.current = [];
    setTimer(120);
    setPhase("record");

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoRef.current.srcObject = stream;

    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    recorder.ondataavailable = (e) => e.data.size && videoChunksRef.current.push(e.data);

    recorder.onstop = async () => {
      SpeechRecognition.stopListening();
      const blob = new Blob(videoChunksRef.current, { type: "video/webm" });
      const base64 = await blobToBase64(blob);
      setUploading(true);

      await fetch("/api/upload-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoBase64: base64,
          transcript: lastTranscriptRef.current,
          userId: id,
          question: questions[current],
        }),
      });

      setUploading(false);
      setCurrent((i) => i + 1);
      setPhase("prep");
      setTimer(10);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    videoRef.current?.srcObject?.getTracks().forEach((track) => track.stop());
    setRecording(false);
  };

  const blobToBase64 = (blob) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

  if (!questions.length) return <p>Loading questions...</p>;
  if (current >= questions.length) return <p>✅ Interview Completed!</p>;

  return (
    <main style={{ padding: 20, maxWidth: 600, margin: "auto", textAlign: "center" }}>
      <h2>Question {current + 1} of {questions.length}</h2>
      <p><strong>{questions[current]}</strong></p>

      <video
        ref={videoRef}
        autoPlay
        muted
        style={{ width: "100%", borderRadius: 8, background: "#000" }}
      />

      <p style={{ fontSize: "1.5rem", marginTop: 10 }}>
        {phase === "prep" ? `⏳ Prepare... ${timer}s` :
         phase === "record" ? `🎥 Recording... ${timer}s` : "Done"}
      </p>

      <p><strong>Transcript:</strong> {transcript}</p>

      {uploading && <p>Uploading answer...</p>}
    </main>
  );
}
