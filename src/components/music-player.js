"use client";

import {PauseIcon , PlayIcon} from "@/icons";
import { useRef, useState } from "react";

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false); // start as false

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.warn("Playback error:", err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleMusic}
        className="bg-white border shadow-md p-1 rounded-full hover:bg-gray-100 transition"
        aria-label="Toggle Music"
      >
        {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
      </button>
      <audio ref={audioRef} loop preload="auto">
        <source src="/audio/soft-music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default MusicPlayer;
