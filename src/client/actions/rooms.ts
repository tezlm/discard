import { writable, get } from "svelte/store";
import type { Room } from "discount";

export function handleAccount(_: void, event: { type: string, content: any }) {
  if (event.type === "m.fully_read") {
    actions.spaces.refresh();
  }
}

export function handleJoin(room: Room) {
  state.rooms.set(room.id, room);
  if (state.client.status !== "starting") actions.spaces.update();
}

export function handleState(_: void) {
  actions.spaces.refresh();
}

export function handleLeave(roomId: string) {
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
  if (state.client.status !== "starting") actions.spaces.update();
}

export function markRead(room: Room, eventId?: string) {
	  const lastId = eventId ?? room.events.live.at(-1)?.id;
    if (!lastId) return;
	  state.log.debug(`mark ${lastId} as read`);
	  room.accountData.set("m.fully_read", { event_id: lastId });
    state.api.sendReceipt(room.id, lastId);
    if (!eventId) state.api.fetch("POST", `/rooms/${encodeURIComponent(room.id)}/receipt/m.read.private/${encodeURIComponent(lastId)}`, { thread_id: "main" });
    if (state.focusedRoomId === room.id) state.slice.set(state.roomSlices.get(room.id));
}

export async function focus(room: Room) {
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
