import VideoListWrapper from "../lib/MediaListWrapper";

export default async function untrim_handler(video_list: VideoListWrapper): Promise<void> {
    for (let i = 0; i < video_list.get().length; i++) {
        video_list.setTrimStart(i, -2);
    }
}