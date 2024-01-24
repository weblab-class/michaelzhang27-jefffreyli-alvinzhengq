type VideoList = Array<{
  name: string;
  id: string;
  duration: string;
  startDelta: number;
  endDelta: number;
  flex: boolean;
}>;

export default class VideoListWrapper {
  list: VideoList;

  constructor(list: VideoList) {
    this.list = list;
  }

  get() {
    return this.list;
  }

  // TODO:
  hasMarker(index: number) {
    // should indicate whether or not the current clip has a marker on it
    return true;
  }

  getMarkerLocation(index: number) {
    return 4.0;
  }

  trimStart(index: number, delta: number) {
    this.list[index].startDelta += delta;
  }

  trimEnd(index: number, delta: number) {
    this.list[index].endDelta += delta;
  }

  setTrimStart(index: number, delta: number) {
    this.list[index].startDelta = delta;
  }

  setTrimEnd(index: number, delta: number) {
    this.list[index].endDelta = delta;
  }
}
