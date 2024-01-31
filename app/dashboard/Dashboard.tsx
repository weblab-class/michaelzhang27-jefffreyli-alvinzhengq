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

import { CiExport, CiHome, CiRead, CiCircleInfo } from "react-icons/ci";
import { IoExitOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion"
import { signOut } from "firebase/auth";

export default function Dashboard() {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Loading Dashboard...");

  const [videoSrc, setVideoSrc] = useState<string>("");
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [uploadedVideoFiles, setUploadedVideoFiles] = useState<MediaList>([]);
  const [uploadedAudioFiles, setUploadedAudioFiles] = useState<MediaList>([]);

  const [clipList, setClipList] = useState<MediaList>([]);
  const [audioClip, setAudioClip] = useState<MediaFile>();
  const [compiledURL, setCompiledURL] = useState<string>("");
  const [previewMediaType, setPreviewMediaType] = useState<string>("video");
  const [previewTimestamp, setPreviewTimestamp] = useState<number>(0);

  const [selectedClip, setSelectedClip] = useState<MediaFile>({
    display_name: "Sample Video",
    id: "sample",
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

  const processClips = async (preview: boolean) => {
    if (preview) {
      setLoadingMessage("Compiling Video Project...")
    } else {
      setLoadingMessage(`Compiling and Exporting Video Project. Can take up to 10 minutes depending on length of video...`)
    }
    setLoading(true);

    let timeStamp = Date.now();
    let jwt = (await auth.currentUser?.getIdToken()) || "";

    if (!audioClip) {
      toast.error("Cannot compile video without an audio track.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setLoading(false);
      return;
    }

    let totalDuration = 0;
    for (let i = 0; i < clipList.length; i++) {
      totalDuration += parseFloat(clipList[i].duration) - clipList[i].startDelta - clipList[i].endDelta;
    }

    if (totalDuration <= 0) {
      toast.error("Cannot compile a video of zero total length.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setLoading(false);
      return;
    }

    let newList = trim_handler(clipList, audioClip);

    try {
      await axios.post(
        "/api/" + (preview ? "merge" : "export"),
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
        hideProgressBar: false,
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
    setCompiledURL(`/api/video/output-${timeStamp}.mp4?token=${jwt}`);

    setLoading(false);

    if (!preview) window.open(`/${auth.currentUser?.uid}/output-${timeStamp}.mp4`);
  };

  const addClip = async (clip: MediaFile) => {
    if (clipList.filter((item) => item.id === clip.id).length > 0) {
      toast.error("Clip already exists on timeline, cannot have duplicate video clips on timeline.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    if (clip.type === 0 && audioClip) {
      toast.error("Audio already exists on timeline, only one audio file can be used at a time.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    setLoadingMessage("Downloading Asset onto Backend Service")
    setLoading(true);

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
          hideProgressBar: false,
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

    setLoading(false);
  };

  useEffect(() => {
    if (clipList.filter((item) => item.url === videoSrc).length <= 0) return;

    setSelectedClip(clipList.filter((item) => item.url === videoSrc)[0]);
  }, [videoSrc])

  useEffect(() => {
    const authorizationLogic = async () => {
      await auth.authStateReady();

      if (auth.currentUser === null) {
        router.push("/signin");
      }
    };

    authorizationLogic();
    fetchMedia(setUploadedVideoFiles, setUploadedAudioFiles);

    (document.getElementById("info_modal") as HTMLDialogElement)?.showModal();
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed mx-auto top-0 left-0 z-[51] h-full w-full bg-midnight flex justify-center items-center"
            style={{ backdropFilter: 'blur(11px)' }}
            initial={{ filter: 'opacity(0)' }}
            animate={{ filter: 'opacity(0.95)' }}
            exit={{ filter: 'opacity(0)' }}
            transition={{ duration: 0.6 }}
          >
            <LoadingScreen subtitle={loadingMessage} />
          </motion.div>
        )}
      </AnimatePresence>

      <dialog id="info_modal" className="modal">
        <div className="modal-box bg-midnight min-w-[39vw]">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Welcome to Visage, the AI Powered Editor!</h3>
          <p className="py-4 text-sm">Visage is a simplified web editor, meant to streamline the process of assembling, editing and syncing of a collage of clips with music.</p>
          <p className="py-3 text-sm">Get started by importing <code>.mp4</code> and <code>.mp3</code> files in the <b>Source Media</b> section. Once a file has been fully uploaded
          it will appear within the Source Media browser, where you can then add it onto the current project timeline.</p>
          <p className="py-3 text-sm">The Timeline has two toggleable modes, <i>Marker Mode</i> and <i>Timeline Mode</i>. Timeline Mode is the traditional
          editor experience, where you can reorder clips with the arrow keys,
          inspect each clip with a click, and delete clips by hitting <code>Backspace</code>.</p>
          <p className="py-3 text-sm">While you can choose to manually trim each clip within the <b>Details</b> section by adjusting the start and end trim,
          with the power of <i>Marker Mode</i>, this can be automated.</p>
          <p className="py-3 text-sm">Toggle into <i>Marker Mode</i>, and place down markers onto your video and song with
          a click, and right click to delete. Place video markers onto moments you wish to higlight, and audio markers onto memorable points in the music
          you wish to sync your video to.</p>
          <p className="py-3 text-sm">Lastly, simply click the <i>Compile Video Preview</i> icon below the two modes, to automatically trim and generate
          your edited video! It's that simple.</p>
          <p className="py-4 text-sm font-thin text-white/40">Find these instructions again with the Info icon on the right of the video panel.</p>
        </div>
      </dialog>

      <div
        className="h-screen w-screen bg-midnight overflow-hidden font-['Proxima Nova']
    flex flex-row justify-evenly align-middle"
      >
        <div className="w-[67%] h-[92vh] flex flex-col align-middle justify-between my-auto">
          <div className="flex flex-row align-middle justify-between">
            <div className="w-[8%] h-[62.8vh] rounded-2xl bg-dawn flex flex-col justify-around align-middle shadow-2xl shadow-slate-black">
              <div onClick={() => router.push("/")} data-tip="Return to Home" className="tooltip tooltip-right tooltip-accent rounded-xl w-16 h-16 mx-auto flex flex-col justify-center group hover:bg-twilight transition duration-300 cursor-pointer">
                <CiHome className="mx-auto w-6 h-6 fill-gray-400 group-hover:fill-primary transition duration-300" />
              </div>

              <div onClick={() => {
                if (compiledURL.length <= 0) {
                  toast.error(
                    "No preview found, please compile a preview first.",
                    {
                      position: "bottom-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "colored",
                    }
                  );

                  return;
                }

                setPreviewMediaType("video");
                setVideoSrc(compiledURL);
              }} data-tip="Show Current Compiled Preview" className="tooltip tooltip-right tooltip-accent rounded-xl w-16 h-16 mx-auto flex flex-col justify-center group hover:bg-twilight transition duration-300 cursor-pointer">
                <CiRead className="mx-auto w-6 h-6 fill-gray-400 group-hover:fill-primary transition duration-300" />
              </div>

              <div onClick={() => processClips(false)} data-tip="Export Video" className="tooltip tooltip-right tooltip-accent rounded-xl w-16 h-16 mx-auto flex flex-col justify-center group hover:bg-twilight transition duration-300 cursor-pointer">
                <CiExport className="mx-auto w-6 h-6 fill-gray-400 group-hover:fill-primary transition duration-300" />
              </div>

              <div onClick={() => {
                signOut(auth);
                router.push("/signin");
              }} data-tip="Sign Out" className="tooltip tooltip-right tooltip-accent rounded-xl w-16 h-16 mx-auto flex flex-col justify-center group hover:bg-twilight transition duration-300 cursor-pointer">
                <IoExitOutline className="mx-auto w-6 h-6 text-gray-400 group-hover:text-primary transition duration-300" />
              </div>

              <div onClick={() => {
                (document.getElementById("info_modal") as HTMLDialogElement)?.showModal();
              }} data-tip="Instruction Message" className="tooltip tooltip-right tooltip-accent rounded-xl w-16 h-16 mx-auto flex flex-col justify-center group hover:bg-twilight transition duration-300 cursor-pointer">
                <CiCircleInfo className="mx-auto w-6 h-6 text-gray-400 group-hover:text-primary transition duration-300" />
              </div>
            </div>

            <div className="w-[88.5%]">
              {previewMediaType == "video" ? (
                <VideoDisplay
                  clipList={uploadedVideoFiles}
                  videoSrc={videoSrc}
                  timestamp={previewTimestamp}
                />
              ) : (
                <AudioDisplay audioSrc={audioSrc} timestamp={previewTimestamp} />
              )}
            </div>
          </div>

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
            selectedClip={selectedClip}
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
            {
              clipList.filter((item) => item.url === videoSrc).length <= 0 ?
                <div className="flex flex-col justify-center align-middle w-full h-full mx-auto">
                  <h1 className="mx-auto text-grey_accent/50 font-semibold">Select a Video Clip From the Timeline</h1>
                </div>
                :
                <Details clipList={clipList} selectedClip={selectedClip} setClipList={setClipList} setSelectedClip={setSelectedClip} />
            }
          </div>
        </div>
      </div>

      <ToastContainer className="font-['Proxima Nova'] font-thin" />
    </>
  );
}
