"use client";

import { useState, useEffect } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
  listAll,
} from "firebase/storage";
import { app, auth, storage } from "@/firebase/config";
import Image from "next/image";
import { useRouter } from "next/navigation";

const dashboard = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoSrc, setVideoSrc] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [audioSrc, setAudioSrc] = useState("");
  const [uploadedVideoFiles, setUploadedVideoFiles] = useState([]);
  const [uploadedAudioFiles, setUploadedAudioFiles] = useState([]);
  const [selectedMediaType, setSelectedMediaType] = useState("video");

  const router = useRouter();

  //proected route
  useEffect(() => {
    const authorizationLogic = async () => {
      await auth.authStateReady();

      if (auth.currentUser === null) {
        router.push("/signin");
      }
    };

    authorizationLogic();
  }, []);

  useEffect(() => {
    const fetchMedia = async () => {
      await auth.authStateReady();
      let currentUserEmail = auth.currentUser.email;
      const storage = getStorage();
      const videosRef = ref(
        storage,
        `${currentUserEmail}/${selectedMediaType}`
      );
      const audiosRef = ref(
        storage,
        `${currentUserEmail}/${selectedMediaType}`
      );

      try {
        const result = await listAll(videosRef);
        const videoObjects = await Promise.all(
          result.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return {
              name: itemRef.name,
              url: url,
            };
          })
        );

        const audioObjects = await Promise.all(
          result.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return {
              name: itemRef.name,
              url: url,
            };
          })
        );

        setUploadedVideoFiles(videoObjects);
        console.log(videoObjects);
      } catch (error) {
        console.error("Error fetching videos: ", error);
      }
    };

    fetchMedia();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (selectedMediaType === "audio" && file.type.startsWith("audio/")) {
        const audioURL = URL.createObjectURL(file);
        setAudioSrc(audioURL);
        setAudioFile(file);
        uploadToFirebase(file, "audio");
      } else if (selectedMediaType === "video") {
        const videoURL = URL.createObjectURL(file);
        setVideoSrc(videoURL);
        setVideoFile(file);
        uploadToFirebase(file, "video");
      }
    }
  };

  const uploadToFirebase = (file, mediaType) => {
    if (!file) {
      return;
    }

    let currentUserEmail = auth.currentUser.email;
    let storageRef = ref(
      storage,
      `${currentUserEmail}/${mediaType}/${file.name}`
    );
    let uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error(error);
      },
      () => {
        if (mediaType === "video") {
          setUploadedVideoFiles((prevFiles) => [
            ...prevFiles,
            {
              name: file.name,
            },
          ]);
        } else if (mediaType === "audio") {
          setUploadedAudioFiles((prevFiles) => [
            ...prevFiles,
            {
              name: file.name,
            },
          ]);
        }
      }
    );
  };

  return (
    <div className="py-16 rounded-lg text-center flex">
      <MediaLibrary />
      <div className="border-[0.9px] border-gray-300"></div>
      {selectedMediaType == "video" ? <VideoDisplay /> : <AudioDisplay />}
    </div>
  );

  function MediaLibrary() {
    return (
      <div className="w-1/2">
        <div className="flex justify-start ml-16 mb-4 space-x-4">
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

        <div className="h-96 mx-16 border-2 border-dashed border-gray-400">
          {selectedMediaType == "video"
            ? uploadedVideoFiles.map((file) => (
                <div
                  key={file.name}
                  className="m-3 p-3 border-gray-300 border-[1px] h-20 flex items-center space-x-4"
                >
                  <video
                    className="rounded-md h-16 w-auto"
                    src={file.url}
                    type="video/mp4"
                  >
                    Your browser does not support the video tag.
                  </video>
                  <p className="text-gray-700 text-xs">{file.name}</p>
                </div>
              ))
            : uploadedAudioFiles.map((file) => (
                <AudioCard key={file.name} name={file.name} />
              ))}
        </div>

        <button className="my-6 w-full flex justify-end pr-20">
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

  function VideoDisplay() {
    return (
      <div className="w-1/2 mt-16">
        {videoSrc ? (
          <video
            className="rounded-md h-96 mx-16"
            controls
            src={videoSrc}
            type="video/mp4"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="rounded-md bg-black h-96 w-auto mx-16"></div>
        )}
      </div>
    );
  }

  function AudioDisplay() {
    return (
      <div className="w-1/2">
        <audio className="rounded-md h-4/5 w-3/4 mx-16" controls>
          <source src={audioSrc} type="audio/mp3" />
          Your browser does not support the audio tag.
        </audio>
      </div>
    );
  }

  function AudioCard({ name }) {
    return (
      <div
        key={name}
        className="m-3 p-3 border-gray-300 border-[1px] h-20 flex items-center space-x-4"
      >
        <Image
          className="rounded-md h-16 w-auto"
          src={"/audio-image.png"}
          width={50}
          height={50}
          alt={"audio image"}
        ></Image>
        <p className="text-gray-700 text-xs">{name}</p>
      </div>
    );
  }
};

export default dashboard;
