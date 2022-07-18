// this module handles the recieved data from sync
import { get } from "svelte/store";

export function handleAccount(type, content) {
  // console.log(type, content);
  // TODO
}

export function handleRoomAccount(roomId, type, content) {
  actions.rooms.handleAccount(roomId, type, content);
}

export function handleEvent(roomId, event, toStart) {
  actions.timeline.handle(roomId, event, toStart);
}

export function handleEphermeral(roomId, event) {
  // console.log(roomId, event);
  // TODO
}

export function handleState(roomId, event, batch) {
  actions.rooms.handleJoin(roomId, event, batch);
}

export function handleNotis(roomId, pings) {
  const room = state.rooms.get(roomId);
  if (room) {
    room.pings = pings;
    const space = get(state.focusedSpace)?.roomId ?? "orphanRooms";
    state.navRooms.set(state.spaces.get(space));
  }
}
