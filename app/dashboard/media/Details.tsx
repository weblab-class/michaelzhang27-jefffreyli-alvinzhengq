import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MediaFile, MediaList } from "../types";
import { CiCirclePlus, CiVideoOn, CiVolumeHigh } from "react-icons/ci";

const Details = ({
  selectedClip,
  clipList,
  setClipList,
  setSelectedClip
}: {
  selectedClip: MediaFile,
  clipList: MediaList,
  setClipList: Dispatch<SetStateAction<MediaList>>,
  setSelectedClip: Dispatch<SetStateAction<MediaFile>>
}) => {
  const [markers, setMarkers] = useState<Array<string>>([]);
  const details = [
    { label: "Name", value: truncateText(selectedClip.display_name, 45) },
    { label: "Duration", value: `${parseFloat(selectedClip.duration) - selectedClip.startDelta - selectedClip.endDelta}s` },
    { label: "Type", value: selectedClip.type ? "Video" : "Audio" },
  ];

  useEffect(() => {
    let tmp_markers = []

    for (let i = 0; i < selectedClip.markers.length; i++) {
      tmp_markers.push(selectedClip.markers[i].toFixed(2));
    }

    setMarkers(tmp_markers.sort())
  }, [JSON.stringify(selectedClip)])

  return (
    <div className="bg-dawn p-4 rounded-sm font-thin">
      {/* Start div */}

      <h1 className="font-black text-lg mb-1">DETAILS</h1>

      <div className="h-[1px] rounded-xl w-full bg-grey_accent/20 mx-auto my-3" />

      {details.map((detail, index) => (
        <div key={index} className="flex justify-between mt-2 w-full">
          <h2 className="text-sm font-semibold text-gray-400">{detail.label}</h2>
          <p className="text-xs">{detail.value}</p>
        </div>
      ))}

      <div className="flex justify-between mt-2 w-full">
        <h2 className="text-sm font-semibold text-gray-400">Markers</h2>
        <p className="text-xs">{markers.length > 0 ? truncateText(markers.join(" || "), 45) : "None"}</p>
      </div>

      <div className="flex justify-between mt-2 w-full">
        <h2 className="text-sm font-semibold text-gray-400">Id</h2>
        <p className="text-xs">{selectedClip.id}</p>
      </div>

      <div className="flex justify-between mt-3 w-full">
        <h2 className="text-sm font-semibold text-gray-400">Start Trim</h2>

        <div role="group" className="flex flex-row justify-center align-middle">
          <button onClick={() => {
            selectedClip.startDelta = Math.max(0, selectedClip.startDelta - 0.5)
            setClipList(clipList.map((item) => {
              return item.id === selectedClip.id ? selectedClip : item
            }))
            setSelectedClip(selectedClip);
          }} type="button" className="px-2 py-1 text-xs font-normal rounded-s-2xl border-2 border-e-0 border-gray-600 hover:bg-gray-500/40 hover:text-white/80 transition duration-500">
            -
          </button>
          <div className="px-2 py-1 text-xs font-normal border-2 border-gray-600">
            {selectedClip.startDelta.toFixed(1)}s
          </div>
          <button onClick={() => {
            selectedClip.startDelta = Math.min(parseFloat(selectedClip.duration) / 2, selectedClip.startDelta + 0.5)
            setClipList(clipList.map((item) => {
              return item.id === selectedClip.id ? selectedClip : item
            }))
            setSelectedClip(selectedClip);
          }} type="button" className="px-2 py-1 text-xs font-normal rounded-e-2xl border-2 border-s-0 border-gray-600 hover:bg-gray-500/40 hover:text-white/80 transition duration-500">
            +
          </button>
        </div>
      </div>

      <div className="flex justify-between mt-2 w-full">
        <h2 className="text-sm font-semibold text-gray-400">End Trim</h2>

        <div role="group" className="flex flex-row justify-center align-middle">
          <button onClick={() => {
            selectedClip.endDelta = Math.max(0, selectedClip.endDelta - 0.5)
            setClipList(clipList.map((item) => {
              return item.id === selectedClip.id ? selectedClip : item
            }))
            setSelectedClip(selectedClip);
          }} type="button" className="px-2 py-1 text-xs font-normal rounded-s-2xl border-2 border-e-0 border-gray-600 hover:bg-gray-500/40 hover:text-white/80 transition duration-500">
            -
          </button>
          <div className="px-2 py-1 text-xs font-normal border-2 border-gray-600">
            {selectedClip.endDelta.toFixed(1)}s
          </div>
          <button onClick={() => {
            selectedClip.endDelta = Math.min(parseFloat(selectedClip.duration) / 2, selectedClip.endDelta + 0.5)
            setClipList(clipList.map((item) => {
              return item.id === selectedClip.id ? selectedClip : item
            }))
            setSelectedClip(selectedClip);
          }} type="button" className="px-2 py-1 text-xs font-normal rounded-e-2xl border-2 border-s-0 border-gray-600 hover:bg-gray-500/40 hover:text-white/80 transition duration-500">
            +
          </button>
        </div>
      </div>

      {/* End div */}
    </div>
  );
};

function truncateText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + "...";
  } else {
    return text;
  }
}

function formatTimeInput(input: string) {
  const numericInput = input.replace(/\D/g, "");
  const trimmedInput = numericInput.substring(0, 4);

  // Split the input into hours and minutes
  let formattedTime = "";
  if (trimmedInput.length <= 2) {
    // Only hour part is present or input is empty
    formattedTime = trimmedInput;
  } else {
    // Both hour and minute parts are present
    formattedTime =
      trimmedInput.substring(0, 2) + ":" + trimmedInput.substring(2);
  }

  return formattedTime;
}

export default Details;
