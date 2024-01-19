
'use client'

import { useEffect, useRef, useState } from 'react'
import axios, { AxiosRequestConfig } from 'axios';

type VideoList = Array<{
    name: string,
    id: string,
    startTime: number,
    endTime: number
}>

export default function Home() {
    const videoRef = useRef<HTMLVideoElement | null>(null)

    let videoList = useRef<VideoList>([]);
    const [, setForceRender] = useState<number>();
    const [progress, setProgress] = useState<number>(0);

    const uploadHandler = async (e: DragEvent): Promise<void> => {
        e.stopImmediatePropagation()
        e.preventDefault();

        if (!e.dataTransfer?.files) return;

        let newFiles = []
        for (let i = 0; i < e.dataTransfer?.files.length; i++) {
            const uniqueID = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const tmpFile = e.dataTransfer?.files[i]

            let obj = {
                name: tmpFile.name,
                id: uniqueID,
                startTime: 0,
                endTime: 0
            }

            videoList.current.push(obj)
            newFiles.push(obj)

            let formData = new FormData();
            formData.append('media', new File([tmpFile], uniqueID, { type: tmpFile.type }));

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

            await axios.post("/api/upload", formData, options)
        }

        if (videoRef.current) {
            const mergeList: VideoList = videoRef.current.src.indexOf(".mp4") !== -1 ? [{
                name: "",
                id: "output-" + videoRef.current.src.split("/output-")[1].slice(0, -4),
                startTime: 0,
                endTime: -1
            }, ...newFiles] : videoList.current

            let timeStamp = Date.now();
            await axios.post("/api/merge", { list: mergeList, time: timeStamp })
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.src = `/api/video/output-${timeStamp}.mp4`
            }
        }

        setForceRender(videoList.current.length)
    }

    useEffect(() => {
        document.addEventListener('dragover', (e) => {
            e.preventDefault()
        });

        document.addEventListener('drop', uploadHandler);
    }, [])

    return (
        <div className='flex flex-col items-center justify-around h-[100vh]'>
            <div style={{
                width: '768px',
                height: '432px'
            }}>
                <video src="" className='w-[100%] h-[100%] object-cover' controls autoPlay={true} ref={videoRef} />
            </div>

            <button className='py-2 px-10 border-2 border-blue-400 rounded-lg' onClick={() => {
                if (videoRef.current) {
                    videoRef.current.play();
                    videoRef.current.pause();
                    videoRef.current.currentTime = 5;
                    videoRef.current.play();
                }
            }}>Skip to 5 Seconds</button>

            <div className='text-sm'>
                {
                    videoList.current.map((f, i) => {
                        return (<p key={i}>{f.name}</p>)
                    })
                }
            </div>
        </div>
    )
}