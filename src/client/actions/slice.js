import Slice from "../matrix/slice.js";

export function isAtEnd() {
  const endIndex = state.timeline.lastIndexOf(state.sliceEnd);
  return endIndex === state.timeline.length - 1;
}

export function reslice() {
  const startIndex = state.timeline.lastIndexOf(state.sliceStart);
  const endIndex = state.timeline.lastIndexOf(state.sliceEnd);
  return state.timeline.slice(startIndex, endIndex + 1);
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
