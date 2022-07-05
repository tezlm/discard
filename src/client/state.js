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
  timeline: writable([]),
  timelineRef: [],

  // timeline
  eventStart: null,
  eventEnd: null,
  slice: writable([]),
};
