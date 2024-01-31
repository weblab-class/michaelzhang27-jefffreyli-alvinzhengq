import { deleteObject, getStorage } from "@firebase/storage";
import { ref } from "firebase/storage";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { MediaFile, MediaList } from "../types";

import { CiTrash, CiImport } from "react-icons/ci";

export default function VideoCard({
  file,
  uploadedAudioFiles,
  setUploadedAudioFiles,
  setAudioSrc,
  addClip,
}: {
  file: MediaFile;
  uploadedAudioFiles: MediaList;
  setUploadedAudioFiles: Dispatch<SetStateAction<MediaList>>;
  setAudioSrc: Dispatch<SetStateAction<string>>;
  addClip: (clip: MediaFile) => Promise<void>;
}) {
  const handleDisplayAudio = () => {
    setAudioSrc(file.url);
  };

  const deleteAudio = async (audioPath: string) => {
    const storage = getStorage();
    const audioRef = ref(storage, audioPath);

    try {
      await deleteObject(audioRef);
    } catch (error) {
      console.log(error);
    }

    const updatedVideoFiles = uploadedAudioFiles.filter(
      (file) => file.url !== audioPath
    );

    setUploadedAudioFiles(updatedVideoFiles);
  };

  return (
    <div
      onClick={() => {
        handleDisplayAudio();
      }}
      key={file.id}
      className="relative flex flex-col items-center hover:scale-[1.02] transition duration-300 w-[11.5rem] max-h-[15vh] group cursor-pointer mx-auto"
    >
      <Image
        className="rounded-md h-auto w-full transition duration-300 group-hover:grayscale brightness-50"
        src={"/placeholder-image.jpeg"}
        alt="placeholder"
        width={100}
        height={100}
      ></Image>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="flex flex-col align-middle justify-center">
          <p className="text-white font-thin text-lg text-start">
            {truncateText(file.display_name, 10)}
          </p>
          <div className="flex flex-row justify-evenly align-middle text-lg">
            <CiImport onClick={() => addClip(file)} className="hover:fill-primary transition duration-300" />
            <CiTrash onClick={() => deleteAudio(file.url)} className="hover:fill-accent transition duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

function truncateText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + "...";
  } else {
    return text;
  }
}
