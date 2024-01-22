"use client";
import { useState } from "react";
import MarkerBlock from "./MarkerBlock";
import HoverLine from "./HoverLine";

export default function Marker() {
  const [markers, setMarkers] = useState([]);

  const addMarker = (marker) => {
    setMarkers([...markers, marker]);
  };
  return (
    <div>
      <MarkerBlock onAddMarker={addMarker} markers={markers} />
      <HoverLine />
    </div>
  );
}
