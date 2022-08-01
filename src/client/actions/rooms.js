import { writable, get } from "svelte/store";
import TimelineSet from "../matrix/timeline.js";
import { formatRoom } from "../../util/rooms.js";

const roomStates = new Map();
const roomAccounts = new Map();

// maybe rename the 2 roomStates? (matrix state and discard state)
// TODO: lazy loading
// export function save() {
//   for (let [id, data] of rooms) {
//     state.store.rooms.set(id, data);
//   }
// }

// export function load() {
//   console.log(state.store.rooms.all(id));
//   .then(state => rooms.set(id, state));
//   state.store
// }

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
  const isNew = !roomStates.has(roomId);
  if (isNew) roomStates.set(roomId, []);
  if (!state.roomTimelines.has(roomId)) state.roomTimelines.set(roomId, new TimelineSet(roomId, batch));
  
  const roomState = roomStates.get(roomId);
  const index = roomState.findIndex(i => i.type === event.type && i.state_key === event.state_key);
  if (index >= 0) {
    roomState[index] = event;
  } else {
    roomState.push(event);
  }  
  
  if (event.type === "m.room.member") state.rooms.get(roomId)?.members.add(event);
  update();
  if (isNew || event.type === "m.space.child") actions.spaces.update();
}

export function handleInvite(roomId, event) {
  // TODO: invited rooms
}

export function handleLeave(roomId) {
  if (roomId === state.focusedSpaceId) {
    state.focusedSpace.set(null);
    state.focusedSpaceId = null;
    state.focusedRoomId = null;
    state.focusedRoom.set(null);
  }
  if (roomId === state.focusedRoomId) {
    state.focusedRoomId = null;
    state.focusedRoom.set(null);
  }
  roomStates.delete(roomId);
  state.rooms.delete(roomId);
  actions.spaces.update();
  update();
  state.navRooms.set(state.spaces.get(state.focusedSpaceId ?? "orphanRooms"));
}

// TODO: optimize, don't recreate everything over and over again
export function update() {
  for (let [id, data] of roomStates.entries()) {
    const formatted = formatRoom(id, data, roomAccounts.get(id));
    if (state.rooms.has(id)) {
      const old = state.rooms.get(id);
      Object.assign(old, {
        ...formatted,
        members: old.members,
      });
    } else {
      state.rooms.set(id, formatted);
    }
    state.navRooms.set(state.spaces.get(state.focusedSpaceId ?? "orphanRooms"));
  }
}

export async function focus(room) {
  state.log.ui("set focused room to " + room?.roomId);
  const states = state.roomStates;
  if (!state.roomState) {
    state.roomState = {};
    const defaultState = getDefaultState();
    for (let key in defaultState) {
    	state.roomState[key] = writable(defaultState[key]);
    }
  } else if (states.has(state.focusedRoomId)) {
    const oldState = states.get(state.focusedRoomId);
    for (let key in state.roomState) {
    	oldState[key] = get(state.roomState[key]);
    }
  }
  
	state.focusedRoomId = room?.roomId ?? null;
	state.focusedRoom.set(room);
  state.log.debug("set room for" + room?.roomId);
  
  if (room) {
  	if (!states.has(room.roomId)) states.set(room.roomId, getDefaultState());
        
    const newState = states.get(room.roomId);
    for (let key in newState) {
    	state.roomState[key].set(newState[key]);
    }
    
    const timeline = state.roomTimelines.get(room.roomId).live;
    if (!timeline.length) await timeline.backwards();
    state.log.debug("set slice for" + room?.roomId);
    state.slice.set(actions.slice.get(room.roomId));
  }

  if (room) {
    const recent = state.recentRooms;
    const recentIndex = recent.findIndex(i => i.roomId === room?.roomId);
    if (recentIndex >= 0) recent.splice(recentIndex, 1);
    recent.unshift(room);
    if (recent.length > 8) recent.pop();
  }
  
  function getDefaultState() {
    return {
      input: "",
      rows: 1,
      reply: null,
      edit: null,
      focused: null,
      upload: null,
      typing: [],
      slice: [],
    };
  }
}
