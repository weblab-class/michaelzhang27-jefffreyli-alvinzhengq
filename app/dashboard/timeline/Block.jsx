import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function MediaBlock({ media, scalar, marker_mode }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: media.id });

  const blockWidth = media.duration * 30 * (scalar / 50);
  const [markers, setMarkers] = useState([]);

  const addMarker = (relativeX) => {
    setMarkers([...markers, relativeX]);
  };

  const handleAddMarker = (e) => {
    e.preventDefault();

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // Absolute x position within the block
    const relativeX = (x / rect.width) * 100; // Relative x position in percentage

    addMarker(relativeX);
  };

  const handleDeleteMarker = (e) => {
    e.preventDefault();

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left; // Absolute x position within the block
    const relativeX = (x / rect.width) * 100; // Relative x position in percentage

    let filtered_markers = markers.filter(
      (value) => Math.abs(value - relativeX) > 2.5
    );
    setMarkers(filtered_markers);
  };

  const blockStyle = {
    transition,
    transform: CSS.Transform.toString(transform),
    width: 100, // Adjust this based on your requirements
    height: 50, // Adjust this based on your requirements
    minWidth: media.duration * 30 * (scalar / 50),
    backgroundColor: "#2AB464",
    boxShadow: "1px 1px 1px #2AB464",
    marginRight: 10,
    borderRadius: 5,
    display: "flex",
    position: "relative",
  };

  return (
    <div
      ref={setNodeRef}
      style={blockStyle}
      {...attributes}
      {...(marker_mode ? {} : listeners)}
      onClick={marker_mode ? handleAddMarker : undefined}
      onContextMenu={marker_mode ? handleDeleteMarker : undefined}
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
      {media.flex && (
        <div style={{ margin: 8 }}>
          <text>C</text>
        </div>
      )}
      <p className="m-4 text-xs text-white">
        {truncateText(
          `${media.duration}s - ${media.display_name}`,
          blockWidth / 8
        )}
      </p>
    </div>
  );
}

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + "...";
  } else {
    return text;
  }
}
