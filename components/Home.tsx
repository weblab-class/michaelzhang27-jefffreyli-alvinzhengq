'use client'

import { FFmpeg } from '@ffmpeg/ffmpeg'
import { useRef, Suspense } from 'react'
import WasmLoader from './util/FFmpegLoader'
import TranscodeTester from './lib/TranscodeTester'
import LoadingScreen from './lib/LoadingScreen'

export default function Home() {
  const ffmpegRef = useRef(new FFmpeg())
  const messageRef = useRef<HTMLParagraphElement | null>(null)

  return (
    <div>
      <Suspense fallback={(<LoadingScreen />)}>
        <WasmLoader {...{ ffmpegRef, messageRef }} />
        <TranscodeTester {...{ ffmpegRef, messageRef }} />
      </Suspense>
    </div>
  )
}