"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative bg-dawn overflow-hidden">
      <div className="relative pb-16 sm:pb-24">
        <main className="mx-auto max-w-7xl px-4 mt-12">
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
                your best moments.
              </motion.p>
            </div>
          </div>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl text-center">
            Create <b>montages</b>, <b>highlights</b>, and <b>edits</b> instantly with our revolutionary automated editing algorithm.
            Simply import your favorite clips and watch your vision come to life.
          </p>
          <div className="mt-5 max-w-md mx-auto flex justify-center md:mt-8 ">
            <div className="rounded-md shadow ">
              <Link
                href="/dashboard"
                className="whitespace-nowrap font-medium text-white hover:text-gray-200"
              >
                <button className="btn btn-primary text-white">Get started</button>
              </Link>
            </div>
          </div>
        </main>
      </div>

      <div className="w-3/4 h-[50vh] rounded-2xl mx-auto border-dawn border-[4px] shadow-2xl shadow-black/40 mb-24 flex justify-center items-center">
        <Image src="/visage-ui.JPG" alt="Demonstration" height={1000} width={1000} className="rounded-2xl shadow-2xl shadow-accent/20" />
      </div>
    </div>
  );
}
