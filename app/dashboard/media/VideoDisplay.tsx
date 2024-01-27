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
    <div className="w-1/2 mt-16 flex justify-center">
      {videoSrc ? (
        <video
          ref={videoRef}
          className="rounded-md h-[24rem] mx-12"
          controls
          src={videoSrc}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="rounded-md bg-black h-[24rem] w-full mx-12"></div>
      )}
    </div>
  );
}
