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
    <div className="w-1/2">
      <div className="flex justify-between">
        <div className="flex justify-start mb-4 space-x-4">
          <button
            className="bg-grey text-white p-2 rounded-sm text-xs lg:text-sm"
            onClick={() => setPreviewMediaType("video")}
          >
            Videos
          </button>
          <button
            className="bg-grey text-white p-2 rounded-sm text-xs lg:text-sm"
            onClick={() => setPreviewMediaType("audio")}
          >
            Audio
          </button>
        </div>

        <button className="flex justify-end">
          <input
            type="file"
            accept={previewMediaType === "video" ? "video/*" : "audio/mpeg"}
            className="hidden"
            id="media-upload"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="media-upload"
            className="text-white p-2 bg-grey cursor-pointer rounded-sm text-xs lg:text-sm"
          >
            Add files
          </label>
        </button>
      </div>

      <div className="overflow-y-auto pt-2 grid grid-cols-5 gap-x-1 gap-y-6">
        {previewMediaType == "video"
          ? uploadedVideoFiles.map((file) => (
              <div>
                <VideoCard
                  key={file.id}
                  file={file}
                  uploadedVideoFiles={uploadedVideoFiles}
                  setUploadedVideoFiles={setUploadedVideoFiles}
                  setVideoSrc={setVideoSrc}
                  addClip={addClip}
                />
              </div>
            ))
          : uploadedAudioFiles.map((file) => (
              <div>
                <AudioCard
                  key={file.id}
                  file={file}
                  uploadedAudioFiles={uploadedAudioFiles}
                  setUploadedAudioFiles={setUploadedAudioFiles}
                  setAudioSrc={setAudioSrc}
                  addClip={addClip}
                />
              </div>
            ))}
      </div>
    </div>
  );
}
