'use client'

import Hero from "../components/Home/Hero";
import Navbar from "../components/Home/Navbar";
import Features from "../components/Home/Features";
import Footer from "../components/Home/Footer";
import CTA from "@/components/Home/CTA";

import { BsArrowReturnRight } from "react-icons/bs";
import { motion } from 'framer-motion';
import { titleAnimation } from '../components/animations/animations'
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function landingPage() {
  const router = useRouter();
  const navbar = useRef<HTMLDivElement>(null);
  const technology = useRef<HTMLDivElement>(null);
  const loaderBlock = useRef<HTMLDivElement>(null);
  const [unload, setUnload] = useState<boolean>(false);

  useEffect(() => {
    window.onscroll = (e) => {
      if (window.scrollY > 0 && navbar) {
        navbar.current?.classList.add("bg-white");
        navbar.current?.classList.add("text-black");
      }

      if (window.scrollY <= 0 && navbar) {
        navbar.current?.classList.remove("bg-white");
        navbar.current?.classList.remove("text-black");
      }
    }

  }, [])

  useEffect(() => {
    if (unload) loaderBlock.current?.classList.add('hidden')
  }, [unload])

  return (
    <div className="flex flex-col w-screen min-h-screen bg-dawn font-['Apercu']">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: '-50vh' }}
        onAnimationComplete={(e) => setUnload(true)}
        transition={{
          ease: [.98, .03, .89, .82],
          duration: 0.8,
          delay: 0.5
        }}
        className="absolute w-screen h-[50vh] top-0 bg-black z-30" />
      <motion.div
        ref={loaderBlock}
        initial={{ y: 0 }}
        animate={{ y: '50vh' }}
        onAnimationComplete={(e) => setUnload(true)}
        transition={{
          ease: [.98, .03, .89, .82],
          duration: 0.8,
          delay: 0.5
        }}
        className="absolute w-screen h-[50vh] top-1/2 bg-black z-30" />

      <div className="absolute w-screen h-screen overflow-hidden brightness-[0.3] z-0 pointer-events-none">
        <img src="/hero_gif.gif" className="w-full"></img>
      </div>

      <div className="fixed flex flex-row justify-between align-middle w-screen p-4 z-20 transition duration-500" ref={navbar}>
        <div className="w-36">
          <h1 className="cursor-pointer font-['Slagless'] tracking-wider text-2xl">VISAGE</h1>
        </div>

        <div className="w-36">
        </div>

        <div className="w-28">
          <h1 className="cursor-pointer text-lg my-auto hover:underline" onClick={() => window.scrollTo(0, 0)}>Landing</h1>
        </div>

        <div className="w-36">
          <h1 className="cursor-pointer text-lg my-auto hover:underline" onClick={() => window.scrollTo(0, ((technology.current?.getBoundingClientRect().top || 0) + 20))}>Technology</h1>
        </div>

        <div className="w-36">
          <h1 className="cursor-pointer text-lg my-auto hover:underline" onClick={() => router.push('/dashboard')}>Dashboard</h1>
        </div>

        <div className="w-36">
          <a className="cursor-pointer text-lg my-auto hover:underline" href="mailto:alvinqz@mit.edu">Contact</a>
        </div>

        <div className="w-56 self-end text-right">
        </div>

        <div className="w-56 self-end text-right">
        </div>

        <div className="w-56 self-end text-right">
        </div>

        <div className="w-56 self-end text-right">
        </div>

        <div className="w-36 self-end text-right">
          <h1 className="cursor-pointer mb-2 text-lg my-auto hover:underline" onClick={() => router.push('/signin')}>Sign In</h1>
        </div>

        <div className="w-28 self-end text-right">
          <h1 className="cursor-pointer mb-2 text-lg my-auto hover:underline" onClick={() => router.push('/signup')}>Sign Up</h1>
        </div>
      </div>

      <div className="z-10 h-[80vh] w-[50vw] flex flex-col justify-end pl-6">
        <h1 className="z-0 text-[3.9rem] overflow-hidden leading-[1.2] relative">
          <motion.div
            initial="initial"
            animate="animate"
            variants={titleAnimation}
            custom={0}

            className="overflow-hidden">
            VISAGE<span className="absolute text-3xl top-2">©</span> , A revolutionary
          </motion.div>
        </h1>

        <h1 className="text-[3.9rem] leading-[1.2] relative overflow-y-hidden">
          <motion.div
            initial="initial"
            animate="animate"
            variants={titleAnimation}
            custom={1}
            className="">
            <span className="underline decoration-primary/70">web-based</span> automated
          </motion.div>
        </h1>

        <h1 className="text-[3.9rem] leading-[1.2] relative overflow-y-hidden">
          <motion.div
            initial="initial"
            animate="animate"
            variants={titleAnimation}
            custom={2}
            className="overflow-y-hidden">
            <span className="underline decoration-accent/80">video editing</span> platform
          </motion.div>
        </h1>
      </div>

      <div className="mt-[10vh] w-full flex flex-row align-middle p-6 z-10">
        <BsArrowReturnRight className="my-auto" />
        <p className="my-auto ml-2">Go to Dashboard Now.</p>
      </div>

      <div className="w-screen bg-white flex flex-col justify-start items-center" ref={technology}>
        <div className=" flex flex-row justify-start items-start text-midnight pt-[14vh] px-6">
          <div className="w-[50%]">
            <h1 className="text-3xl w-[82%] leading-[1.2] relative overflow-y-hidden">
              Visage is reimagining the workflow of video editing. Removing the hassle of a desktop program, and integrating the intelligence
              of algorithmic editing.
            </h1>
          </div>

          <div className="w-[50%]">
            <h1 className="text-3xl w-[100%] leading-[1.2] relative overflow-y-hidden">
              An its core, Visage provides a simplified workflow for syncing video clips with audio—the core of editing—whether
              for montages, highlight reels, or edits.
            </h1>

            <h1 className="text-3xl w-[100%] leading-[1.2] relative overflow-y-hidden mt-10">
              Simply import your video and audio files into Visage, add them to the timeline, mark the key points you wish to highlight in your
              video clips and audio clip, and watch as Visage magically trims and syncs your clips to produce a polished edited video.
            </h1>
          </div>
        </div>

        <div className="mx-auto h-[60vh] mt-10 flex flex-row justify-between items-center">
          <Image src="/visage-ui.JPG" alt="UI Demo" className="mr-20 w-auto rounded-2xl shadow-xl shadow-black/40" width={800} height={800} />
          <Image src="/visage-media.JPG" alt="UI Demo" className="w-auto rounded-2xl shadow-xl shadow-black/40" width={380} height={380} />
        </div>

        <div className="mx-auto h-[10vh]">
        </div>
      </div>
    </div >
  );
}
