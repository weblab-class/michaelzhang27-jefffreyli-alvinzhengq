import {
    ref,
    getDownloadURL,
    getStorage,
    listAll,
    uploadBytesResumable,
} from "firebase/storage";
import { auth, storage } from "@/firebase/config";
import { MediaList, MediaType } from "./types";
import { Dispatch, SetStateAction } from "react";

const loadVideo = (url: string): Promise<HTMLVideoElement> =>
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

            video.src = url;
        } catch (e) {
            reject(e);
        }
    });

const loadAudio = (url: string): Promise<HTMLAudioElement> =>
    new Promise((resolve, reject) => {
        try {
            let audio = document.createElement("audio");
            audio.preload = "metadata";

            audio.onloadedmetadata = function () {
                resolve(audio);
            };

            audio.onerror = function () {
                reject("Invalid video. Please select a video file.");
            };

            audio.src = url;
        } catch (e) {
            reject(e);
        }
    });

function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const fetchMedia = async (
    setUploadedVideoFiles: Dispatch<SetStateAction<MediaList>>,
    setUploadedAudioFiles: Dispatch<SetStateAction<MediaList>>
) => {

    await auth.authStateReady();
    if (auth.currentUser === null) return;

    let currentUserEmail = auth.currentUser.email;

    const storage = getStorage();
    const videosRef = ref(storage, `${currentUserEmail}/video`);
    const audiosRef = ref(storage, `${currentUserEmail}/audio`);

    try {
        const vResult = await listAll(videosRef);
        const videoObjects = await Promise.all(
            vResult.items.filter(itemRef => !itemRef.name.includes(".png")).map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                const uniqueID = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                const video = await loadVideo(url);

                return {
                    display_name: itemRef.name,
                    id: uniqueID,
                    url: url,
                    type: MediaType.Video,
                    duration: video.duration.toFixed(2),
                    startDelta: 0,
                    endDelta: 0,
                    flex: false,
                    markers: []
                };
            })
        );

        const aResult = await listAll(audiosRef);
        const audioObjects = await Promise.all(
            aResult.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                const uniqueID = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                const audio = await loadAudio(url);

                return {
                    display_name: itemRef.name,
                    id: uniqueID,
                    url: url,
                    type: MediaType.Audio,
                    duration: audio.duration.toFixed(2),
                    startDelta: 0,
                    endDelta: 0,
                    flex: false,
                    markers: []
                };
            })
        );

        setUploadedAudioFiles(audioObjects);
        setUploadedVideoFiles(videoObjects);
    } catch (error) {
        console.error("Error fetching media: ", error);
    }

};

export const uploadToFirebase = (
    file: File, mediaType: string,
    setUploadedVideoFiles: Dispatch<SetStateAction<MediaList>>,
    setUploadedAudioFiles: Dispatch<SetStateAction<MediaList>>,
) => {

    if (!file || auth.currentUser === null) return;

    let currentUserEmail = auth.currentUser.email;
    let itemRef = ref(
        storage,
        `${currentUserEmail}/${mediaType}/${file.name}`
    );
    let uploadTask = uploadBytesResumable(itemRef, file);

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
        async () => {
            const url = await getDownloadURL(itemRef);
            const uniqueID = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

            if (mediaType === "video") {
                const video = await loadVideo(url);

                setUploadedVideoFiles((prevFiles) => [
                    ...prevFiles,
                    {
                        display_name: file.name,
                        id: uniqueID,
                        url: url,
                        type: MediaType.Video,
                        duration: video.duration.toFixed(2),
                        startDelta: 0,
                        endDelta: 0,
                        flex: false,
                        markers: []
                    }
                ]);
            } else if (mediaType === "audio") {
                const audio = await loadAudio(url);

                setUploadedAudioFiles((prevFiles) => [
                    ...prevFiles,
                    {
                        display_name: file.name,
                        id: uniqueID,
                        url: url,
                        type: MediaType.Audio,
                        duration: audio.duration.toFixed(2),
                        startDelta: 0,
                        endDelta: 0,
                        flex: false,
                        markers: []
                    }
                ]);
            }
        }
    );
};