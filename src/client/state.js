import { writable } from "svelte/store";

export default {
  rooms: writable([]),
  spaceMap: writable(new Map()),
  focusedRoom: writable(null),
  focusedRoomId: null,
  focusedSpace: writable(null),
  timeline: writable([]),
  scene: writable(null),
  client: null,
};
