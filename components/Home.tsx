"use client";

import { useEffect, useRef, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import trim_handler from "./formula/trim_start_2sec";
import untrim_handler from "./formula/untrim_start_2sec";
import VideoListWrapper from "./lib/VideoListWrapper";

type VideoList = Array<{
  name: string;
  id: string;
  duration: string;
  startDelta: number;
  endDelta: number;
}>;

const loadVideo = (file: File): Promise<HTMLVideoElement> =>
  new Promise((resolve, reject) => {
    try {
      let video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = function () {
        resolve(video);
      };

      video.onerror = function () {
        reject("Invalid video. Please select a video file.");
      };

      video.src = window.URL.createObjectURL(file);
    } catch (e) {
      reject(e);
    }
  });

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  let videoList = useRef<VideoList>([]);
  const [, setForceRender] = useState<number>();
  const [progress, setProgress] = useState<number>(0);

  const uploadHandler = async (e: DragEvent): Promise<void> => {
    e.stopImmediatePropagation();
    e.preventDefault();

    if (!e.dataTransfer?.files) return;

    let newFiles = [];
    for (let i = 0; i < e.dataTransfer?.files.length; i++) {
      const uniqueID = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const tmpFile = e.dataTransfer?.files[i];
      const video = await loadVideo(tmpFile);

      let obj = {
        name: tmpFile.name,
        duration: video.duration.toFixed(2),
        id: uniqueID,
        startDelta: 0,
        endDelta: 0,
      };

      videoList.current.push(obj);
      newFiles.push(obj);

      let formData = new FormData();
      formData.append(
        "media",
        new File([tmpFile], uniqueID, { type: tmpFile.type })
      );

      const options: AxiosRequestConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: any) => {
          const { loaded, total } = progressEvent;
          const percentage = (loaded * 100) / total;
          // setProgress(+percentage.toFixed(2));
        },
      };

      await axios.post("/api/upload", formData, options);
    }

    if (videoRef.current) {
      const mergeList: VideoList =
        videoRef.current.src.indexOf(".mp4") !== -1
          ? [
              {
                name: "",
                duration: videoRef.current.duration.toString(),
                id:
                  "output-" +
                  videoRef.current.src.split("/output-")[1].slice(0, -4),
                startDelta: 0,
                endDelta: 0,
              },
              ...newFiles,
            ]
          : videoList.current;

      let timeStamp = Date.now();
      await axios.post("/api/merge", { list: mergeList, time: timeStamp });
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = `/api/video/output-${timeStamp}.mp4`;
      }
    }

    setForceRender(videoList.current.length);
  };

  const trimHandler = async (): Promise<void> => {
    const videoListObj = new VideoListWrapper(videoList.current);

    trim_handler(videoListObj);

    videoList.current = videoListObj.get();

    let timeStamp = Date.now();
    await axios.post("/api/merge", {
      list: videoList.current,
      time: timeStamp,
    });
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = `/api/video/output-${timeStamp}.mp4`;
    }

    setForceRender(videoList.current.length);
  };

  const UntrimHandler = async (): Promise<void> => {
    const videoListObj = new VideoListWrapper(videoList.current);

    untrim_handler(videoListObj);

    videoList.current = videoListObj.get();

    let timeStamp = Date.now();
    await axios.post("/api/merge", {
      list: videoList.current,
      time: timeStamp,
    });
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = `/api/video/output-${timeStamp}.mp4`;
    }

    setForceRender(videoList.current.length);
  };

  useEffect(() => {
    document.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    document.addEventListener("drop", uploadHandler);
  }, []);

  return (
    <div className="flex flex-col items-center justify-around h-[100vh]">
      <div
        style={{
          width: "768px",
          height: "432px",
        }}
      >
        <video
          src=""
          className="w-[100%] h-[100%] object-cover"
          controls
          autoPlay={true}
          ref={videoRef}
        />
      </div>

      <button
        className="px-4 py-2 border-red-400 border-2 rounded"
        onClick={trimHandler}
      >
        Trim
      </button>
      <button
        className="px-4 py-2 border-red-400 border-2 rounded"
        onClick={UntrimHandler}
      >
        UnTrim
      </button>

      <div className="text-sm">
        {videoList.current.map((f, i) => {
          return <p key={i}>{f.name}</p>;
        })}
      </div>
    </div>
  );
}
