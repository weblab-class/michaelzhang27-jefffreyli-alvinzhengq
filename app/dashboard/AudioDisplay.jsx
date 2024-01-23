import Image from "next/image";
import { useEffect, useRef } from "react";

export default function AudioDisplay({ audioSrc }) {
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current.src = audioSrc;
  }, [audioSrc]);

  return (
    <div className="w-1/2 ">
      <div className="flex justify-center items-center py-4">
        <Image
          src="/audio-image.png"
          width={390}
          height={390}
          className="rounded-md shadow-md aspect-square"
        />
      </div>
      <audio ref={audioRef} className="rounded-md w-5/6 mx-12" controls>
        <source src="" type="audio/mp3" />
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
}
