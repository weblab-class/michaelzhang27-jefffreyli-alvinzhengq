
import type { FFmpeg } from '@ffmpeg/ffmpeg'
import { useRef, type MutableRefObject } from 'react'
import { fetchFile } from '@ffmpeg/util'

export default function TranscodeTester({ ffmpegRef, messageRef }:
	{ ffmpegRef: MutableRefObject<FFmpeg>, messageRef: MutableRefObject<HTMLParagraphElement | null> }) {

	const videoRef = useRef<HTMLVideoElement | null>(null)

	const transcode = async () => {
		const ffmpeg = ffmpegRef.current;
		await ffmpeg.writeFile('input.avi', await fetchFile('/video-15s.avi'))
		await ffmpeg.exec(['-i', 'input.avi', 'output.mp4'])
		const data = (await ffmpeg.readFile('output.mp4')) as any
		if (videoRef.current)
			videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))
	}

	return (
		<div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
			<video ref={videoRef} controls></video>
			<br />
			<button
				onClick={transcode}
				className="bg-green-500 hover:bg-green-700 text-white py-3 px-6 rounded"
			>
				Transcode avi to mp4
			</button>
			<p ref={messageRef}></p>
		</div>
	)
}