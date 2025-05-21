"use client";

import { useEffect, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function Home() {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [allVideos, setAllVideos] = useState([]);
  const [gradingMap, setGradingMap] = useState({});
  const mediaRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);
  const videoRef = useRef(null);
  const lastTranscriptRef = useRef("");

  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    lastTranscriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const res = await fetch("/api/videos");
    const videos = await res.json();
    setAllVideos(videos);

    for (const vid of videos) {
      if (vid.transcript) {
        fetchGrade(vid._id, "What is React?", vid.transcript);
      }
    }
  };

  const fetchGrade = async (id, question, answer) => {
    setGradingMap(prev => ({
      ...prev,
      [id]: { loading: true, marks: null, feedback: "" },
    }));

    try {
      const res = await fetch("/api/a", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      });

      const data = await res.json();
      setGradingMap(prev => ({
        ...prev,
        [id]: {
          loading: false,
          marks: data?.marks ?? "N/A",
          feedback: data?.comment ?? "No feedback",
        },
      }));
    } catch (err) {
      console.error("Grading failed", err);
      setGradingMap(prev => ({
        ...prev,
        [id]: { loading: false, marks: "Error", feedback: "Failed to grade" },
      }));
    }
  };

  const startRecording = async () => {
    setVideoURL(null);
    videoChunksRef.current = [];
    resetTranscript();

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoRef.current.srcObject = stream;

    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        videoChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      SpeechRecognition.stopListening();

      const videoBlob = new Blob(videoChunksRef.current, { type: "video/webm" });
      const videoPreviewURL = URL.createObjectURL(videoBlob);
      setVideoURL(videoPreviewURL);

      const base64Video = await blobToBase64(videoBlob);

      setUploading(true);
      try {
        const res = await fetch("/api/upload-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoBase64: base64Video,
            transcript: lastTranscriptRef.current,
          }),
        });
        const data = await res.json();
        if (data?.url) {
          fetchVideos();
        } else {
          alert("Upload failed");
        }
      } catch (err) {
        console.error(err);
        alert("Error uploading video");
      } finally {
        setUploading(false);
      }
    };

    mediaRecorder.start();
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    setRecording(false);
  };

  const blobToBase64 = (blob) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

  return (
    <main style={{ padding: 20, maxWidth: 600, margin: "auto", textAlign: "center" }}>
      <h1>🎥 Record and Transcribe</h1>

      <video
        ref={videoRef}
        autoPlay
        muted
        style={{ width: "100%", borderRadius: 8, background: "#000" }}
      />

      {!recording ? (
        <button onClick={startRecording} style={buttonStyle}>
          Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          style={{ ...buttonStyle, background: "red", color: "#fff" }}
        >
          Stop Recording
        </button>
      )}

      <p>
        <strong>🗣️ Live Transcript:</strong> {transcript}
      </p>

      {uploading && <p>Uploading...</p>}

      {videoURL && (
        <>
          <h3>Preview</h3>
          <video src={videoURL} controls style={{ width: "100%", borderRadius: 8 }} />
        </>
      )}

      <hr style={{ margin: "30px 0" }} />

      <h2>📂 Recorded Videos</h2>
      {allVideos.length === 0 ? (
        <p>No videos yet.</p>
      ) : (
        allVideos.map((vid) => {
          const grade = gradingMap[vid._id];
          return (
            <div
              className="text-black"
              key={vid._id}
              style={{
                marginBottom: 20,
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 10,
                background: "#f9f9f9",
              }}
            >
              <video src={vid.url} controls style={{ width: "100%" }} />
              <p className="text-black">
                <strong>📝 Transcript:</strong> {vid.transcript || "N/A"}
              </p>
              {grade?.loading ? (
                <p>🔍 Grading...</p>
              ) : (
                <>
                  <p>📊 <strong>Marks:</strong> {grade?.marks ?? "N/A"} / 5</p>
                  <p>🗒️ <strong>Note:</strong> {grade?.feedback ?? "No feedback"}</p>
                </>
              )}
            </div>
          );
        })
      )}
    </main>
  );
}

const buttonStyle = {
  marginTop: 20,
  padding: "10px 20px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  background: "#0070f3",
  color: "#fff",
};
