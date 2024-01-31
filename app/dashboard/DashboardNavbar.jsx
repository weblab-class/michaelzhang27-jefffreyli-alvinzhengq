"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";

export default function DashboardNavbar() {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center py-4 mx-4">
      <Link
        href="/"
        className="flex justify-center items-center space-x-3 mt-2"
      >
        <Image
          className=""
          width={40}
          height={40}
          src="/three-circles-white.png"
          alt=""
        />
        <span className="font-[Slagless] font-semibold text-black text-xl bg-gradient-to-r from-orange via-red-400 to-blush inline-block text-transparent bg-clip-text">
          VISAGE
        </span>
      </Link>
      <button
        onClick={() => {
          signOut(auth);
          router.push("/signin");
        }}
      >
        <p className="underline underline-offset-4 text-gray-200 hover:text-gray-300">
          Sign out
        </p>
      </button>
    </div>
  );
}
