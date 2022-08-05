// this module handles the recieved data from sync
import { get } from "svelte/store";

export function handleRoomAccount(roomId, type, content) {
  actions.rooms.handleAccount(roomId, type, content);
}

export function handleEvent(roomId, event, toStart) {
  actions.timeline.handle(roomId, event, toStart);
}

export function handleEphermeral(roomId, type, content) {
  if (type !== "m.typing") return;
  
  const roomState = state.roomStates.get(roomId);
  if (!roomState) return;
  roomState.typing = content.user_ids;
  if (roomId === state.focusedRoomId) {
    state.roomState.typing.set(content.user_ids);
  }
}

export function handleInvite(roomId) {
  // TODO
}

export function handleLeave(roomId) {
  actions.rooms.handleLeave(roomId);
}

export function handleNotis(roomId, pings) {
  const room = state.rooms.get(roomId);
  if (room) {
    room.pings = pings;
    const space = get(state.focusedSpace)?.roomId ?? "orphanRooms";
    state.navRooms.set(state.spaces.get(space));
  }
}
