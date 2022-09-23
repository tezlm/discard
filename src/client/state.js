import { writable } from "svelte/store";
import Store from "./matrix/store.js";
import Settings from "./matrix/settings.js";

// TODO: reset state on logout


// persist state
const store = new Store();
await store.init();

const log = {
  ui: (info) => console.info("%c[discard]%c " + info, "font-weight: bold; color: magenta", ""),
  matrix: (info) => console.info("%c[discount]%c " + info, "font-weight: bold; color: yellow", ""),
  warn: (info) => console.info("%c[warn]%c " + info, "font-weight: bold; color: yellow", ""),
  debug: (info) => console.info("%c[debug]%c " + info, "font-weight: bold; color: turquoise", ""),
  error: (info) => console.error("%c[error]%c " + info, "font-weight: bold; color: red", ""),
};

const state = {
  api: null,
  syncer: null,
  userId: null,
  store: store,
  log: log,
  
  // layers
  scene: writable({}),
  popup: writable({}),
  popout: writable({}),
  context: writable({}),
  
  // data
  rooms: new Map(),
  spaces: new Map(),
  dms: new Map(),
  settings: writable(new Settings()),
  accountData: writable(new Map()),
  accountDataRef: new Map(),
  pushRules: writable({ parse: () => false }),
  
  //nav
  navRooms: writable([]),
  navSpaces: writable([]),
  selectedRoom: writable(null),
  focusedRoom: writable(null),
  focusedSpace: writable(null),
  focusedSpaceId: null,
  focusedRoomId: null,
  recentRooms: [],
  
  // timeline/events
  roomTimelines: new Map(),
  roomSlices: new Map(),
  roomStates: new Map(),
  roomState: null,
  events: store.events, // TODO: offline support?
  slice: writable(null),
  
  // cache
  missingAvatars: new Set(),
  users: new Map(),
};

// setInterval(() => store.save(state), 1000 * 5);

export default state;
