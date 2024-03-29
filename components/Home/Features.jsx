/* This example requires Tailwind CSS v2.0+ */
import {
  AnnotationIcon,
  MailIcon,
  FilmIcon,
  BookmarkIcon,
  KeyIcon,
  PencilIcon,
} from "@heroicons/react/outline";

const transferFeatures = [
  {
    id: 1,
    name: "Import media from your device",
    description: "Whether it's audio or video, we'll handle all of it.",
    icon: FilmIcon,
  },
  {
    id: 2,
    name: "Automatically saved to your account",
    description:
      "Have the freedom to upload and save your media, picking up work whenever convenient.",
    icon: BookmarkIcon,
  },
];
const communicationFeatures = [
  {
    id: 1,
    name: "Place down markers",
    description: "Simple as . . .",
    icon: PencilIcon,
  },
  {
    id: 2,
    name: "Keybinds for your convenience",
    description:
      "Use the 'm' key to mark specific moments and the 'f' key to label a video as 'flexible'.",
    icon: KeyIcon,
  },
];

export default function Features() {
  return (
    <div className="py-16 bg-dawn overflow-hidden lg:py-24">
      <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div className="relative">
          <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            A better way to edit videos
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
            Long gone are the days of tediously lining up video and audio clips.
            Videomatic's software does that for you, saving hours of time.
          </p>
        </div>

        <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div className="relative">
            <h3 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
              All your creative assets, perfectly organized
            </h3>
            <p className="mt-3 text-lg text-gray-500">
              No need to learn complicated software commands and functions.
              Videomatic's organized layout and drag and drop features allows
              for an easy and intuitive user experience.
            </p>

            <dl className="mt-10 space-y-10">
              {transferFeatures.map((item) => (
                <div key={item.id} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md text-white">
                      <item.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900 bg-gradient-to-r from-primary via-red-400 to-accent inline-block text-transparent bg-clip-text">
                      {item.name}
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    {item.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-10 -mx-4 relative lg:mt-0" aria-hidden="true">
            <img
              className="relative mx-auto"
              width={520}
              src="https://tailwindui.com/img/features/feature-example-1.png"
              alt=""
            />
          </div>
        </div>

        <div className="relative mt-12 sm:mt-16 lg:mt-24">
          <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="lg:col-start-2">
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl text-white">
                Clip your moments with custom markers
              </h3>
              <p className="mt-3 text-lg text-gray-500">
                Use our innovative and intuitive marking system to demark where
                highlights occur in video and audio clips. This lets our
                algorithm know where to align the clips.
              </p>

              <dl className="mt-10 space-y-10">
                {communicationFeatures.map((item) => (
                  <div key={item.id} className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-orange text-white">
                        <item.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900 bg-gradient-to-r from-primary via-red-400 to-accent inline-block text-transparent bg-clip-text">
                        {item.name}
                      </p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500">
                      {item.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-10 -mx-4 relative lg:mt-0 lg:col-start-1">
              <img
                className="relative mx-auto"
                width={520}
                src="https://tailwindui.com/img/features/feature-example-2.png"
                alt=""
              />

              {/* <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl "></div>
              <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl"></div>
              <div className="absolute top-0 -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl"></div> */}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
