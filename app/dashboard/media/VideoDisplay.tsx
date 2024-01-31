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
    <div className="bg-black flex flex-row justify-start rounded-2xl shadow-black/30 shadow-xl" onClick={() => {
      // if (videoRef.current != null) {
      //   if (videoRef.current.paused) videoRef.current.play();
      //   else videoRef.current.pause();
      // }
    }}>
      {videoSrc ? (
        <video
          ref={videoRef}
          className="rounded-2xl bg-black w-full h-[62.8vh]"
          src={videoSrc}
          controls
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="rounded-2xl bg-black w-full h-[62.8vh]"></div>
      )}
    </div>
  );
}
