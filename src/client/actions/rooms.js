import { writable, get } from "svelte/store";

export function handleAccount(_, event) {
  if (event.type === "m.fully_read" && state.syncer.status !== "starting") {
    update();
  }
}

export function handleJoin(room) {
  state.rooms.set(room.id, room);
}

export function handleState(_) {
  if (state.syncer.status !== "starting") update();
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
  state.log.ui("set focused room to " + room?.id);
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
  
  state.focusedRoomId = room?.id ?? null;
  state.focusedRoom.set(room);
  state.log.debug("set room for " + room?.id);
  
  if (room) {
  	if (!states.has(room.id)) states.set(room.id, getDefaultState());
        
    const newState = states.get(room.id);
    for (let key in newState) {
    	state.roomState[key].set(newState[key]);
    }
    
    const timeline = room.events.live;
    if (!timeline.length) await timeline.fetch("backwards");
    state.log.debug("set slice for " + room.id);
    state.slice.set(actions.slice.get(room));
    
    // update recent rooms
    const recent = state.recentRooms;
    const recentIndex = recent.findIndex(i => i.id === room.id);
    if (recentIndex >= 0) recent.splice(recentIndex, 1);
    recent.unshift(room);
    if (recent.length > 8) recent.pop();
  }  
}

export function getDefaultState() {
  return {
    input: "",
    rows: 1,
    reply: null,
    edit: null,
    focused: null,
    upload: null,
    typing: [],
    slice: [],
    search: null,
  };
}
