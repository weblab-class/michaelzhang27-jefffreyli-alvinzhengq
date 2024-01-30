import { useEffect, useRef } from "react";
import Details from "./Details";
import { MediaList } from "../types";

export default function VideoDisplay({
  videoSrc,
  timestamp,
  clipList,
}: {
  videoSrc: string;
  timestamp: number;
  clipList: MediaList;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current != null) {
      videoRef.current.src = videoSrc;
    }
  }, [videoSrc]);

  useEffect(() => {
    if (videoRef.current != null) {
      videoRef.current.pause();
      videoRef.current.currentTime = timestamp;
    }
  }, [timestamp]);

  return (
    <div className="w-[45%] bg-black flex flex-row justify-start rounded-lg mx-auto">
      {videoSrc ? (
        <video
          ref={videoRef}
          className="rounded-md bg-black w-full h-[54vh]"
          controls
          src={videoSrc}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="rounded-md bg-black w-full h-[50vh]"></div>
      )}
    </div>
  );
}
