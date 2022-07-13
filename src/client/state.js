import { writable } from "svelte/store";
import Events from "./state/events.js";

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
  recentRooms: [],
  
  // events
  events: new Events(),
  roomTimelines: new Map(),
  roomStates: new Map(),
  roomState: null,
  
  // timeline
  timeline: [],
  sliceStart: null,
  sliceEnd: null,
  slice: writable([]),
  sliceRef: [],
  
  // cache
  missingAvatars: new Set(),
};
