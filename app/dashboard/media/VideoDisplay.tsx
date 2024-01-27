import { useEffect, useRef } from "react";

export default function VideoDisplay({ videoSrc, timestamp }: { videoSrc: string, timestamp: number }) {
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
  }, [timestamp])

  return (
    <div className="w-full h-full flex justify-center mt-4 rounded-lg">
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
        <div className="rounded-md bg-black h-[30rem] w-full mx-12 rounded-lg shadow-xl"></div>
      )}
    </div>
  );
}
