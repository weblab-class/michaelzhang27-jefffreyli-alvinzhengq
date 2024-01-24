import { MediaList } from "../types";

export default class MediaListWrapper {
  list: MediaList;

  constructor(list: MediaList) {
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
