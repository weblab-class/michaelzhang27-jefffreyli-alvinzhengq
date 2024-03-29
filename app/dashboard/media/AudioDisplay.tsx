import Image from "next/image";
import { useEffect, useRef } from "react";

export default function AudioDisplay({ audioSrc, timestamp }: { audioSrc: string, timestamp: number }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current !== null) {
      audioRef.current.src = audioSrc;
    }
  }, [audioSrc]);

  useEffect(() => {
    if (audioRef.current != null) {
      audioRef.current.pause();
      audioRef.current.currentTime = timestamp;
    }
  }, [timestamp])

  return (
    <div className="bg-black flex flex-col justify-around rounded-2xl shadow-black/30 shadow-xl w-full h-[62.8vh]">
      <Image
        src="/audio-image.png"
        alt="audio-image"
        width={310}
        height={310}
        className="shadow-md aspect-square m-auto rounded-md"
      />
      <audio ref={audioRef} className="rounded-md w-5/6 my-4 mx-auto" controls>
        <source src="" type="audio/mp3" />
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
}
