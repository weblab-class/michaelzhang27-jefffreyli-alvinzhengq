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
  const [token, setToken] = useState("");

  const handleAddMarker = (e) => {
    e.preventDefault();

    let rect = e.target.getBoundingClientRect();

    addMarker(
      ((e.clientX - rect.left) / rect.width) * parseFloat(media.duration)
    );
  };

  const handleDeleteMarker = (e) => {
    e.preventDefault();

    let rect = e.target.getBoundingClientRect();

    let relativeX = ((e.clientX - rect.left) / rect.width) * parseFloat(media.duration);
    console.log(relativeX)
    console.log(markers)
    let filtered_markers = markers.filter(
      (value) => Math.abs(value - relativeX) > 0.25
    );

    setMarkers(filtered_markers);
    setMarkerMaster(media.id, filtered_markers, media.type);
  };

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

  const [blockStyle, setBlockStyle] = useState({
    transition,
    transform: CSS.Transform.toString(transform),
    width: (parseFloat(media.duration) - media.endDelta - media.startDelta) *
      30 *
      (scalar / 50),
    height: 40,
    minWidth: 0,
    marginRight: 2,
    borderRadius: 8,
    display: "flex",
    position: "relative",
  });

  useEffect(() => {
    let newStyle = JSON.parse(JSON.stringify(blockStyle));
    newStyle.width =
      (parseFloat(media.duration) - media.endDelta - media.startDelta) *
      30 *
      (scalar / 50);
    setBlockStyle(newStyle);
  }, [JSON.stringify(media), scalar]);

  return (
    <div
      ref={setNodeRef}
      style={blockStyle}
      className="shadow-accent/30 shadow-lg bg-accent hover:bg-accent_hover transition duration-500 z-40 overflow-hidden"
      {...attributes}
      {...(marker_mode ? {} : listeners)}
      onClick={marker_mode ? handleAddMarker : undefined}
      onContextMenu={marker_mode ? handleDeleteMarker : undefined}
      onMouseDown={() => {
        setPreviewMediaType(media.type ? "video" : "audio");
        setSrc(media.url);
      }}
      onMouseMove={async (e) => {
        if (marker_mode) {
          setPreviewMediaType(media.type ? "video" : "audio");
          setSrc(media.url);

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
          className="absolute w-full h-[80%] object-fill top-0 left-0 bottom-0 right-0 m-auto z-5 pointer-events-none"
        ></img>
      ) : (
        <p className="m-4 text-xs text-[#280001] font-thin my-auto pointer-events-none">
          {truncateText(
            `${media.display_name}`,
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
