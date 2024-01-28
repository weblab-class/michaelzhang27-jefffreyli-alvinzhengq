"use client";

// components/MovingLine.js

import { useState, useEffect } from "react";

const MovingLine = () => {
  const [play, setPlay] = useState(false);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    let interval;
    if (play) {
      interval = setInterval(() => {
        setPosition((prev) => (prev < 100 ? prev + 0.1 : 0));
      }, 50);
    }

    return () => {
      clearInterval(interval);
    };
  }, [play]);

  return (
    <div className="relative w-full h-8 bg-gray-200">
      <div
        className="absolute top-0 h-8 bg-blue-500"
        style={{ width: "2px", left: `${position}%` }}
      ></div>
      <button className="absolute top-1 right-1" onClick={() => setPlay(!play)}>
        {play ? "Pause" : "Play"}
      </button>
    </div>
  );
};

export default MovingLine;
