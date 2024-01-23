import { useState } from "react";

export default function AudioBlock({ id, size, scalar }) {
  const [markers, setMarkers] = useState([]);

  const addMarker = (relativeX) => {
    setMarkers([...markers, relativeX]);
  };

  const handleAddMarker = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // Absolute x position within the block
    const relativeX = (x / rect.width) * 100; // Relative x position in percentage
    console.log(relativeX);
    addMarker(relativeX);
  };

  const audioBlockStyle = {
    width: size * 50 * (scalar / 50),
    height: 50,
    backgroundColor: "#ff9a3c",
    boxShadow: "1px 1px 1px #F6C7B3",
    marginRight: 10,
    borderRadius: 5,
    display: "flex",
    position: "relative", // Ensure relative positioning for markers
  };

  return (
    <div style={audioBlockStyle} onClick={handleAddMarker}>
      {markers.map((relativeX, index) => (
        <div
          key={index}
          className="absolute bg-darkGrey rounded-md h-full w-[2px]"
          style={{
            top: 0,
            left: `${relativeX}%`, // Position marker based on relative percentage
          }}
        />
      ))}
      <div style={{ margin: 5 }}>
        <text>{id}</text>
      </div>
    </div>
  );
}
