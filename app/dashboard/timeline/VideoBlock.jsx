import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function VideoBlock({ video, scalar, marker_mode }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: video.id });

  const [markers, setMarkers] = useState([]);

  const addMarker = (relativeX) => {
    setMarkers([...markers, relativeX]);
  };

  const handleAddMarker = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // Absolute x position within the block
    const relativeX = (x / rect.width) * 100; // Relative x position in percentage
    console.log(relativeX);
    console.log(markers);
    addMarker(relativeX);
  };

  const blockStyle = {
    transition,
    transform: CSS.Transform.toString(transform),
    width: 100, // Adjust this based on your requirements
    height: 50, // Adjust this based on your requirements
    minWidth: video.length * 50 * (scalar / 50),
    backgroundColor: "#ff6f3c",
    boxShadow: "1px 1px 1px #F6C7B3",
    marginRight: 10,
    borderRadius: 5,
    display: "flex",
    position: "relative", // Ensure relative positioning for markers
  };

  return (
    <div
      ref={setNodeRef}
      style={blockStyle}
      {...attributes}
      {...(marker_mode ? {} : listeners)}
      onClick={marker_mode ? handleAddMarker : undefined}
    >
      {markers.map((relativeX, index) => (
        <div
          key={index}
          className="absolute bg-darkGrey rounded-md h-full w-[2px]"
          style={{
            top: 0,
            left: `${relativeX}%`, // Position marker based on relative percentage
            transform: CSS.Transform.toString(transform), // Apply the same transform as the parent
          }}
        />
      ))}
      <div style={{ height: 3 }}></div>
      {video.flex && (
        <div style={{ margin: 8 }}>
          <text>C</text>
        </div>
      )}
      <text style={{ margin: 8 }}>{video.id}</text>
    </div>
  );
}
