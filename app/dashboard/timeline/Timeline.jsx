import { useState, useEffect, useRef } from "react";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

import Block from "./Block";
import HoverLine from "./HoverLine";

export default function Timeline({
  clipList,
  audioClip,
  setClipList,
  setAudioClip,
  processClips,
  setPreviewMediaType,
  setPreviewTimestamp,
  setVideoSrc,
  setAudioSrc,
}) {
  const [sliderValue, setSliderValue] = useState(50);
  const [markerMode, setMarkerMode] = useState(false);
  const [linePosition, setLinePosition] = useState(100);
  const [totalDuration, setTotalDuration] = useState(0);
  const [selectedClip, setSelectedClip] = useState();
  const timeLineRef = useRef(null);

  const handleMouseMove = (e) => {
    setLinePosition(Math.min(Math.max(e.clientX, timeLineRef.current.getBoundingClientRect().left), timeLineRef.current.getBoundingClientRect().right));
  };

  useEffect(() => {
    let tmp_dur = 0;

    for (let i = 0; i < clipList.length; i++) {
      tmp_dur += parseFloat(clipList[i].duration) - clipList[i].startDelta - clipList[i].endDelta;
    }

    setTotalDuration(Math.max(Math.ceil(tmp_dur), 300));

  }, [clipList]);

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

  const setMarkerMaster = (id, marker, type) => {
    if (type == 0) {
      audioClip.markers = marker;
      setAudioClip(audioClip);
    } else {
      for (let i = 0; i < clipList.length; i++) {
        if (clipList[i].id == id) {
          clipList[i].markers = marker;
        }
      }
      setClipList(clipList);
    }
  };

  const handleDeleteBlock = (e) => {
    if ((e.key === "Backspace" || e.key === "Delete") && selectedClip) {
      const filtered_clips = clipList.filter(
        (clip) => clip.id !== selectedClip.id
      );
      setClipList(filtered_clips);
      setSelectedClip(null);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleDeleteBlock);

    // Cleanup function
    return () => {
      window.removeEventListener("keydown", handleDeleteBlock);
    };
  }, [selectedClip, clipList]);

  return (
    <div
      className="mx-auto relative bg-grey pt-6 px-2 shadow-md h-full"
      onMouseMove={handleMouseMove}
    >
      <div className="flex justify-between h-14 w-[96vw] m-auto ml-2">
        {/* Buttons */}
        <div className="flex justify-between items-center w-76 space-x-2">
          <button
            className="bg-darkGrey rounded-sm text-white px-4 py-1 cursor-pointer text-xs lg:text-sm "
            onClick={() => {
              processClips();
            }}
          >
            <span>Algorithm</span>
          </button>

          <button
            className="bg-darkGrey rounded-sm text-white px-4 py-1 cursor-pointer text-xs lg:text-sm"
            onClick={() => {
              setMarkerMode(!markerMode);
            }}
          >
            <span>Marker Mode</span>
          </button>
          <button
            className="bg-darkGrey rounded-sm text-white px-4 py-1 cursor-pointer text-xs lg:text-sm"
            onClick={() => {
              setMarkerMode(false);
            }}
          >
            <span>Timeline Mode</span>
          </button>
        </div>

        {/* Spacer */}
        {/* Timestamp Tracker */}
        {/* <div className="flex justify-center items-center">
          <span>00:03.84 / 00:13.60</span>
        </div> */}
        {/* Timestamp Tracker */}
        {/* Spacer */}
        <div style={{ width: "145px" }}></div>
        {/* Min/Max Timeline Control */}
        <div className="flex justify-center items-center">
          <input
            type="range"
            value={sliderValue}
            onChange={(e) => {
              setSliderValue(parseFloat(e.target.value));
            }}
            min="30"
            max="200"
          />
        </div>
      </div>

      {/* Video and Audio Main Timeline */}
      <HoverLine linePosition={linePosition} />

      {/* <div className="h-[1px] bg-black" /> */}

      <div ref={timeLineRef} className="overflow-x-auto overflow-y-hidden p-4 pb-2 my-2 border-2 border-dawn rounded-lg w-[97%] mx-auto no-scrollbar">
        <div
          className={`flex justify-between whitespace-nowrap ml-20 -translate-x-3`}
          style={{
            width: `${totalDuration * 30 * (sliderValue / 50) + 2}px`
          }}
        >
          {[...Array(totalDuration + 1)].map((timestamp, index) => (
            <div className="w-4">
              <div key={index} className={(sliderValue <= 120 && index % 4 != 0 ? "invisible" : "") + " text-xs mx-auto text-center"}>
                {index}
              </div>
              <div className="h-[5px] w-[1px] bg-white mx-auto" />
            </div>
          ))}
        </div>

        <div className="h-[1px] m-auto mt-2 w-[97vw] rounded-lg border-dawn border-[1px]" />
        <div className="h-[16.5vh] m-auto mt-2 w-[1px] rounded-lg border-dawn border-[1px] absolute left-[6.7rem] -translate-y-1" />


        <div className="flex items-center space-x-4 text-center">
          <p className="font-bold text-sm ml-2">Video</p>
          <div className="min-h-16 p-2">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext items={clipList}>
                <div className="flex">
                  {/* Why PROPS Passed as undefined ?? */}
                  {clipList.map((clip) => (
                    <div
                      onClick={() => {
                        setSelectedClip(clip);
                      }}
                    >
                      <Block
                        key={clip.id}
                        media={clip}
                        scalar={sliderValue}
                        marker_mode={markerMode}
                        setPreviewMediaType={setPreviewMediaType}
                        setSrc={setVideoSrc}
                        setPreviewTimestamp={setPreviewTimestamp}
                        setMarkerMaster={setMarkerMaster}
                      />
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>

        <div className="h-[1px] m-auto w-[97vw] rounded-lg border-dawn border-[1px]" />

        <div className="flex items-center space-x-4">
          <p className="font-bold text-sm ml-2">Audio</p>
          <div className="min-h-16 p-2">
            <DndContext collisionDetection={closestCenter} onDragEnd={() => { }}>
              <SortableContext items={clipList}>
                <div className="flex">
                  {audioClip && (
                    <Block
                      key={audioClip.id}
                      media={audioClip}
                      scalar={sliderValue}
                      marker_mode={markerMode}
                      setPreviewMediaType={setPreviewMediaType}
                      setSrc={setAudioSrc}
                      setPreviewTimestamp={setPreviewTimestamp}
                      setMarkerMaster={setMarkerMaster}
                    />
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
}
