import React, { Dispatch, SetStateAction } from "react";
import AudioCard from "./AudioCard";
import VideoCard from "./VideoCard";
import { MediaFile, MediaList } from "../types";

import { CiVideoOn, CiVolumeHigh, CiSaveUp1 } from "react-icons/ci";

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
    <div className="h-[48vh] bg-dawn flex flex-col align-middle justify-evenly shadow-xl shadow-slate-black rounded-2xl ">
      <div className="flex flex-row justify-between align-middle px-6 mt-2">
        <p className="font-black text-lg mt-[3px]">SOURCE MEDIA</p>

        <div role="group">
          <button type="button" onClick={() => setPreviewMediaType("video")} className="px-4 py-2 text-md font-normal rounded-s-2xl border-2 border-gray-600 hover:bg-gray-500/40 hover:text-white/80 transition duration-500 shadow-md shadow-gray-600/30">
            <CiVideoOn />
          </button>
          <button type="button" onClick={() => setPreviewMediaType("audio")} className="px-4 py-2 text-md font-normal rounded-e-2xl border-2 border-s-0 border-gray-600 hover:bg-gray-500/40 hover:text-white/80 transition duration-500 shadow-md shadow-gray-600/30">
            <CiVolumeHigh />
          </button>
        </div>
      </div>

      <div className="h-[1px] rounded-xl w-[94%] bg-grey_accent/20 mt-1 mx-auto" />

      <div className="p-2 overflow-scroll grid grid-cols-2 gap-y-2 no-scrollbar h-[30vh]">
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

      <div className="h-[1px] rounded-xl w-[94%] bg-grey_accent/20 mx-auto" />

      <div className="relative  text-grey_accent flex flex-row justify-end align-middle group cursor-pointer px-4">
        <input
          type="file"
          accept={previewMediaType === "video" ? "video/*" : "audio/mpeg"}
          className="hidden"
          id="media-upload"
          onChange={handleFileUpload}
        />

        <label className="flex flex-row justify-center align-middle cursor-pointer" htmlFor="media-upload">
          <p className="font-bold text-sm mt-[1px] group-hover:text-white/60 transition duration-300">UPLOAD FILES</p>
          <CiSaveUp1 className="h-full w-6 ml-2 group-hover:fill-white/60 transition duration-300" />
        </label>
      </div>

      {/* <div className="flex justify-between mt-4">
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
      </div> */}
    </div>
  );
}
