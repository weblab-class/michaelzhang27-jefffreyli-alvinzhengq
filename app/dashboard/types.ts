
export enum MediaType {
    Audio = 0,
    Video = 1,
}

export type MediaFile = {
    display_name: string,
    id: string,
    url: string,
    type: MediaType,
    duration: string,
    startDelta: number,
    endDelta: number
}

export type MediaList = Array<MediaFile>