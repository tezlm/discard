// this code is awful and really should be refactored - maybe removed completely

import Slice from "../matrix/slice";

export function get(room) {
  if (state.roomSlices.has(room.id)) {
    return state.roomSlices.get(room.id);
  } else if (room.events.live) {
    const slice = new Slice(room.events.live);
    state.roomSlices.set(room.id, slice);
    return slice;
  } else {
    return null;
  }
}

export async function backwards() {
  const slice = actions.slice.get(state.rooms.get(state.focusedRoomId));
  if (!slice) return false;
  const top = slice.events[0]?.id;
  // await slice.backwards(Math.floor(window.innerHeight / 32 * 4));
  await slice.backwards(100); // TODO: calculate exactly how many events to rewind
  const success = top !== slice.events[0]?.id;
  if (success) state.slice.set(slice);
  return success;
}

export async function forwards() {
  const room = state.rooms.get(state.focusedRoomId);
  const slice = actions.slice.get(room);
  if (!slice) return false;
  const bottom = slice.events.at(-1)?.id;
  if (room.events.live?.find(i => i.id === bottom)) {
    state.roomSlices.set(get(state.rooms.get(state.focusedRoomId)));
    state.slice.set(get(state.rooms.get(state.focusedRoomId)));
  }
  // await slice.forwards(Math.floor(window.innerHeight / 32 * 4));
  await slice.forwards(100);
  const success = bottom !== slice.events.at(-1)?.id;
  if (success) state.slice.set(slice);
  return success;
}

export async function jump(roomId, eventId) {
  const room = state.rooms.get(roomId);
  const timeline = await room.events.fetchTimeline(eventId);
  const slice = new Slice(timeline);
  state.roomSlices.set(room.id, slice);
  state.slice.set(slice);
  state.roomState.focused.set(eventId);
}
