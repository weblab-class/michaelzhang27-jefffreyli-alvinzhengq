import MediaListWrapper from "../lib/MediaListWrapper";
import { MediaFile, MediaList } from "../types";

function closest_marker(
  audio_clip: MediaFile,
  timestamp: number
): number {
  let markers = audio_clip.markers.sort((a, b) => { return a-b; });

  for (let i = 0; i < markers.length; i++) {
    if (i + 1 == markers.length) {
      return markers[i];
    }

    if (markers[i] < timestamp && markers[i + 1] > timestamp) {
      return markers[i];
    }
  }

  return -1;
}

export default function trim_handler(
  mlist: MediaList,
  audio_clip: MediaFile
): MediaList {

  let media_list = new MediaListWrapper(mlist);
  let duration = 0;

  for (let i = 0; i < media_list.list.length; i++) {
    const cur_video = media_list.list[i];
    const cur_video_dur = parseFloat(cur_video.duration) - cur_video.startDelta - cur_video.endDelta;

    if (cur_video.markers.length == 0 && i + 1 < media_list.list.length) {
      const next_video = media_list.list[i + 1];

      if (next_video.markers.length == 0) {
        let closest_audio_marker = closest_marker(audio_clip, duration + cur_video_dur)
        let distance = Math.abs(closest_audio_marker - (duration + cur_video_dur))

        if (
          closest_audio_marker != -1 &&
          distance < (cur_video_dur - 0.5)
        ) {
          media_list.trimEnd(i, Math.min(distance, cur_video_dur));
        }
      } else {
        let closest_audio_marker = closest_marker(
          audio_clip,
          duration + cur_video_dur + next_video.markers[0]
        )
        let distance = Math.abs(closest_audio_marker - (duration + cur_video_dur + next_video.markers[0]))
        
        if (
          closest_audio_marker != -1 &&
          distance < (cur_video_dur - 0.5)
          ) {
            media_list.trimEnd(i, Math.min(distance, cur_video_dur));
        }
      }

    }

    duration += cur_video_dur;
  }

  return media_list.get();

}
