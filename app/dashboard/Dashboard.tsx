"use client";

import { useState, useEffect, useRef } from "react";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import Timeline from "./timeline/Timeline";

import MediaLibrary from "./media/MediaLibrary";
import VideoDisplay from "./media/VideoDisplay";
import AudioDisplay from "./media/AudioDisplay";

import { MediaFile, MediaList, MediaType } from "./types";
import { fetchMedia, uploadToFirebase } from "./lib";
import axios from "axios";
import trim_handler from "@/components/formula/trim_algorithm";
import LoadingScreen from "../../components/LoadingScreen";
import Details from "./media/Details";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const [addingToTimelineLoading, setAddingToTimelineLoading] = useState(false);
  const [compileLoading, setCompileLoading] = useState(false);

  const [videoSrc, setVideoSrc] = useState<string>("");
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [uploadedVideoFiles, setUploadedVideoFiles] = useState<MediaList>([]);
  const [uploadedAudioFiles, setUploadedAudioFiles] = useState<MediaList>([]);
  const [clipList, setClipList] = useState<MediaList>([]);
  const [audioClip, setAudioClip] = useState<MediaFile>();
  const [previewMediaType, setPreviewMediaType] = useState<string>("video");
  const [previewTimestamp, setPreviewTimestamp] = useState<number>(0);

  const [selectedClip, setSelectedClip] = useState<MediaFile>({
    display_name: "Sample Video",
    id: "video123",
    url: "https://example.com/sample-video.mp4",
    type: 0,
    duration: "00:03:30",
    startDelta: 5,
    endDelta: 10,
    flex: true,
    markers: [10, 20, 30, 40],
  });

  const router = useRouter();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;

    const file = e.target.files[0];

    if (previewMediaType === "audio" && file.type.startsWith("audio/")) {
      const audioURL = URL.createObjectURL(file);

      setAudioSrc(audioURL);
      uploadToFirebase(
        file,
        "audio",
        setUploadedVideoFiles,
        setUploadedAudioFiles
      );
    } else if (previewMediaType === "video") {
      const videoURL = URL.createObjectURL(file);

      setVideoSrc(videoURL);
      uploadToFirebase(
        file,
        "video",
        setUploadedVideoFiles,
        setUploadedAudioFiles
      );
    }
  };

  const processClips = async () => {
    setCompileLoading(true);

    let timeStamp = Date.now();
    let jwt = (await auth.currentUser?.getIdToken()) || "";

    if (!audioClip) return;
    let newList = trim_handler(clipList, audioClip);

    try {
      await axios.post(
        "/api/merge",
        { list: newList, time: timeStamp },
        {
          headers: {
            Authorization: jwt,
          },
        }
      );
      // Handle response here if needed
    } catch (error) {
      toast.error("An error occured while compiling. Please try again.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }

    setClipList(newList);
    setPreviewMediaType("video");
    setVideoSrc(`/api/video/output-${timeStamp}.mp4?token=${jwt}`);

    setCompileLoading(false);
  };

  const addClip = async (clip: MediaFile) => {
    setAddingToTimelineLoading(true);

    let jwt = (await auth.currentUser?.getIdToken()) || "";

    try {
      await axios.post(
        "/api/download",
        { file_obj: clip },
        {
          headers: {
            Authorization: jwt,
          },
        }
      );
    } catch (error) {
      toast.error(
        "An error occured while adding the clips. Please try again.",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    }

    if (clip.type == MediaType.Video) {
      setClipList([...clipList, clip]);
    } else {
      setAudioClip(clip);
    }

    setAddingToTimelineLoading(false);
  };

  useEffect(() => {
    const authorizationLogic = async () => {
      await auth.authStateReady();

      if (auth.currentUser === null) {
        router.push("/signin");
      }
    };

    authorizationLogic();
    fetchMedia(setUploadedVideoFiles, setUploadedAudioFiles);
  }, []);

  if (addingToTimelineLoading) {
    return <LoadingScreen subtitle="Adding to timeline ..." />;
  }

  if (compileLoading) {
    return <LoadingScreen subtitle="Compiling audio and video ..." />;
  }

  return (
    <>
      <div
        className="h-screen w-screen bg-midnight overflow-hidden font-['Proxima Nova']
    flex flex-row justify-evenly align-middle"
      >
        <div className="w-[67%] h-[92vh] flex flex-col align-middle justify-between my-auto">
          {previewMediaType == "video" ? (
            <VideoDisplay
              clipList={uploadedVideoFiles}
              videoSrc={videoSrc}
              timestamp={previewTimestamp}
            />
          ) : (
            <AudioDisplay audioSrc={audioSrc} timestamp={previewTimestamp} />
          )}

          <Timeline
            clipList={clipList}
            audioClip={audioClip}
            setClipList={setClipList}
            setAudioClip={setAudioClip}
            processClips={processClips}
            setPreviewTimestamp={setPreviewTimestamp}
            setPreviewMediaType={setPreviewMediaType}
            setVideoSrc={setVideoSrc}
            setAudioSrc={setAudioSrc}
          />
        </div>

        <div className="w-[26%] h-[92vh] flex flex-col align-middle justify-between my-auto">
          <MediaLibrary
            previewMediaType={previewMediaType}
            setPreviewMediaType={setPreviewMediaType}
            uploadedVideoFiles={uploadedVideoFiles}
            uploadedAudioFiles={uploadedAudioFiles}
            handleFileUpload={handleFileUpload}
            setUploadedVideoFiles={setUploadedVideoFiles}
            setUploadedAudioFiles={setUploadedAudioFiles}
            setVideoSrc={setVideoSrc}
            setAudioSrc={setAudioSrc}
            addClip={addClip}
            selectedClip={selectedClip}
            setSelectedClip={setSelectedClip}
          />

          <div className="h-[40vh] bg-dawn p-3 rounded-2xl overflow-scroll gap-y-4 no-scrollbar shadow-xl shadow-slate-black">
            {/* <Details
            id={selectedClip.id}
            name={selectedClip.display_name}
            duration={selectedClip.duration}
            type={selectedClip.type == 0 ? "Audio" : "Video"}
          /> */}
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}
