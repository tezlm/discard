import "../../util/push.js";
// this module handles the recieved events from sync
import Event from "../../util/events.js";
import TimelineSet from "../matrix/timeline.js";

const relations = new Map();

// TODO: multiple relations
// TODO: what does this code even do i forgot
// TODO: move code into event
// FIXME: sometimes replies are dropped
const skip = ["m.in_reply_to", "net.maunium.reply"];
function getRelation(content) {
  const relation = content["m.relates_to"];
  if (!relation) return null;
  if (relation.rel_type && !skip.includes(relation.rel_type)) {
  // if (relation.rel_type) {
    return relation;
  } else {
    const type = Object.keys(relation)?.[0];
    if (!type || skip.includes(type)) return null;
    // if (!type) return null;
    return { rel_type: type, ...relation[type] };
  }
}

function queueRelation(id, event, toStart) {
  if (!relations.has(id)) relations.set(id, []);
  relations.get(id)[toStart ? "unshift" : "push"](event);
}

function getTimeline(roomId) {
  return state.roomTimelines.get(roomId).live;
}

function addToTimeline(roomId, eventId, toStart = false) {
  if (!state.roomTimelines.has(roomId)) state.roomTimelines.set(roomId, new TimelineSet(roomId));
  
  const slice = actions.slice.get(roomId);
  const atEnd = slice.atEnd();
  const timeline = getTimeline(roomId);
  timeline[toStart ? "unshift" : "push"](eventId);
  if (atEnd && !toStart) {
    slice.events.push(state.events.get(eventId));
    slice.end = eventId;

    const startIndex = timeline.lastIndexOf(slice.start);
    if (slice.events.length > 50 && startIndex >= 0) {
      slice.start = timeline[startIndex + 1];
      slice.events.shift();
    }
  
    if (state.focusedRoomId === roomId) state.slice.set(slice);
  }
}

export function send(roomId, type, content) {
  const id = `~${Math.random().toString(36).slice(2)}`;
  const room = state.rooms.get(roomId);
  
  const temp = new Event(room, {
    event_id:         id,
    sender:           state.userId,
    origin_server_ts: new Date(),
    type,
    content,
  });
  temp.flags.add("sending");
  state.events.set(id, temp);
  addToTimeline(roomId, id);
  
  state.rooms.get(roomId).accountData.set("m.fully_read", id);
  state.slice.set(state.roomSlices.get(roomId));
  state.api.sendEvent(roomId, type, content, id);
}

export function handle(roomId, raw, toStart = false) {
  if (raw.type === "m.room.redaction") return toStart ? null : redact(roomId, raw);
  if (raw.unsigned?.redacted_because) return;
    
  const id = raw.event_id;
  if (state.events.has(raw.event_id)) return;
  const room = state.rooms.get(roomId);
  
  // event echo, update local status
  if (raw.unsigned?.transaction_id) {
    const tx = raw.unsigned.transaction_id;
    const original = state.events.get(tx);
    if (original) {
      state.log.matrix(`successfully sent to ${id} in ${roomId} (for ${tx})`);
      original.raw = raw;
      original.flags.delete("sending");
      state.events.set(id, original);
      
      const timeline = getTimeline(roomId);
      const slice = state.roomSlices.get(roomId);
      const index = timeline.lastIndexOf(tx);
      timeline[index] = id;
      if (index === timeline.length - 1) slice.end = id;
      
      state.rooms.get(roomId).accountData.set("m.fully_read", id)
      state.api.sendReceipt(roomId, id);
      if (roomId === state.focusedRoomId) state.slice.set(slice);
      return;
    }
  }
  
  const event = new Event(room, raw);
  const relation = getRelation(raw.content);
  if (relation) {
    const original = state.events.get(relation.event_id);
    if (original) {
      if (relation.rel_type === "m.replace") {
        original.parseRelation(event, relation.rel_type);
      } else if (relation.rel_type === "m.annotation") {
        const key = relation.key;
        if (!original.reactions) original.reactions = new Map();
        if (!original.reactions.has(key)) original.reactions.set(key, []);
        original.reactions.get(relation.key).push(event);
      } else {
        original.parseRelation(event, relation.rel_type);
      }
    } else {
      return queueRelation(relation.event_id, event, toStart);
    }
    state.events.set(id, event);
    const slice = actions.slice.get(roomId);
    slice.reslice();
    if (roomId === state.focusedRoomId) state.slice.set(slice);
  } else {
    state.events.set(id, event);
    addToTimeline(roomId, id, toStart);
    // if (state.api.status === "syncing") {
    //   actions.rooms.update();
    //   actions.spaces.update();
    // }
    if (relations.has(id)) {
      for (let ev of relations.get(id)) {
        const relation = getRelation(ev.content);
        if (relation.rel_type === "m.replace") {
          event.parseRelation(ev, relation.rel_type);
        } else if (relation.rel_type === "m.annotation") {
          const key = relation.key;
          if (!event.reactions) event.reactions = new Map();
          if (!event.reactions.has(key)) event.reactions.set(key, []);
          event.reactions.get(relation.key).push(ev);
        } else {
          event.parseRelation(ev, relation.rel_type);
        }
      }
      relations.delete(id);
    }
  }
}

export function redact(roomId, event) {
  const id = event.redacts ?? event.content.redacts;
  if (!state.events.has(id)) return;
  state.log.debug(`handle redaction in ${roomId} for ${id}`);
  
  const [timeline, index] = state.roomTimelines.get(roomId).for(id);
  if (index) {
    timeline.splice(index, 1);
  
    const slice = actions.slice.get(roomId);
    if (slice.end === id) slice.end = timeline.at(-1);
    // TODO: edge case?
    // if (slice.start === id) slice.start = timeline[0];
    
    const sliceIndex = slice.events.findIndex(i => i.eventId === id);
    if (sliceIndex !== -1) slice.events.splice(sliceIndex, 1);
    state.slice.set(slice);
  } else if (state.events.has(id)) {
    const original = state.events.get(id);
    const slice = actions.slice.get(roomId);
    const relation = getRelation(original.content);
    if (relation?.rel_type === "m.annotation") {
      const rel = state.events.get(relation.event_id);
      const reactions = rel?.reactions;
      if (!reactions) return;
      if (!reactions.has(relation.key)) return;
      const idx = reactions.get(relation.key).findIndex(i => i.eventId === original.eventId);
      if (idx >= 0) reactions?.get(relation.key).splice(idx, 1);
      if (reactions.get(relation.key).length === 0) rel.reactions.delete(relation.key);
      if (reactions.size === 0) rel.reactions = null;
      slice.reslice();
      state.slice.set(slice);
    }
    
    state.events.delete(id);  
  }  
}
