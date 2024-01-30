import Link from "next/link";

export default function CTA() {
  return (
    <div className="my-12">
      <div className=" bg-gradient-to-r from-primary via-red-400 to-accent max-w-7xl mx-auto text-center py-16 px-4 sm:py-24 sm:px-6 lg:px-8 rounded-none md:rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">Ready to get started?</span>
        </h2>
        {/* <p className="mt-4 text-lg leading-6 text-white">
        Ac euismod vel sit maecenas id pellentesque eu sed consectetur.
        Malesuada adipiscing sagittis vel nulla nec.
      </p> */}
        <Link
          href="/signup"
          className="text-primary mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blush bg-white sm:w-auto"
        >
          Sign up for free
        </Link>
      </div>
    </div>
  );
}
