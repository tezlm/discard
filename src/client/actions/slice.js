import Slice from "../matrix/slice.js";

export function get(room) {
  if (state.roomSlices.has(room.id)) {
    return state.roomSlices.get(room.id);
  } else {
    const slice = new Slice(room.events.live);
    state.roomSlices.set(room.id, slice);
    return slice;
  }
}

export async function backwards() {
  const slice = actions.slice.get(state.rooms.get(state.focusedRoomId));
  const top = slice.events[0]?.id;
  await slice.backwards(Math.floor(window.innerHeight / 32 * 4));
  const success = top !== slice.events[0]?.id;
  if (success) state.slice.set(slice);
  return success;
}

export async function forwards() {
  const slice = actions.slice.get(state.rooms.get(state.focusedRoomId));
  const bottom = slice.events.at(-1)?.id;
  await slice.forwards(Math.floor(window.innerHeight / 32 * 4));
  const success = bottom !== slice.events.at(-1)?.id;
  if (success) state.slice.set(slice);
  return success;
}

export async function jump(_roomId, eventId) {  
  // const slice = actions.slice.get(state.focusedRoomId);
  // if (!slice.events.find(i => i.eventId === eventId)) {
  //   await slice.jump(eventId);
  // }
  
  state.roomState.focused.set(eventId);
}
