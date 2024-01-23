import { useState, useEffect } from "react";
import { useRef } from "react";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { data } from "./data";

import AudioClip from "./AudioClip";
import HoverLine from "./HoverLine";

export default function Timeline() {
  const [videoClips, setVideoClips] = useState(data);
  const [inputValue, setInputValue] = useState("");
  const [sliderValue, setSliderValue] = useState(50);

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
      <VideoClip key={videoClip.id} video={videoClip} scalar={sliderValue} />
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

  const VideoClip = ({ key, video, scalar }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: video.id });
    const style = {
      transition,
      transform: CSS.Transform.toString(transform),
      width: 100,
      height: 50,
      minWidth: video.length * 50 * (scalar / 50),
      backgroundColor: "#ff6f3c",
      boxShadow: "1px 1px 1px #F6C7B3",
      marginRight: 10,
      borderRadius: 5,
      display: "flex",
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div style={{ height: 3 }}></div>
        {video.flex == true && (
          <div style={{ margin: 8 }}>
            <text>C</text>
          </div>
        )}
        <text style={{ margin: 8 }}>{video.id}</text>
      </div>
    );
  };

  return (
    <div className="mx-auto relative" onMouseMove={handleMouseMove}>
      <div className="flex justify-between h-14 ml-5 mr-5 border-b border-gray-300">
        {/* Buttons */}
        <div className="flex justify-between items-center w-76 space-x-2">
          <button
            onClick={() => {
              console.log("pushed");
            }}
            className="border-2 border-blue-500 rounded-md text-blue-500 text-base px-4 py-1 cursor-pointer"
          >
            <span>Algorithm</span>
          </button>

          <button className="border-2 border-blue-500 rounded-md text-blue-500 text-base px-4 py-1 cursor-pointer">
            <span>Button 2</span>
          </button>
          <button className="border-2 border-blue-500 rounded-md text-blue-500 text-base px-4 py-1 cursor-pointer">
            <span>Button 3</span>
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
                  <VideoClip
                    key={videoClip.id}
                    video={videoClip}
                    scalar={sliderValue}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
        <div className="flex pt-5">
          <AudioClip size={15} id="1" scalar={sliderValue} />
        </div>
      </div>
    </div>
  );
}
