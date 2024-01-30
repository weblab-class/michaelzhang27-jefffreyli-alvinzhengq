import React, { Dispatch, SetStateAction } from "react";
import AudioCard from "./AudioCard";
import VideoCard from "./VideoCard";
import { MediaFile, MediaList } from "../types";

interface Clip {
  id: number;
  name: string;
  length: number;
  flex: boolean;
}

export default function MediaLibrary({
  previewMediaType,
  setPreviewMediaType,
  uploadedVideoFiles,
  setUploadedVideoFiles,
  uploadedAudioFiles,
  setUploadedAudioFiles,
  handleFileUpload,
  setVideoSrc,
  setAudioSrc,
  addClip,
  selectedClip,
  setSelectedClip,
}: {
  previewMediaType: string;
  setPreviewMediaType: Dispatch<SetStateAction<string>>;
  uploadedVideoFiles: MediaList;
  setUploadedVideoFiles: Dispatch<SetStateAction<MediaList>>;
  uploadedAudioFiles: MediaList;
  setUploadedAudioFiles: Dispatch<SetStateAction<MediaList>>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setVideoSrc: Dispatch<SetStateAction<string>>;
  setAudioSrc: Dispatch<SetStateAction<string>>;
  addClip: (clip: MediaFile) => Promise<void>;
  selectedClip: MediaFile;
  setSelectedClip: Dispatch<SetStateAction<MediaFile>>;
}) {
  return (
    <div className="w-[45%]">
      <div className="h-[42vh] bg-dawn p-3 rounded-lg overflow-scroll grid grid-cols-5 gap-y-4 no-scrollbar">
        {previewMediaType == "video"
          ? uploadedVideoFiles.map((file) => (
              <VideoCard
                key={file.id}
                file={file}
                uploadedVideoFiles={uploadedVideoFiles}
                setUploadedVideoFiles={setUploadedVideoFiles}
                setVideoSrc={setVideoSrc}
                addClip={addClip}
              />
            ))
          : uploadedAudioFiles.map((file) => (
              <AudioCard
                key={file.id}
                file={file}
                uploadedAudioFiles={uploadedAudioFiles}
                setUploadedAudioFiles={setUploadedAudioFiles}
                setAudioSrc={setAudioSrc}
                addClip={addClip}
              />
            ))}
      </div>

      <div className="flex justify-between mt-4">
        <div className="flex justify-start space-x-4 my-auto">
          <button
            className="cursor-pointer relative my-auto
            text-white bg-gradient-to-r from-pink-500 via-pink-500 to-pink-600 
            before:bg-gradient-to-br before:from-pink-500 before:via-pink-600 before:to-pink-700 before:opacity-0
            before:top-0 before:left-0 before:bottom-0 before:right-0 before:content-[''] before:absolute before:transition before:duration-500
            hover:before:opacity-100 before:rounded-lg before:z-0 z-10
            shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 
            font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={() => setPreviewMediaType("video")}
          >
            <span className="relative">Video</span>
          </button>
          <button
            className="cursor-pointer relative my-auto
            text-white bg-gradient-to-r from-pink-500 via-pink-500 to-pink-600 
            before:bg-gradient-to-br before:from-pink-500 before:via-pink-600 before:to-pink-700 before:opacity-0
            before:top-0 before:left-0 before:bottom-0 before:right-0 before:content-[''] before:absolute before:transition before:duration-500
            hover:before:opacity-100 before:rounded-lg before:z-0 z-10
            shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 
            font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={() => setPreviewMediaType("audio")}
          >
            <span className="relative">Audio</span>
          </button>
        </div>

        <button className="flex self-end my-auto">
          <input
            type="file"
            accept={previewMediaType === "video" ? "video/*" : "audio/mpeg"}
            className="hidden"
            id="media-upload"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="media-upload"
            className="cursor-pointer relative
            text-white bg-gradient-to-r from-pink-500 via-pink-500 to-pink-600 
            before:bg-gradient-to-br before:from-pink-500 before:via-pink-600 before:to-pink-700 before:opacity-0
            before:top-0 before:left-0 before:bottom-0 before:right-0 before:content-[''] before:absolute before:transition before:duration-500
            hover:before:opacity-100 before:rounded-lg before:z-0 z-10
            shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 
            font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            <p className="relative">Add Files</p>
          </label>
        </button>
      </div>
    </div>
  );
}
