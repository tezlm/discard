import { writable } from "svelte/store";

export default {
  client: null,
  scene: writable(null),
  popup: writable({}),
  
  // rooms/nav
  rooms: writable([]),
  dms: new Map(),
  spaceMap: writable(new Map()),
  focusedRoom: writable(null),
  focusedRoomId: null,
  focusedSpace: writable(null),
  
  // messages
  replyEvent: writable(null),
  focusedEvent: writable(null), // coming soon...
  editingEvent: writable(null), // coming soon...
  fileUpload: writable(null), // coming soon...

  // timeline
  timeline: [],
  sliceStart: null,
  sliceEnd: null,
  slice: writable([]),
  sliceRef: [],
};
