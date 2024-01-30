import { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { auth } from "@/firebase/config";

export default function MediaBlock({
  media,
  scalar,
  marker_mode,
  setMarkerMaster,
  setPreviewMediaType,
  setPreviewTimestamp,
  setSrc,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: media.id });

  const blockWidth = media.duration * 30 * (scalar / 50);
  const [markers, setMarkers] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [token, setToken] = useState("");

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleAddMarker = (event) => {
    if (event.key.toLowerCase() === "m") {
      const rect = event.target.getBoundingClientRect();
      const x = mousePosition.x - rect.left;
      const relativeX = (x / rect.width) * 100;
      console.log(relativeX);
      addMarker(relativeX);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleAddMarker);
    window.addEventListener("keydown", handleDeleteMarker);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleAddMarker);
      window.removeEventListener("keydown", handleDeleteMarker);
    };
  }, [mousePosition]);

  useEffect(() => {
    const getToken = async () => {
      let jwt = (await auth.currentUser.getIdToken()) || "";
      setToken(jwt);
    };
    getToken();
  }, []);

  const addMarker = (markerTimestamp) => {
    setMarkers([...markers, markerTimestamp]);

    setMarkerMaster(media.id, [...markers, markerTimestamp], media.type);
  };

  // const handleAddMarker = (e) => {
  //   e.preventDefault();

  // let rect = e.target.getBoundingClientRect();

  // addMarker(
  //   ((e.clientX - rect.left) / rect.width) * parseFloat(media.duration)
  // );

  //   const rect = e.target.getBoundingClientRect();
  //   const x = e.clientX - rect.left;
  //   const relativeX = (x / rect.width) * 100;

  //   addMarker(relativeX);
  // };

  const handleDeleteMarker = (e) => {
    e.preventDefault();
    if (e.key === "d" && marker_mode) {
      const rect = e.target.getBoundingClientRect();
      const x = mousePosition.x - rect.left;
      const relativeX = (x / rect.width) * 100;

      // Filter markers within 1px range
      let filtered_markers = markers.filter(
        (value) => Math.abs(value - relativeX) > 1.0
      );
      setMarkers(filtered_markers);
      setMarkerMaster(media.id, filtered_markers, media.type);
    }
  };

  const [blockStyle, setBlockStyle] = useState({
    transition,
    transform: CSS.Transform.toString(transform),
    width: 100,
    height: 50,
    minWidth: media.duration * 30 * (scalar / 50),
    backgroundColor: "#2AB464",
    boxShadow: "1px 1px 1px #2AB464",
    marginRight: 0,
    borderRadius: 0,
    borderLeft: "1px solid black",
    display: "flex",
    position: "relative",
  });

  useEffect(() => {
    console.log(media);

    let newStyle = JSON.parse(JSON.stringify(blockStyle));
    newStyle.minWidth =
      (parseFloat(media.duration) - media.endDelta - media.startDelta) *
      30 *
      (scalar / 50);
    setBlockStyle(newStyle);
  }, [JSON.stringify(media), scalar]);

  return (
    <div
      ref={setNodeRef}
      style={blockStyle}
      {...attributes}
      {...(marker_mode ? {} : listeners)}
      // onClick={marker_mode ? handleAddMarker : undefined}
      onContextMenu={marker_mode ? handleDeleteMarker : undefined}
      onMouseMove={async (e) => {
        await handleMouseMove(e);
        setPreviewMediaType(media.type ? "video" : "audio");
        setSrc(media.url);

        if (marker_mode) {
          let rect = e.target.getBoundingClientRect();
          setPreviewTimestamp(
            ((e.clientX - rect.left) / rect.width) *
              parseFloat(media.duration - media.startDelta - media.endDelta)
          );
        }
      }}
    >
      {markers.map((markerTimestamp, index) => (
        <div
          key={index}
          className="absolute bg-white rounded-md h-full w-[2px] z-50 pointer-events-none"
          style={{
            top: 0,
            left: `${(markerTimestamp / parseFloat(media.duration)) * 100}%`, // Position marker based on relative percentage
            transform: CSS.Transform.toString(transform), // Apply the same transform as the parent
          }}
        />
      ))}
      <div style={{ height: 3 }}></div>
      {media.type === 0 ? (
        <img
          src={`/api/waveform?token=${token}`}
          className="absolute w-full h-[80%] object-fill top-0 left-0 bottom-0 right-0 m-auto z-5"
        ></img>
      ) : (
        <p className="m-4 text-xs text-white">
          {truncateText(
            `${media.duration}s - ${media.display_name}`,
            blockWidth / 8
          )}
        </p>
      )}
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
