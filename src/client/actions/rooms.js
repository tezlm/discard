import { writable, get } from "svelte/store";
import TimelineSet from "../matrix/timeline.js";
import { Room } from "../../util/rooms.js";

const roomStates = new Map();

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
  if (!state.rooms.has(roomId)) return state.log.warn(`couldn't find room ${roomId} (set accountData)`);
  state.rooms.get(roomId).accountData.set(type, content);
  
  if (type === "m.fully_read" && state.syncer.status !== "starting") {
    update();
    // actions.spaces.update();
  }
}

export function handleJoin(roomId, events, batch) {
  roomStates.set(roomId, events);
  state.roomTimelines.set(roomId, new TimelineSet(roomId, batch));  
  update();
  // actions.spaces.update();
}

export function handleState(roomId, event) {
  const room = state.rooms.get(roomId);
  room?.handleState(event);
  if (state.syncer.status !== "starting") {
    update();
    // if (event.type === "m.space.child") actions.spaces.update();    
  }
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
  // actions.spaces.update();
  update();
  state.navRooms.set(state.spaces.get(state.focusedSpaceId ?? "orphanRooms"));
}

// TODO: optimize, don't recreate everything over and over again
export function update() {
  for (let [id, data] of roomStates.entries()) {
    if (state.rooms.has(id)) {
      const room = state.rooms.get(id);
      for (let ev of data) room.handleState(ev, true);
    } else {
      const room = new Room(id, data);
      state.rooms.set(id, room);
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
  state.log.debug("set room for " + room?.roomId);
  
  if (room) {
  	if (!states.has(room.roomId)) states.set(room.roomId, getDefaultState());
        
    const newState = states.get(room.roomId);
    for (let key in newState) {
    	state.roomState[key].set(newState[key]);
    }
    
    const timeline = state.roomTimelines.get(room.roomId).live;
    if (!timeline.length) await timeline.backwards();
    state.log.debug("set slice for " + room?.roomId);
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
