import { Event } from "discount";
import type { Room } from "discount";

function reslice(room: Room, force = false) {
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

export function send(room: Room, type: string, content: any) {
  const id = `~${Math.random().toString(36).slice(2)}`;
  
  const temp = new Event(room, {
    event_id:         id,
    sender:           state.userId,
    origin_server_ts: Date.now(),
    type,
    content,
    unsigned: {},
  });
  temp.flags.add("sending");
  room.events.live.push(temp);
  reslice(room);
  
  room.accountData.set("m.fully_read", id);
  state.slice.set(state.roomSlices.get(room.id));
  state.api.sendEvent(room.id, type, content, id);
}

export function handle(event: Event, toStart = false) {
  if (event.type === "m.room.redaction") return toStart ? null : redact(event);
  if (event.unsigned?.redacted_because) return;
    
  const { id, room } = event;
  if (!event.room) console.log("event with no room?", event);
  
  // event echo, update local status
  if (event.unsigned?.transaction_id) {
    const tx = event.unsigned.transaction_id;
    const timeline = room.events.live;
    const idx = timeline.findLastIndex(i => i.id === tx);
    console.log("got event with transaction id", tx, "of index", idx);
    if (idx !== -1) {
      state.log.matrix(`successfully sent to ${id} in ${room.id} (for ${tx})`);
      timeline.splice(idx, 1, ...timeline.splice(timeline.lastIndexOf(event), 1));
      
      // const slice = state.roomSlices.get(room.id);
      // const sliceIdx = slice.events.lastIndexOf(dummy);
      // if (sliceIdx !== -1) slice.events.splice(sliceIdx, 1);
      // if (idx === timeline.length - 1) slice.end = id;
      // slice.reslice();
      
      room.accountData.set("m.fully_read", id);
      state.api.sendReceipt(room.id, id);
      // if (state.focusedRoomId === room.id) state.slice.set(slice);
      reslice(room, true);
      return;
    }
  }
  reslice(room);
}

function redact(event: Event) {
  const id = event.raw.redacts ?? event.content.redacts;
  state.log.debug(`handle redaction in ${event.room.id} for ${id}`);
  reslice(event.room);
  
  
  // const timeline = event.room.events.live;
  // const index = timeline.lastIndexOf(event);
  // if (index !== -1) {
    // timeline.splice(index, 1);
  
    // const slice = actions.slice.get(event.room);
    // if (slice.end === id) slice.end = timeline.at(-1);
    // TODO: edge case?
    // if (slice.start === id) slice.start = timeline[0];
    
    // const sliceIndex = slice.events.findIndex(i => i.id === id);
    // if (sliceIndex !== -1) slice.events.splice(sliceIndex, 1);
    // state.slice.set(slice);
    reslice(event.room);
  // }
}
