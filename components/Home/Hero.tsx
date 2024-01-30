"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="relative bg-dawn overflow-hidden">
      <div
        className="hidden sm:block sm:absolute sm:inset-y-0 sm:h-full sm:w-full"
        aria-hidden="true"
      ></div>

      <div className="relative pt-6 pb-16 sm:pb-24">
        <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
          <div className="text-center">
            <div className="">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-7xl font-semibold mb-2"
              >
                <span className="bg-gradient-to-r from-primary via-red-400 to-accent inline-block text-transparent bg-clip-text">
                  Sync and craft
                </span>
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="text-white text-6xl font-semibold"
              >
                your best moments
              </motion.p>
            </div>
          </div>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl text-center">
            Import your favorite video and audio clips then demark the
            “highlight” in each clip. Then watch our algorithm automatically
            align the two together!
          </p>
          <div className="mt-5 max-w-md mx-auto flex justify-center md:mt-8 ">
            <div className="rounded-md shadow ">
              <Link
                href="/signin"
                className="whitespace-nowrap font-medium text-white hover:text-gray-200"
              >
                <button className="btn btn-primary text-white">Get started</button>
              </Link>
            </div>
          </div>
        </main>
      </div>

      <div className="  w-3/4 h-[50vh] flex justify-center rounded-lg mx-auto border-[1px] border-gray-100 shadow-lg mb-24 flex justify-center items-center">
        <div className="-z-10 w-[160vh] h-[60vh] bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        {/* <div className="-z-10 w-[175rem] h-[40rem] bg-orange rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div> */}
      </div>
    </div>
  );
}
