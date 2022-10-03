import { writable, get } from "svelte/store";
import TimelineSet from "../matrix/timeline.js";

const roomStates = new Map();

export function handleAccount(roomId, type, content) {
  if (type === "m.fully_read" && state.syncer.status !== "starting") {
    update();
  }
}

export function handleJoin(room, batch) {
  state.rooms.set(room.id, room)
  state.roomTimelines.set(room.id, new TimelineSet(room.id, batch));  
}

export function handleState(roomId, event) {
  if (state.syncer.status !== "starting") {
    update();
  }
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
  state.rooms.delete(roomId);
  actions.spaces.update();
  update();
  state.navRooms.set(state.spaces.get(state.focusedSpaceId ?? "orphanRooms"));
}

export function update() {
  actions.spaces.update();
  state.navRooms.set(state.spaces.get(state.focusedSpaceId ?? "orphanRooms"));
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
