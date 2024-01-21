import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative bg-background overflow-hidden">
      <div
        className="hidden sm:block sm:absolute sm:inset-y-0 sm:h-full sm:w-full"
        aria-hidden="true"
      ></div>

      <div className="relative pt-6 pb-16 sm:pb-24">
        <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
          <div className="text-center">
            <div className="">
              <p className="text-orange text-7xl font-semibold mb-2 ">
                Sync and craft
              </p>
              <p className="text-black text-6xl font-semibold">
                your best moments
              </p>
            </div>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
              lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
              fugiat aliqua.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/signin"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange md:py-4 md:text-lg md:px-10"
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div className="bg-white w-3/4 h-[35rem] flex justify-center rounded-lg mx-auto border-[1px] border-gray-100 shadow-lg mb-24 flex justify-center items-center">
        {/* <div className="-z-10 w-[150rem] h-[30rem] bg-orange rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="-z-10 w-[150rem] h-[30rem] bg-orange rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div> */}
      </div>
    </div>
  );
}
