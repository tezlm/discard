import { writable } from "svelte/store";

export default {
  rooms: writable([]),
  focusedRoom: writable(null),
  focusedRoomId: null,
  timeline: writable([]),
  scene: writable(null),
  client: null,
};
