import { writable } from "svelte/store";

export default {
  client: null,
  scene: writable(null),
  popup: writable({}),
  
  // rooms/nav
  rooms: writable([]),
  spaceMap: writable(new Map()),
  focusedRoom: writable(null),
  focusedRoomId: null,
  focusedSpace: writable(null),
  invitedRooms: writable([]),
  
  // messages
  replyEvent: writable(null),
  focusedEvent: writable(null), // coming soon...
  editingEvent: writable(null), // coming soon...
  timeline: writable([]),
  timelineRef: [],
};
