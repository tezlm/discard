import { writable } from "svelte/store";
import Store from "./matrix/store.js";

const store = new Store();
await store.init();

const log = {
  ui: (info) => console.info("%c[discard]%c " + info, "font-weight: bold; color: magenta", ""),
  matrix: (info) => console.info("%c[discount]%c " + info, "font-weight: bold; color: yellow", ""),
  debug: (info) => console.info("%c[debug]%c " + info, "font-weight: bold; color: turquoise", ""),
  error: (info) => console.error("%c[error]%c " + info, "font-weight: bold; color: red", ""),
};

export default {
  api: null,
  syncer: null,
  userId: null,
  store: store,
  log: log,
  scene: writable(null),
  popup: writable({}),
  
  // rooms/nav
  rooms: new Map(),
  spaces: new Map(),
  dms: new Map(),
  navRooms: writable([]),
  navSpaces: writable([]),
  selectedRoom: writable(null),
  focusedRoom: writable(null),
  focusedSpace: writable(null),
  focusedRoomId: null, // DEPRECATED: don't use this for any new code. will be removed in the future
  recentRooms: [],
  
  // timeline/events
  events: store.events, // TODO: move to `store` for offline support?
  roomTimelines: new Map(),
  roomSlices: new Map(),
  roomStates: new Map(),
  roomState: null,
  
  // timeline
  // DEPRECATED: each room now has its own timeline/slice
  timeline: [],
  sliceStart: null,
  sliceEnd: null,
  slice: writable([]),
  sliceRef: [],
  
  // cache
  missingAvatars: new Set(),
};
