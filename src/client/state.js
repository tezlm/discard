import { writable } from "svelte/store";
import Events from "./state/events.js";
import Store from "./matrix/store.js";

const store = new Store();
await store.init();

export default {
  api: null,
  syncer: null,
  userId: null,
  store: store,
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
  events: new Events(), // TODO: move to `store` for offline support?
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
