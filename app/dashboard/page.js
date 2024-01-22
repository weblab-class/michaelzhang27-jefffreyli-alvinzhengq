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
import { useRouter } from "next/navigation";

import MediaLibrary from "./MediaLibrary";
import VideoDisplay from "./VideoDisplay";
import AudioDisplay from "./AudioDisplay";

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
      const videosRef = ref(storage, `${currentUserEmail}/video`);
      const audiosRef = ref(storage, `${currentUserEmail}/audio`);

      try {
        const vResult = await listAll(videosRef);
        const videoObjects = await Promise.all(
          vResult.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return {
              name: itemRef.name,
              url: url,
            };
          })
        );

        const aResult = await listAll(audiosRef);
        const audioObjects = await Promise.all(
          aResult.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return {
              name: itemRef.name,
              url: url,
            };
          })
        );

        setUploadedAudioFiles(audioObjects);
        setUploadedVideoFiles(videoObjects);
      } catch (error) {
        console.error("Error fetching media: ", error);
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
      <MediaLibrary
        selectedMediaType={selectedMediaType}
        setSelectedMediaType={setSelectedMediaType}
        uploadedVideoFiles={uploadedVideoFiles}
        uploadedAudioFiles={uploadedAudioFiles}
        handleFileChange={handleFileChange}
        setUploadedVideoFiles={setUploadedVideoFiles}
        setVideoSrc={setVideoSrc}
      />
      <div className="border-[0.9px] border-gray-300"></div>
      {selectedMediaType == "video" ? (
        <VideoDisplay videoSrc={videoSrc} />
      ) : (
        <AudioDisplay audioSrc={audioSrc} />
      )}
    </div>
  );
};

export default dashboard;
