import { useState, useEffect } from "react";
import { useRef } from "react";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { data } from "./data";

import VideoBlock from "./VideoBlock";
import AudioBlock from "./AudioBlock";
import HoverLine from "./HoverLine";

export default function Timeline({ videoClips, setVideoClips }) {
  // const [videoClips, setVideoClips] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [sliderValue, setSliderValue] = useState(50);
  const [markerMode, setMarkerMode] = useState(false);

  //Hover line
  const [linePosition, setLinePosition] = useState(100);

  const handleMouseMove = (e) => {
    setLinePosition(e.clientX);
  };

  const divRef = useRef(null);

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (active.id === over.id) {
      return;
    }
    setVideoClips((videoClips) => {
      const oldIndex = videoClips.findIndex(
        (videoClip) => videoClip.id === active.id
      );
      const newIndex = videoClips.findIndex(
        (videoClip) => videoClip.id === over.id
      );
      console.log(newIndex); // Send users[newIndex] to the server to trim in the trim function.
      return arrayMove(videoClips, oldIndex, newIndex);
    });
  };

  const loadVideoClips = (videoClips, sliderValue) => {
    videoClips.map((videoClip) => (
      <VideoBlock key={videoClip.id} video={videoClip} scalar={sliderValue} />
    ));
  };

  useEffect(() => {
    let changeableClips = [];
    videoClips.forEach((videoClip) => {
      if (videoClip.flex == true) {
        changeableClips.push(videoClip);
      }
    });
    console.log(changeableClips);
  }, [videoClips]);

  return (
    <div className="mx-auto relative" onMouseMove={handleMouseMove}>
      <div className="flex justify-between h-14 ml-5 mr-5 border-b border-gray-300">
        {/* Buttons */}
        <div className="flex justify-between items-center w-76 space-x-2">
          <button className="border-2 border-blue-500 rounded-md text-blue-500 text-base px-4 py-1 cursor-pointer">
            <span>Algorithm</span>
          </button>

          <button
            className="border-2 border-blue-500 rounded-md text-blue-500 text-base px-4 py-1 cursor-pointer"
            onClick={() => {
              setMarkerMode(true);
            }}
          >
            <span>Activate Marker Mode</span>
          </button>
          <button
            className="border-2 border-blue-500 rounded-md text-blue-500 text-base px-4 py-1 cursor-pointer"
            onClick={() => {
              setMarkerMode(false);
            }}
          >
            <span>Activate Timeline Mode</span>
          </button>
        </div>

        {/* Spacer */}
        {/* Timestamp Tracker */}
        <div className="flex justify-center items-center">
          <span>00:03.84 / 00:13.60</span>
        </div>
        {/* Timestamp Tracker */}
        {/* Spacer */}
        <div style={{ width: "145px" }}></div>
        {/* Min/Max Timeline Control */}
        <div className="flex justify-center items-center">
          <input
            type="range"
            value={sliderValue}
            onChange={(e) => setSliderValue(e.target.value)}
            min="1"
            max="100"
          />
        </div>
        {/* Min/Max Timeline Control */}
      </div>
      {/* Video and Audio Main Timeline */}
      <HoverLine linePosition={linePosition} />

      <div className="overflow-x-auto h-32 mt-4">
        <div>
          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={videoClips}>
              <div className="flex">
                {/* Why PROPS Passed as undefined ?? */}
                {videoClips.map((videoClip) => (
                  <VideoBlock
                    key={videoClip.id}
                    video={videoClip}
                    scalar={sliderValue}
                    marker_mode={markerMode}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
        <div className="flex pt-5">
          <AudioBlock size={15} id="1" scalar={sliderValue} />
        </div>
      </div>
    </div>
  );
}
