import React, { Dispatch, SetStateAction } from "react";
import { MediaFile, MediaList } from "../types";

const Details = ({
  id,
  name,
  duration,
  type,
  flexible,
  setFlexible,
  startTrim,
  setStartTrim,
  endTrim,
  setEndTrim,
  clipList,
  setClipList,
}: {
  id: string;
  name: string;
  duration: string;
  type: string;
  flexible: boolean;
  setFlexible: Dispatch<SetStateAction<boolean>>;
  startTrim: string;
  setStartTrim: Dispatch<SetStateAction<string>>;
  endTrim: string;
  setEndTrim: Dispatch<SetStateAction<string>>;
  clipList: MediaList;
  setClipList: Dispatch<SetStateAction<MediaList>>;
}) => {
  const details = [
    { label: "Name", value: truncateText(name, 45) },
    { label: "Duration", value: `${duration} s` },
    { label: "Type", value: type },
  ];

  const fileIndex = clipList.findIndex((file) => file.id === id);

  return (
    <div className="bg-dawn p-4 rounded-sm">
      {/* Start div */}

      <h1 className="font-black text-lg mb-4">DETAILS</h1>
      {details.map((detail, index) => (
        <div key={index} className="flex justify-between mt-4 w-full">
          <h2 className="text-sm text-gray-400">{detail.label}</h2>
          <p className="text-xs">{detail.value}</p>
        </div>
      ))}

      <div className="flex justify-between mt-4 w-full">
        <h2 className="text-sm text-gray-400">Flexible</h2>
        <label className="swap text-sm">
          <input
            type="checkbox"
            checked={(fileIndex >= 0 && clipList[fileIndex]?.flex) ?? false}
            onChange={(e) => {
              setFlexible(e.target.checked);

              if (fileIndex !== -1) {
                clipList[fileIndex].flex = e.target.checked;
              } else {
                console.error("Media file with id " + id + " not found.");
              }
            }}
          />
          <div className="swap-on bg-primary rounded-lg px-[8px] py-[0.22rem]">
            on
          </div>
          <div className="swap-off bg-accent rounded-lg px-[8px] py-[0.22rem]">
            off
          </div>
        </label>
      </div>

      <div className="flex justify-between mt-[0.6rem] w-full">
        <h2 className="text-sm text-gray-400">Start Trim</h2>
        <input
          type="text"
          placeholder="00:00"
          className="input input-xs w-[15%] bg-dawn text-end text-white text-xs translate-x-2 focus:outline-none border-0 focus:border-b rounded-none"
          value={startTrim}
          onChange={(e) => {
            setStartTrim(formatTimeInput(e.target.value));
          }}
        />
      </div>

      <div className="flex justify-between mt-3 w-full">
        <h2 className="text-sm text-gray-400">End Trim</h2>
        <input
          type="text"
          placeholder="00:00"
          className="input input-xs w-full w-[15%] bg-dawn text-end text-white text-xs translate-x-2 focus:outline-none border-0 focus:border-b rounded-none"
          value={endTrim}
          onChange={(e) => {
            setEndTrim(formatTimeInput(e.target.value));
          }}
        />
      </div>

      <div className="flex justify-between mt-3 w-full">
        <h2 className="text-sm text-gray-400">Id</h2>
        <p className="text-xs">{id}</p>
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
