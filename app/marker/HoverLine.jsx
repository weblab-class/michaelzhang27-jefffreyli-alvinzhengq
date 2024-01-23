import React, { useState, useRef } from "react";

const HoverLine = () => {
  const [linePosition, setLinePosition] = useState(100);

  const handleMouseMove = (e) => {
    setLinePosition(e.clientX);
  };

  const divRef = useRef(null);

  return (
    <div className="relative h-[100px]" onMouseMove={handleMouseMove}>
      {/* Your content here */}
      <div
        className="absolute h-full w-px bg-black"
        style={{ left: `${linePosition}px` }}
      />
    </div>
  );
};

export default HoverLine;
