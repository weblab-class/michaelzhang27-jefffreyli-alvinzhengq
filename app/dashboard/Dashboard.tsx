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
import { signOut } from "firebase/auth";
import axios from "axios";

export default function Dashboard() {
    const [videoSrc, setVideoSrc] = useState<string>("");
    const [audioSrc, setAudioSrc] = useState<string>("");

    const [uploadedVideoFiles, setUploadedVideoFiles] = useState<MediaList>([]);
    const [uploadedAudioFiles, setUploadedAudioFiles] = useState<MediaList>([]);
    const [previewMediaType, setPreviewMediaType] = useState("video");

    const [clipList, setClipList] = useState<MediaList>([]);

    const router = useRouter();

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files === null) return;

        const file = e.target.files[0];

        if (previewMediaType === "audio" && file.type.startsWith("audio/")) {
            const audioURL = URL.createObjectURL(file);

            setAudioSrc(audioURL);
            uploadToFirebase(file, "audio", setUploadedVideoFiles, setUploadedAudioFiles);
        } else if (previewMediaType === "video") {
            const videoURL = URL.createObjectURL(file);

            setVideoSrc(videoURL);
            uploadToFirebase(file, "video", setUploadedVideoFiles, setUploadedAudioFiles);
        }
    };

    const processClips = async () => {
        let timeStamp = Date.now();
        await axios.post("/api/merge", { list: clipList, time: timeStamp });

        setPreviewMediaType("video");
        setVideoSrc(`/api/video/output-${timeStamp}.mp4`);
    }

    const addClip = async (clip: MediaFile) => {
        await axios.post("/api/download", { file_obj: clip });
        
        if (clip.type == MediaType.Video) {
            setClipList([...clipList, clip])
        }
    }

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

    useEffect(() => {
        if (clipList.length <= 0) return;

        processClips();
    }, [clipList])

    return (
        <div>
            <div className="flex justify-end py-4 px-8" >
                <button
                    onClick={
                        () => {
                            signOut(auth);
                            router.push("/signin");
                        }
                    }
                >
                    <p className="underline underline-offset-4 text-gray-700 hover:text-gray-800" >
                        Sign out
                    </p>
                </button>
            </div>

            < div className="py-10 rounded-lg text-center flex bg-background" >
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
                />
                <div className="border-[0.9px] border-gray-300" > </div>
                {
                    previewMediaType == "video" ? (
                        <VideoDisplay videoSrc={videoSrc} />
                    ) : (
                        <AudioDisplay audioSrc={audioSrc} />
                    )}
            </div>
            < div className="mx-4" >
                <Timeline />
            </div>
        </div>
    )
};
