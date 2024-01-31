import { useState, useEffect, useRef } from "react";

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
  selectedClip
}) {
  const [sliderValue, setSliderValue] = useState(50);
  const [markerMode, setMarkerMode] = useState(false);
  const [linePosition, setLinePosition] = useState(100);
  const [totalDuration, setTotalDuration] = useState(0);
  const timeLineRef = useRef(null);

  const handleMouseMove = (e) => {
    setLinePosition(Math.min(Math.max(
      e.clientX - timeLineRef.current.getBoundingClientRect().left/2 + 8,
      timeLineRef.current.getBoundingClientRect().left - 30), timeLineRef.current.getBoundingClientRect().right - 30));
  };

  useEffect(() => {
    let tmp_dur = 0;

    for (let i = 0; i < clipList.length; i++) {
      tmp_dur += parseFloat(clipList[i].duration) - clipList[i].startDelta - clipList[i].endDelta;
    }

    setTotalDuration(Math.max(Math.ceil(tmp_dur), 300));

  }, [clipList]);

  const setMarkerMaster = (id, marker, type) => {
    if (type == 0) {
      audioClip.markers = marker;
      setAudioClip(audioClip);
    } else {
      for (let i = 0; i < clipList.length; i++) {
        if (clipList[i].id == id) {
          clipList[i].markers = marker;
          console.log(clipList[i].markers)
        }
      }
      setClipList(clipList);
    }
  };

  const handleBlockCommand = (e) => {
    if ((e.key === "Backspace" || e.key === "Delete") && selectedClip) {
      if (selectedClip.type) {
        const filtered_clips = clipList.filter(
          (clip) => clip.id !== selectedClip.id
        );
        setClipList(filtered_clips);
      } else {
        setAudioClip(undefined);
      }
    }

    if ((e.key === "ArrowLeft") && selectedClip && selectedClip.type) {
      e.preventDefault();

      const index = clipList.findIndex(x => x.id === selectedClip.id)

      setClipList(clipList => {
        if (index > 0) {
          return [
            ...clipList.slice(0, index - 1),
            selectedClip,
            clipList[index - 1],
            ...clipList.slice(index + 1)
          ];
        }

        return clipList;
      })
    }

    if ((e.key === "ArrowRight") && selectedClip && selectedClip.type) {
      e.preventDefault();

      const index = clipList.findIndex(x => x.id === selectedClip.id)

      setClipList(clipList => {
        if (index >= 0 && index < clipList.length - 1) {
          return [
            ...clipList.slice(0, index),
            clipList[index + 1],
            selectedClip,
            ...clipList.slice(index + 2)
          ];
        }

        return clipList;
      })
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleBlockCommand);

    // Cleanup function
    return () => {
      window.removeEventListener("keydown", handleBlockCommand);
    };
  }, [selectedClip, clipList]);

  return (
    <div
      className="w-auto h-[25vh] overflow-hidden shadow-xl shadow-black/20 rounded-2xl
      flex flex-row justify-start align-middle relative"
      onMouseMove={handleMouseMove}
    >
      <HoverLine linePosition={linePosition} />

      <div className="h-[25vh] max-w-[30vw] bg-twilight flex items-center flex-col align-middle justify-around shadow-2xl shadow-black z-50">
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
            processClips(true);
          }} />
        </div>
      </div>

      <div ref={timeLineRef} className="relative flex flex-col align-middle overflow-x-scroll scrollbar-thin scrollbar-thumb-grey_accent scrollbar-track-grey_accent/30 bg-dawn">
        <div
          className="flex justify-between whitespace-nowrap bg-twilight h-[4.8vh]"
          style={{
            width: `${totalDuration * 30 * (sliderValue * 0.02)}px`
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

        <div className="my-auto ml-1 mt-3">
          <div className="flex items-center space-x-4 text-center">
            <div className="min-h-16 p-2">
              <div className="flex">
                {/* Why PROPS Passed as undefined ?? */}
                {clipList.map((clip) => (
                  <div>
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
            </div>
            <div className="absolute -left-4 top-1/2 -translate-y-[16px] h-[1px] m-auto rounded-lg border-grey_accent/30 border-[1px] z-0"
              style={{
                width: `${totalDuration * 30 * (sliderValue * 0.02) + 10}px`
              }} />
          </div>

          <div className="flex items-center space-x-4">
            <div className="min-h-16 p-2">
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
            </div>
            <div className="absolute -left-4 bot-1/2 -translate-y-[4px] h-[1px] m-auto rounded-lg border-grey_accent/30 border-[1px] z-0"
              style={{
                width: `${totalDuration * 30 * (sliderValue * 0.02) + 10}px`
              }} />
          </div>

        </div>
      </div>

      <div className="h-[25vh] w-[3vw] bg-twilight flex items-center flex-col align-middle justify-around shadow-2xl shadow-black z-50">
        <input type="range" min="30" max="180" onChange={(e) => {
          setSliderValue(e.target.value)
        }} className="border-0 accent-primary rounded-lg appearance-none cursor-pointer vertical-input h-[20vh]" />
      </div>
    </div>
  );
}
