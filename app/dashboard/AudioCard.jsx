import Image from "next/image";

export default function AudioCard({ file }) {
  return (
    <div
      key={file.name}
      className="mx-2 p-3 border-b-[1px] border-gray-300 h-20 flex items-center space-x-4"
    >
      <Image
        className="rounded-md h-16 w-auto"
        src={"/audio-image.png"}
        width={50}
        height={50}
        alt={"audio image"}
      ></Image>
      <p className="text-gray-700 text-xs">{file.name}</p>
    </div>
  );
}
