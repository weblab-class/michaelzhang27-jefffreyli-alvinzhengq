import React, { useState, useRef } from "react";

const HoverLine = () => {
  const [linePosition, setLinePosition] = useState(100);

  const handleMouseMove = (e) => {
    setLinePosition(e.clientX);
  };

  const divRef = useRef(null);

  const calculateFraction = (e) => {
    if (divRef.current) {
      const divWidth = divRef.current.getBoundingClientRect().width;
      console.log(linePosition / divWidth); // If linePosition is horizontal
    }
  };

  return (
    <div className="relative h-[100px]" onMouseMove={handleMouseMove}>
      {/* Your content here */}
      <div
        onClick={(e) => {
          calculateFraction(e);
        }}
        className="absolute h-full w-px bg-black"
        style={{ left: `${linePosition}px` }}
      />
    </div>
  );
};

export default HoverLine;
