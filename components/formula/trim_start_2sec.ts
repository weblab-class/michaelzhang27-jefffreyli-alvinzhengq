import MediaListWrapper from "../lib/MediaListWrapper";
import { MediaList } from "../types";

export default async function trim_handler(
  media_list: MediaListWrapper
): Promise<void> {
  let flexClips: MediaList = []
  let total_length = 0;
  let total_flex_length = 0;
  
  // TODO: need function to get the position of the audio marker on the audio clip
  let audio_marker_position = 1.0;
  let allVideos = media_list.get();

  for (let i = 0; i < media_list.get().length; i++) {
    if (allVideos[i].flex == true) {
      flexClips.push(allVideos[i]);
    }

    let clip_duration = parseFloat(allVideos[i].duration) - allVideos[i].startDelta - allVideos[i].endDelta;

    // FIXME: added in MediaListWrapper an incomplete hasMarker function
    if (media_list.hasMarker(i) && allVideos[i].flex == true) {
      total_flex_length += media_list.getMarkerLocation(i);
      total_length += media_list.getMarkerLocation(i);

    } else if (media_list.hasMarker(i) && allVideos[i].flex == false) {
      total_length += media_list.getMarkerLocation(i);

    } else if (allVideos[i].flex == true) {
      total_flex_length += clip_duration;
      total_length += clip_duration;

    } else {
      total_length += clip_duration;

    }
  }

  // how to make a new MediaListWrapper with the flex clips so I can access the trim functionalities ?
  let flexClipsWrapper = new MediaListWrapper(flexClips);
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
