import Slice from "../matrix/slice.js";

export function get(roomId) {
  if (state.roomSlices.has(roomId)) {
    console.log(state.roomSlices.get(roomId))
    return state.roomSlices.get(roomId);
  } else {
    console.log("creating new slice...")
    const slice = new Slice(state.roomTimelines.get(roomId));
    state.roomSlices.set(roomId, slice);
    return slice;
  }
}

export async function backwards() {
  const slice = state.roomSlices.get(state.focusedRoomId);
  const top = slice.events[0].eventId;
  await slice.backwards();
  const success = top !== slice.events[0].eventId;
  if (success) state.slice.set(slice);
  return success;
}

export async function forwards() {
  const slice = state.roomSlices.get(state.focusedRoomId);
  const bottom = slice.events.at(-1).eventId;
  await slice.forwards();
  const success = bottom !== slice.events.at(-1).eventId;
  if (success) state.slice.set(slice);
  return success;
}

export async function jump(_roomId, eventId) {
  state.roomState.focused.set(eventId);
}
