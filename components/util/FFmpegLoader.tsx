'use client'

import type { FFmpeg } from '@ffmpeg/ffmpeg'
import type { MutableRefObject } from 'react'
import { toBlobURL } from '@ffmpeg/util'

export default async function WasmLoader({ ffmpegRef, messageRef } : 
  { ffmpegRef: MutableRefObject<FFmpeg>, messageRef: MutableRefObject<HTMLParagraphElement | null> })  {

    const baseURL = '/ffmpeg-core'
    const ffmpeg = ffmpegRef.current

    ffmpeg.on('log', ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message
    })

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript")
    })

    return (<></>)
}