import VideoListWrapper from "../lib/VideoListWrapper";

export default async function trim_handler(video_list: VideoListWrapper): Promise<void> {
    for (let i = 0; i < video_list.get().length; i++) {
        video_list.setTrimStart(i, 2);
        
        // or we can do:
        /**
         * video_list.trimStart(i, 0.5);
         * video_list.trimStart(i, 1.5);
         */
    }
}