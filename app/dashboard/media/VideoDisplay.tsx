import { useEffect, useRef } from "react";
import Details from "./Details";

export default function VideoDisplay({
  videoSrc,
  timestamp,
}: {
  videoSrc: string;
  timestamp: number;
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
    <div className="w-full h-full flex justify-center rounded-lg">
      {videoSrc ? (
        <video
          ref={videoRef}
          className="rounded-md h-[30rem] mx-4"
          controls
          src={videoSrc}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="rounded-md bg-black h-[30rem] w-full ml-12 mr-8 rounded-lg shadow-xl"></div>
      )}
      <Details
        name={undefined}
        duration={undefined}
        size={undefined}
        type={undefined}
        isFlexible={undefined}
      />
    </div>
  );
}
