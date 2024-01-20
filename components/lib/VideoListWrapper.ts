
type VideoList = Array<{
    name: string,
    id: string,
    duration: string,
    startDelta: number,
    endDelta: number
}>

export default class VideoListWrapper {
    list: VideoList

    constructor(list: VideoList) {
        this.list = list
    }

    get() {
        return this.list
    }

    trimStart(index: number, delta: number) {
        this.list[index].startDelta += delta
    }

    trimEnd(index: number, delta: number) {
        this.list[index].endDelta += delta
    }

    setTrimStart(index: number, delta: number) {
        this.list[index].startDelta = delta
    }

    setTrimEnd(index: number, delta: number) {
        this.list[index].endDelta = delta
    }
}