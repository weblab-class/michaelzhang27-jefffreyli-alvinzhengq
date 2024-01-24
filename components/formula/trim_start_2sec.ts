import { useRef } from "react";
import VideoListWrapper from "../lib/VideoListWrapper";

type VideoList = Array<{
  name: string;
  id: string;
  duration: string;
  startDelta: number;
  endDelta: number;
}>;

export default async function trim_handler(
  video_list: VideoListWrapper
): Promise<void> {
  // am i doing this right ? flexClips is of type VideoListWrapper
  let flexClips = useRef<VideoList>([]);
  let total_length = 0;
  let total_flex_length = 0;

  // need function to get the position of the audio marker on the audio clip
  let audio_marker_position = 1.0;
  let allVideos = video_list.get();
  for (let i = 0; i < video_list.get().length; i++) {
    // added in VideoListWrapper flex (flexible aka changeable) property

    // or we can do:
    /**
     * video_list.trimStart(i, 0.5);
     * video_list.trimStart(i, 1.5);
     */
    if (allVideos[i].flex == true) {
      flexClips.current.push(allVideos[i]);
    }
    // added in VideoListWrapper an incomplete hasMarker function
    if (video_list.hasMarker(i) && allVideos[i].flex == true) {
      total_flex_length += video_list.getMarkerLocation(i);
      total_length += video_list.getMarkerLocation(i);
    } else if (video_list.hasMarker(i) && allVideos[i].flex == false) {
      total_length += video_list.getMarkerLocation(i);
    } else if (allVideos[i].flex == true) {
      total_flex_length += allVideos[i].startDelta;
      total_length += allVideos[i].endDelta;
    } else {
      total_length += allVideos[i].endDelta;
    }
  }

  // how to make a new videolistwrapper with the flex clips so I can access the trim functionalities ?
  let flexClipsWrapper = new VideoListWrapper(flexClips);
  // time difference between video marker and audio marker pair
  let difference = total_length - audio_marker_position;
  // case one, video clip marker in front of audio clip marker, aka video needs to be trimmed
  if (difference > 0) {
    if (difference > total_flex_length) {
      console.log(
        "ERROR, Please remove " +
          (difference - total_flex_length) +
          " worth of video footage from in front of the marker"
      );
    } else {
      let trimPerClip = difference / flexClipsWrapper.get().length;
      for (let i = 0; i < flexClipsWrapper.get().length; i++) {
        flexClipsWrapper.trimStart(i, trimPerClip / 2);
        flexClipsWrapper.trimEnd(i, trimPerClip / 2);
      }
    }
  }
  // case two, video clip marker behind the audio clip marker so difference is negative
  else {
    if (total_flex_length - total_length < -1 * difference) {
      console.log(
        "ERROR, Please add " +
          (difference - total_flex_length) +
          " worth of video footage in front of the marker"
      );
    } else {
      let trimPerClip = difference / flexClipsWrapper.get().length;
      let leftOverTrim = 0;
      for (let i = 0; i < flexClipsWrapper.get().length; i++) {
        // why throwing error ? flexClips is of type VideoList
        // startdelta - enddelta is the amount that has been chopped off
        if (flexClips[i].startDelta - flexClips[i].endDelta < trimPerClip) {
          flexClipsWrapper.trimStart(
            i,
            -(flexClips[i].startDelta - flexClips[i].endDelta) / 2
          );
          flexClipsWrapper.trimEnd(
            i,
            -(flexClips[i].startDelta - flexClips[i].endDelta) / 2
          );
          leftOverTrim +=
            trimPerClip - (flexClips[i].startDelta - flexClips[i].endDelta);
        } else if (
          flexClips[i].startDelta - flexClips[i].endDelta >=
          trimPerClip
        ) {
          flexClipsWrapper.trimStart(i, -trimPerClip);
          flexClipsWrapper.trimEnd(i, -trimPerClip);
        }
      }

      while (leftOverTrim > 0) {
        for (let i = 0; i < flexClipsWrapper.get().length; i++) {
          // why throwing error ? flexClips is of type VideoList
          // startdelta - enddelta is the amount that has been chopped off
          if (flexClips[i].startDelta - flexClips[i].endDelta < leftOverTrim) {
            flexClipsWrapper.trimStart(
              i,
              -(flexClips[i].startDelta - flexClips[i].endDelta) / 2
            );
            flexClipsWrapper.trimEnd(
              i,
              -(flexClips[i].startDelta - flexClips[i].endDelta) / 2
            );
            leftOverTrim -= flexClips[i].startDelta - flexClips[i].endDelta;
          } else if (
            flexClips[i].startDelta - flexClips[i].endDelta >=
            leftOverTrim
          ) {
            flexClipsWrapper.trimStart(i, -leftOverTrim);
            flexClipsWrapper.trimEnd(i, -leftOverTrim);
            leftOverTrim = 0;
          }
        }
      }
    }
  }
}
