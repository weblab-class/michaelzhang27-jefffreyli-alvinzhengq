import { deleteObject, getStorage } from "@firebase/storage";
import { ref } from "firebase/storage";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MediaFile, MediaList } from "../types";

import { CiTrash, CiImport } from "react-icons/ci";
import axios from "axios";

export default function VideoCard({
  file,
  uploadedVideoFiles,
  setUploadedVideoFiles,
  setVideoSrc,
  addClip,
  selectedClip,
  setSelectedClip,
}: {
  file: MediaFile;
  uploadedVideoFiles: MediaList;
  setUploadedVideoFiles: Dispatch<SetStateAction<MediaList>>;
  setVideoSrc: Dispatch<SetStateAction<string>>;
  addClip: (clip: MediaFile) => Promise<void>;
  selectedClip: MediaFile;
  setSelectedClip: Dispatch<SetStateAction<MediaFile>>;
}) {
  const [imageURL, setImageURL] = useState<string>(file.url.replace("mp4", "png"));
  const handleDisplayVideo = () => {
    setVideoSrc(file.url);
  };

  const deleteVideo = async (videoPath: string) => {
    const storage = getStorage();
    const videoRef = ref(storage, videoPath);

    try {
      await deleteObject(videoRef);
    } catch (error) {
      console.log(error);
    }

    const updatedVideoFiles = uploadedVideoFiles.filter(
      (file) => file.url !== videoPath
    );

    setUploadedVideoFiles(updatedVideoFiles);
  };

  useEffect(() => {
    setTimeout(() => {
      setImageURL(file.url.replace("mp4", "png") + "&rand=" + Math.floor(Math.random() * 1000000000));
    }, 20000);
  }, [])

  return (
    <div
      onClick={() => {
        handleDisplayVideo();
        setSelectedClip({
          display_name: file.display_name,
          id: file.id,
          url: file.url,
          type: file.type,
          duration: file.duration,
          startDelta: file.startDelta,
          endDelta: file.endDelta,
          flex: file.flex,
          markers: file.markers,
        });
      }}
      key={file.id}
      className="relative flex flex-col items-center hover:scale-[1.02] transition duration-300 w-[11.8vw] h-full max-h-[15vh] group cursor-pointer mx-auto"
    >
      <Image
        className="rounded-md h-auto w-full transition duration-300 group-hover:grayscale"
        src={imageURL}
        alt="Thumbnail Loading..."
        width={100}
        height={100}
      ></Image>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="flex flex-col align-middle justify-center">
          <p className="text-white font-thin text-lg text-start">
            {truncateText(file.display_name, 10)}
          </p>
          <div className="flex flex-row justify-evenly align-middle text-lg">
            <CiImport
              onClick={() => addClip(file)}
              className="hover:fill-primary transition duration-300"
            />
            <CiTrash
              onClick={() => deleteVideo(file.url)}
              className="hover:fill-accent transition duration-300"
            />
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
