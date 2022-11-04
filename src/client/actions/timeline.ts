import type { Event } from "discount";
import type { Room } from "discount";

export function reslice(room: Room, force = false) {
  if (!room.events.live) throw "this shouldn't happen";
  
  const slice = actions.slice.get(room);
  const atEnd = slice.atEnd();
  
  const timeline = room.events.live;
  if (atEnd || force) {
    slice.end = timeline.at(-1);

    const startIndex = timeline.lastIndexOf(slice.start);
    if (slice.events.length > 50 && startIndex >= 0) {
      slice.start = timeline[startIndex + 1];
    }
    
    slice.reslice();
    if (state.focusedRoomId === room.id) state.slice.set(slice);
  }
}

export function handle(event: Event, toStart = false) {
  if (event.type === "m.room.redaction") return toStart ? null : redact(event);
  if (event.unsigned?.redacted_because) return;
  if (state.client.status === "starting") return;
  reslice(event.room);
}

function redact(event: Event) {
  if (state.client.status === "starting") return;
  reslice(event.room, true);
}
