import { writable } from "svelte/store";
import Settings from "./matrix/settings";
import { getDefaultState } from "./actions/rooms";

// TODO: reset state on logout

const settings = new Settings();

const log = {
  ui: (info) => console.info("%c[discard]%c " + info, "font-weight: bold; color: magenta", ""),
  matrix: (info) => console.info("%c[discount]%c " + info, "font-weight: bold; color: yellow", ""),
  warn: (info) => console.info("%c[warn]%c " + info, "font-weight: bold; color: yellow", ""),
  debug: (info) => console.info("%c[debug]%c " + info, "font-weight: bold; color: turquoise", ""),
  error: (info) => console.error("%c[error]%c " + info, "font-weight: bold; color: red", ""),
};

const defaultRoomState = getDefaultState();
for (let i in defaultRoomState) {
  defaultRoomState[i] = writable(defaultRoomState[i]);
}

const state = {
  api: null,
  syncer: null,
  client: null,
  userId: null,
  log: log,
  
  // layers
  scene: writable({}),
  popup: writable({}),
  popout: writable({}),
  emoji: writable({}),
  context: writable({}),
  
  // data
  rooms: new Map(),
  invites: writable(new Map()),
  spaces: new Map(),
  dms: new Map(),
  settings: writable(settings),
  settingsRef: settings,
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
  roomState: defaultRoomState,
  slice: writable(null),
  
  // cache
  missingAvatars: new Set(),
  users: new Map(),
};

export default state;
