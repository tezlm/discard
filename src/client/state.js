import { writable } from "svelte/store";

export default {
  rooms: writable([]),
  spaceMap: writable(new Map()),
  focusedRoom: writable(null),
  focusedRoomId: null,
  focusedSpace: writable(null),
  invitedRooms: writable([]),
  timeline: writable([]),
  timelineRef: [],
  scene: writable(null),
  client: null,
};
