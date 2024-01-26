import Image from "next/image";
import { useEffect, useRef } from "react";

export default function AudioDisplay({ audioSrc }: { audioSrc: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current !== null) {
      audioRef.current.src = audioSrc;
    }
  }, [audioSrc]);

  return (
    <div className="w-full h-full justify-center">
      <div className="flex justify-center items-center bg-black mx-10 rounded-lg shadow-xl">
        <Image
          src="/audio-image.png"
          alt="audio-image"
          width={450}
          height={450}
          className="rounded-md shadow-md aspect-square"
        />
      </div>
      <audio ref={audioRef} className="rounded-md w-5/6 my-4 mx-auto" controls>
        <source src="" type="audio/mp3" />
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
}
