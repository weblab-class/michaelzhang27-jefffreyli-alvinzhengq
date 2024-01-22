import AudioCard from "./AudioCard";
import VideoCard from "./VideoCard";

export default function MediaLibrary({
  selectedMediaType,
  setSelectedMediaType,
  uploadedVideoFiles,
  setUploadedVideoFiles,
  uploadedAudioFiles,
  setUploadedAudioFiles,
  handleFileChange,
  setVideoSrc
}) {
  return (
    <div className="w-1/2">
      <div className="flex justify-start ml-12 mb-4 space-x-4">
        <button
          className="bg-blue-600 text-white p-3"
          onClick={() => setSelectedMediaType("video")}
        >
          Videos
        </button>
        <button
          className="bg-blue-600 text-white p-3"
          onClick={() => setSelectedMediaType("audio")}
        >
          Audio
        </button>
      </div>

      <div className="h-96 overflow-y-auto mx-12 border-2 border-gray-400 pt-2">
        {selectedMediaType == "video"
          ? uploadedVideoFiles.map((file) => (
              <VideoCard
                key={file.name}
                file={file}
                uploadedVideoFiles={uploadedVideoFiles}
                setUploadedVideoFiles={setUploadedVideoFiles}
                setVideoSrc={setVideoSrc}
              />
            ))
          : uploadedAudioFiles.map((file) => (
              <AudioCard key={file.name} file={file} />
            ))}
      </div>

      <button className="my-6 w-full flex justify-end pr-16">
        <input
          type="file"
          accept={selectedMediaType === "video" ? "video/*" : "audio/mpeg"}
          className="hidden"
          id="media-upload"
          onChange={handleFileChange}
        />
        <label
          htmlFor="media-upload"
          className="text-white p-4 bg-blue-600 underline underline-offset-4 cursor-pointer"
        >
          Add files
        </label>
      </button>
    </div>
  );
}
