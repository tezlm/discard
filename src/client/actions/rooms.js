import { get } from "svelte/store";
import TimelineSet from "../matrix/timeline.js";
import { formatRoom } from "../../util/rooms.js";

const rooms = new Map(); // TODO: store object instead of just Array<stateEvent>
const roomAccounts = new Map();

export function save() {
  for (let [id, data] of rooms) {
    state.store.rooms.set(id, data);
  }
}

export function load() {
  // console.log(state.store.rooms.all(id));
  // .then(state => rooms.set(id, state));
  // state.store
}

// TODO: cleanup, set directly on room
export function handleAccount(roomId, type, content) {
  state.log.debug(`set ${type} to ${JSON.stringify(content)} in ${roomId}`);
  if (!roomAccounts.has(roomId)) roomAccounts.set(roomId, new Map());
  roomAccounts.get(roomId).set(type, content);
  
  if (type === "m.fully_read") {
    update();
    actions.spaces.update();
  }
}

export function handleJoin(roomId, event, batch) {
  const isNew = !rooms.has(roomId);
  if (isNew) rooms.set(roomId, []);
  if (!state.roomTimelines.has(roomId)) state.roomTimelines.set(roomId, new TimelineSet(roomId, batch));
  
  const roomState = rooms.get(roomId);
  const index = roomState.findIndex(i => i.type === event.type && i.state_key === event.state_key);
  if (index >= 0) {
    roomState[index] = event;
  } else {
    roomState.push(event);
  }
  
  update();
  if (isNew || event.type === "m.space.child") actions.spaces.update();
}

export function handleInvite(roomId, event) {
  // TODO: invited rooms
}

export function handleLeave(roomId) {
  const space = get(state.focusedSpace)?.roomId;
  if (roomId === space) {
    state.focusedSpace.set(null);
    state.focusedRoomId = null;
    state.focusedRoom.set(null);
  }
  if (roomId === state.focusedRoomId) {
    state.focusedRoomId = null;
    state.focusedRoom.set(null);
  }
  rooms.delete(roomId);
  state.rooms.delete(roomId);
  actions.spaces.update();
  update();
  state.navRooms.set(state.spaces.get(space ?? "orphanRooms"));
}

export function update() {
  if (state.syncer.status === "starting") return;
  
  for (let [id, data] of rooms.entries()) {
    state.rooms.set(id, formatRoom(id, data, roomAccounts.get(id)));
  }
}
