"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";

export default function DashboardNavbar() {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center py-4">
      <Link
        href="/"
        className="flex justify-center items-center space-x-3 mt-2"
      >
        <Image
          className=""
          width={30}
          height={30}
          src="/videomatic-logo-transparent.png"
          alt=""
        />
        <span className="font-semibold text-black text-xl font-serif">
          Videomatic
        </span>
      </Link>
      <button
        onClick={() => {
          signOut(auth);
          router.push("/signin");
        }}
      >
        <p className="underline underline-offset-4 text-gray-700 hover:text-gray-800">
          Sign out
        </p>
      </button>
    </div>
  );
}
