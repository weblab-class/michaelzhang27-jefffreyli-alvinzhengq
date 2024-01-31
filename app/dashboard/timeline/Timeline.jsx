import { useState, useEffect, useRef } from "react";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

import Block from "./Block";
import HoverLine from "./HoverLine";

import { CiBookmarkPlus, CiAlignLeft, CiRead } from "react-icons/ci";

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
      className="w-auto h-[25vh] overflow-hidden shadow-xl shadow-black/20 rounded-2xl
      flex flex-row justify-start align-middle relative"
      onMouseMove={handleMouseMove}
    >
      {/* <div className="flex justify-between">
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
      </div> */}

      <HoverLine linePosition={linePosition} />

      <div className="h-[25vh] w-[30vw] bg-twilight flex flex-col align-middle justify-around shadow-2xl shadow-black z-50">
        <div className="tooltip tooltip-right tooltip-accent z-[100]" data-tip="Marker Mode">
          <CiBookmarkPlus className="w-12 scale-[1.56] cursor-pointer hover:!fill-primary transition duration-300" onClick={() => {
            setMarkerMode(true);
          }} style={{
            fill: markerMode ? "#74dafe" : "#5a5b60"
          }} />
        </div>

        <div className="tooltip tooltip-right tooltip-accent z-[100]" data-tip="Timeline Mode">
          <CiAlignLeft className="w-12 scale-[1.56] cursor-pointer hover:!fill-primary transition duration-300" onClick={() => {
            setMarkerMode(false);
          }} style={{
            fill: markerMode ? "#5a5b60" : "#74dafe"
          }} />
        </div>

        <div className="tooltip tooltip-right tooltip-accent z-[100]" data-tip="Compile Video Preview">
          <CiRead className="fill-grey_accent w-12 scale-[1.56] cursor-pointer hover:fill-primary transition duration-300" onClick={() => {
            processClips();
          }} />
        </div>
      </div>

      <div ref={timeLineRef} className="relative flex flex-col align-middle overflow-x-scroll no-scrollbar bg-dawn">
        <div
          className="flex justify-between whitespace-nowrap bg-twilight h-[4.8vh]"
          style={{
            width: `${totalDuration * 30 * (sliderValue / 50) + 2}px`
          }}
        >
          {[...Array(totalDuration + 1)].map((timestamp, index) => (
            <div className="relative w-4 mt-auto pl-4">
              <div key={index} className={(sliderValue <= 120 && index % 4 != 0 ? "invisible" : "") + " absolute left-1 bottom-3 text-xs font-semibold mx-auto text-center text-grey_accent"}>
                {`0${Math.floor(index / 60)}:${(index % 60 < 10) ? "0" + (index % 60) : (index % 60)}`}
              </div>
              <div className="h-[8px] w-[3px] rounded-xl bg-grey_accent mx-auto" />
            </div>
          ))}
        </div>

        <div className="my-auto ml-1">
          <div className="flex items-center space-x-4 text-center">
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

          <div className="absolute top-20">
            <div className="fixed h-[1px] w-[63.2vw] m-auto rounded-lg border-grey_accent/30 border-[1px] z-0" />
          </div>
          <div className="absolute top-36">
            <div className="fixed h-[1px] w-[63.2vw] m-auto rounded-lg border-grey_accent/30 border-[1px] z-0" />
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative min-h-16 p-2">
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
    </div>
  );
}
