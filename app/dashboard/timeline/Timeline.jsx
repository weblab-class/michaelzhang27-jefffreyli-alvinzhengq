import { useState, useEffect } from "react";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

import Block from "./Block";
import HoverLine from "./HoverLine";

export default function Timeline({ clipList, audioClip, setClipList }) {
  const [sliderValue, setSliderValue] = useState(50);
  const [markerMode, setMarkerMode] = useState(false);

  const [linePosition, setLinePosition] = useState(100);

  const handleMouseMove = (e) => {
    setLinePosition(e.clientX - 45);
  };

  useEffect(() => console.log(audioClip), [audioClip]);

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (active.id === over.id) {
      return;
    }
    setClipList((clipList) => {
      const oldIndex = clipList.findIndex((clip) => clip.id === active.id);
      const newIndex = clipList.findIndex((clip) => clip.id === over.id);
      return arrayMove(clipList, oldIndex, newIndex);
    });
  };

  return (
    <div
      className="mx-auto relative bg-darkerBackground rounded-xl pt-6 pb-2 px-2 shadow-md"
      onMouseMove={handleMouseMove}
    >
      <div className="flex justify-between h-14 ml-5 mr-5">
        {/* Buttons */}
        <div className="flex justify-between items-center w-76 space-x-2">
          <button className="border-2 bg-orange rounded-md text-white px-4 py-1 cursor-pointer">
            <span>Algorithm</span>
          </button>

          <button
            className="border-2 bg-orange rounded-md text-white px-4 py-1 cursor-pointer"
            onClick={() => {
              setMarkerMode(true);
            }}
          >
            <span>Activate Marker Mode</span>
          </button>
          <button
            className="border-2 bg-orange rounded-md text-white px-4 py-1 cursor-pointer"
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
            onChange={(e) => setSliderValue(parseFloat(e.target.value))}
            min="20"
            max="100"
          />
        </div>
        {/* Min/Max Timeline Control */}
      </div>
      {/* Video and Audio Main Timeline */}
      <HoverLine linePosition={linePosition} />

      <div className="overflow-x-auto overflow-y-hidden h-40 p-2 my-4">
        <hr></hr>
        <div className="min-h-16 p-2">
          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={clipList}>
              <div className="flex">
                {/* Why PROPS Passed as undefined ?? */}
                {clipList.map((clip) => (
                  <Block
                    key={clip.id}
                    media={clip}
                    scalar={sliderValue}
                    marker_mode={markerMode}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <hr></hr>

        <div className="min-h-16 p-2">
          <DndContext collisionDetection={closestCenter} onDragEnd={() => {}}>
            <SortableContext items={clipList}>
              <div className="flex">
                {audioClip && (
                  <Block
                    key={audioClip.id}
                    media={audioClip}
                    scalar={sliderValue}
                    marker_mode={markerMode}
                  />
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>
        <hr></hr>
      </div>
    </div>
  );
}
