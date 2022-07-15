import { writable } from "svelte/store";
// import Events from "./state/events.js";
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
  rooms: writable(new Map()),
  spaces: writable(new Map()),
  dms: new Map(),
  focusedRoom: writable(null),
  focusedRoomId: null,
  focusedSpace: writable(null),
  recentRooms: [],
  
  // events
  // events: new Events(), // TODO: move to `store` for offline support?
  events: store.events,
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
