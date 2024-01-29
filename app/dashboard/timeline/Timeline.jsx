import { useState, useEffect } from "react";
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
  const totalDuration = clipList.reduce((acc, clip) => acc + clip.duration, 0);
  const [interval, setInterval] = useState(1);
  const [timestamps, setTimestamps] = useState([]);
  const [selectedClip, setSelectedClip] = useState();

  const handleMouseMove = (e) => {
    setLinePosition(e.clientX);
  };

  useEffect(() => {
    generateTimestamps();

  }, []);

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

  const generateTimestamps = () => {
    const _interval = Math.round(totalDuration / sliderValue);
    for (let time = 0; time < totalDuration; time += _interval) {
      setTimestamps([...timestamps, formatTime(time)]);
    }

    // const timestamps = [];
    // const interval = Math.round(totalDuration / sliderValue);
    // for (let time = 0; time < totalDuration; time += interval) {
    //   timestamps.push(formatTime(time));
    // }
    // return timestamps;
  };

  const formatTime = (time) => {
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return [minutes, seconds]
      .map((val) => (val < 10 ? `0${val}` : val))
      .join(":");
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
      <div className="flex justify-between h-14 ml-5 mr-5">
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
            onChange={(e) => {
              setSliderValue(parseFloat(e.target.value));
              setInterval(Math.round(totalDuration / sliderValue));
            }}
            min="20"
            max="100"
          />
        </div>
      </div>

      {/* Video and Audio Main Timeline */}
      <HoverLine linePosition={linePosition} />

      {/* <div className="h-[1px] bg-black" /> */}

      <div className="overflow-x-auto overflow-y-hidden h-40 p-2 my-4">
        <div
          className={`flex space-x-[4.7rem] whitespace-nowrap ml-16 -translate-x-3`}
        >
          {timestamps.map((timestamp, index) => (
            <div className="">
              <span key={index} className="text-sm">
                {timestamp}
              </span>
              <div className="h-[5px] w-[1px] bg-white ml-5" />
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <p>Video</p>
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

        {/* <div className="h-[1px] bg-black" /> */}

        <div className="min-h-16 py-4">
          <div className="flex items-center space-x-4">
            <p className="pt-2 mr-2">Audio</p>
            <DndContext collisionDetection={closestCenter} onDragEnd={() => {}}>
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

        <div className="h-[1px] bg-black" />
      </div>
    </div>
  );
}
