import { deleteObject, getStorage } from "@firebase/storage";
import { ref } from "firebase/storage";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { MediaFile, MediaList } from "../types";

interface VideoClip {
  id: number;
  name: string;
  length: number;
  flex: boolean;
}

export default function VideoCard({
  file,
  uploadedVideoFiles,
  setUploadedVideoFiles,
  setVideoSrc,
  addClip,
  videoClips,
  setVideoClips,
}: {
  file: MediaFile;
  uploadedVideoFiles: MediaList;
  setUploadedVideoFiles: Dispatch<SetStateAction<MediaList>>;
  setVideoSrc: Dispatch<SetStateAction<string>>;
  addClip: (clip: MediaFile) => Promise<void>;
  videoClips: Array<VideoClip>;
  setVideoClips: Dispatch<SetStateAction<Array<VideoClip>>>;
}) {
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

  const addVideoBlock = (
    id: number,
    name: string,
    length: number,
    flex: boolean
  ) => {
    // setVideoClips((currentVideoClips: VideoClip[]) => [
    //   ...(Array.isArray(currentVideoClips) ? currentVideoClips : []),
    //   { id, name, length, flex },
    // ]);
    if(videoClips == null){
      setVideoClips([{ id, name, length, flex } ])
    }
    else{
      setVideoClips([...videoClips, { id, name, length, flex } ])
    }
  };

  const addIcon = (
    <button
      onClick={() => {
        addClip(file);
        addVideoBlock(
          parseFloat(file.id),
          file.display_name,
          parseFloat(file.duration),
          false
        );

      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5 cursor-pointer"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );

  const trashIcon = (
    <button onClick={() => deleteVideo(file.url)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5 cursor-pointer"
      >
        <path
          fillRule="evenodd"
          d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );

  return (
    <div
      onClick={() => {
        handleDisplayVideo();
      }}
      key={file.id}
      className="mx-2 p-3 border-b-[1px] border-gray-300 h-20 flex items-center justify-between"
    >
      <div className="flex items-center space-x-4">
        <Image
          className="rounded-md h-16 w-auto"
          src={"/placeholder-image.jpeg"}
          alt="placeholder"
          width={50}
          height={50}
        ></Image>
        <p className="text-gray-700 text-xs">{file.display_name}</p>
      </div>

      <div className="flex space-x-4">
        {addIcon}
        {trashIcon}
      </div>
    </div>
  );
}
