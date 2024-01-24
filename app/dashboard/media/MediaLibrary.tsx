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
  videoClips,
  setVideoClips,
  setAudioClips,
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
  audioClips: Array<Clip>;
  setAudioClips: Dispatch<SetStateAction<Array<Clip>>>;
  videoClips: Array<Clip>;
  setVideoClips: Dispatch<SetStateAction<Array<Clip>>>;
}) {
  return (
    <div className="w-1/2">
      <div className="flex justify-start ml-12 mb-4 space-x-4">
        <button
          className="bg-orange text-white p-3 rounded-md"
          onClick={() => setPreviewMediaType("video")}
        >
          Videos
        </button>
        <button
          className="bg-orange text-white p-3 rounded-md"
          onClick={() => setPreviewMediaType("audio")}
        >
          Audio
        </button>
      </div>

      <div className="h-96 overflow-y-auto mx-12 border-2 border-gray-400 pt-2">
        {previewMediaType == "video"
          ? uploadedVideoFiles.map((file) => (
              <VideoCard
                key={file.id}
                file={file}
                uploadedVideoFiles={uploadedVideoFiles}
                setUploadedVideoFiles={setUploadedVideoFiles}
                setVideoSrc={setVideoSrc}
                addClip={addClip}
                videoClips={videoClips}
                setVideoClips={setVideoClips}
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
                setAudioClips={setAudioClips}
              />
            ))}
      </div>

      <button className="my-6 w-full flex justify-end pr-16">
        <input
          type="file"
          accept={previewMediaType === "video" ? "video/*" : "audio/mpeg"}
          className="hidden"
          id="media-upload"
          onChange={handleFileUpload}
        />
        <label
          htmlFor="media-upload"
          className="text-white p-3 bg-orange underline underline-offset-4 cursor-pointer rounded-md"
        >
          Add files
        </label>
      </button>
    </div>
  );
}
