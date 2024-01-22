"use client";

import signIn from "@/firebase/signin";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function signInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async (event) => {
    event.preventDefault();
    const { result, error } = signIn(email, password);
    if (error) {
      return console.log("error");
    }
    console.log(password);
    router.push("/dashboard");
  };

  return (
    <>
      <div className="flex">
        <div className="h-screen flex flex-col justify-center pb-20 px-6 lg:px-8 w-1/2">
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
            {/* <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          /> */}
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500 pt-2 pb-4">
              Please enter your details.
            </p>
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className=" py-8 px-4">
              <form
                onSubmit={handleSignIn}
                className="space-y-6"
                action="#"
                method="POST"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 sm:text-sm"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium underline underline-offset-4">
                      Forgot password?
                    </a>
                  </div>
                </div> */}

                <div>
                  <button
                    onClick={handleSignIn}
                    type="submit"
                    className=" w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>

          <Link
            href="/signup"
            className="text-center font-medium text-sm text-gray-600 mt-2"
          >
            <span>Don't have an account?</span> Sign up now.
          </Link>
        </div>

        <div className="relative w-1/2">
          <Image src="/gradient-bg.webp" layout="fill" objectFit="cover" />
        </div>
      </div>
    </>
  );
}
