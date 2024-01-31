"use client";

import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import Link from "next/link";
import Image from "next/image";

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

export default function Navbar() {
  return (
    <header className="bg-dawn">
      <Popover className="relative">
        <div className="flex justify-between items-center mx-4 lg:mx-12 px-4 py-6 sm:px-6 md:justify-start md:space-x-10 lg:px-8">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link
              href="/"
              className="flex justify-center items-center space-x-3"
            >
              <Image
                className=""
                width={40}
                height={40}
                src="/three-circles-white.png"
                alt=""
              />
              <span className="font-black text-2xl lg:text-3xl font-['Proxima Nova']">
                VISAGE
              </span>
            </Link>
          </div>

          <div className="flex items-center justify-end flex-1 w-0 space-x-4">
            <Link
              href="/signin"
              className="whitespace-nowrap font-medium text-white hover:text-gray-200"
            >
              <button className="btn btn-primary text-white btn-sm md:btn-md">Sign in</button>
            </Link>

            <Link
              href="/signup"
              className="whitespace-nowrap text-white font-medium hover:text-gray-200"
            >
              <button className="btn btn-primary text-white btn-sm md:btn-md">Sign up</button>
            </Link>
          </div>
        </div>
      </Popover>
    </header>
  );
}
