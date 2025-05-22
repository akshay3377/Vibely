"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function InterviewPage({ params }) {
  const { id } = params;

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | prep | record | done
  const [timer, setTimer] = useState(0);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);
  const videoRef = useRef(null);
  const lastTranscriptRef = useRef("");
  const { transcript, resetTranscript } = useSpeechRecognition();

  // Fetch questions on mount
  useEffect(() => {
    async function load() {
      const resUser = await fetch(`/api/user/${id}`);
      const user = await resUser.json();

      console.log("user", user);

      const res = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: user?.user?.resumeText }),
      });

      const data = await res.json();
      setQuestions(data.data || []);
      setCurrent(0);
      setPhase("prep");
      setTimer(10);
    }

    load();
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (
      !questions.length ||
      current >= questions.length ||
      phase === "done" ||
      uploading
    )
      return;
    if (timer === 0) {
      if (phase === "prep") {
        startRecording();
      } else if (phase === "record") {
        stopRecording(); // this will also upload
      }
      return;
    }

    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, phase, uploading]);

  useEffect(() => {
    lastTranscriptRef.current = transcript;
  }, [transcript]);

  const startRecording = async () => {
    resetTranscript();
    videoChunksRef.current = [];
    setTimer(120); // 2 mins
    setPhase("record");

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    videoRef.current.srcObject = stream;

    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    recorder.ondataavailable = (e) =>
      e.data.size && videoChunksRef.current.push(e.data);

    recorder.onstop = async () => {
      SpeechRecognition.stopListening();
      const blob = new Blob(videoChunksRef.current, { type: "video/webm" });
      const base64 = await blobToBase64(blob);
      setUploading(true);

      try {
        await fetch("/api/upload-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoBase64: base64,
            transcript: lastTranscriptRef.current,
            userId: id,
            question: questions[current],
          }),
        });

        const nextIndex = current + 1;
        setCurrent(nextIndex);

        if (nextIndex >= questions.length) {
          setPhase("done");
        } else {
          setPhase("prep");
          setTimer(2);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setUploading(false);
      }
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

  const handleNextEarly = () => {
    stopRecording(); // user clicked “Next” before 2 mins
  };

  const blobToBase64 = (blob) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

  const router = useRouter();

  if (!questions.length) return <p>Loading questions...</p>;

    if (phase === "done" || current >= questions.length) {
      router.push(`/result/${id}`);
    }


  return (
    <main
      style={{
        padding: 20,
        maxWidth: 600,
        margin: "auto",
        textAlign: "center",
      }}
    >
      <>{id}</>
      <h2>
        Question {current + 1} of {questions.length}
      </h2>
      <p>
        <strong>{questions[current]}</strong>
      </p>

      <video
        ref={videoRef}
        autoPlay
        muted
        style={{
          width: "100%",
          borderRadius: 8,
          background: "#000",
          marginTop: 10,
        }}
      />

      <p style={{ fontSize: "1.5rem", marginTop: 10 }}>
        {phase === "prep"
          ? `⏳ Prepare... ${timer}s`
          : phase === "record"
          ? `🎥 Recording... ${timer}s`
          : uploading
          ? "📤 Uploading..."
          : "Done"}
      </p>

      <p>
        <strong>🗣️ Transcript:</strong> {transcript}
      </p>

      {uploading && <p>Uploading answer...</p>}

      {phase === "record" && !uploading && (
        <button
          onClick={handleNextEarly}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            fontSize: "1rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          ✅ Done – Next Question
        </button>
      )}
    </main>
  );
}
