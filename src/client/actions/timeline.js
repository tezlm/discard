// this module handles the recieved events from sync
import Slice from "../matrix/slice.js";
import { format } from "../../util/events.js";

// const supportedEvents = ["m.room.create", "m.room.message", "m.reaction"];
const supportedEvents = ["m.room.create", "m.room.message"];
// const relations = new Map();

// function getRelation(event) {
//   const relation = event.content["m.relates_to"];
//   for (let key in relation) {
//     return { rel_type: key, event_id: relation[key].event_id, key: relation[key].key }
//   }
// }

// function queueRelation(id, event) {
//   if (!relations.has(id)) relations.set(id, []);
//   relations.get(id).push(event);
// }

export function getTimeline(roomId) {
  return state.roomTimelines.get(roomId).live;
}

function addToTimeline(roomId, eventId, toStart = false) {
  if (!state.roomSlices.has(roomId)) {
    const slice = new Slice(state.roomTimelines.get(roomId));
    state.roomSlices.set(roomId, slice);
  }
  
  const slice = state.roomSlices.get(roomId);
  const atEnd = slice.atEnd();
  const timeline = getTimeline(roomId);
  timeline[toStart ? "unshift" : "push"](eventId);
  if (atEnd && !toStart) {
    slice.events.push(state.events.get(eventId));
    slice.end = eventId;

    const startIndex = timeline.lastIndexOf(slice.start);
    if (startIndex >= 0) {
      slice.end = timeline[startIndex + 1];
      slice.events.shift();
    }
  
    if (state.focusedRoomId === roomId) state.slice.set(slice);
  }
}

export function send(roomId, type, content) {
  const id = `~${Math.random().toString(36).slice(2)}`;
  
  const temp = format(roomId, {
    event_id:         id,
    sender:           state.userId,
    origin_server_ts: new Date(),
    type,
    content,
  });
  temp.special = "sending";
  state.events.set(id, temp);
  addToTimeline(roomId, id);
  
  state.api.sendEvent(roomId, type, content, id);
}

export function handle(roomId, event, toStart) {
  if (event.type === "m.room.redaction" && !toStart) return redact(roomId, event);
  if (!supportedEvents.includes(event.type)) return;
  if (event.unsigned?.redacted_because) return;
  const id = event.event_id;
  
  // event echo, update local status
  if (event.unsigned?.transaction_id) {
    const tx = event.unsigned.transaction_id;
    const original = state.events.get(tx);
    if (original) {
      original.eventId = id;
      original.special = null;
      state.events.set(id, original);
      
      const timeline = getTimeline(roomId);
      const slice = state.roomSlices.get(roomId);
      const index = timeline.lastIndexOf(tx);
      timeline[index] = id;
      if (index === timeline.length - 1) slice.end = id;
      state.slice.set(slice);      
      return;
    }
  }
  
  // TODO: get relations to work again
  // if (getRelation(event.content)) {
  //     const { rel_type: type, event_id: relId, key } = getRelation(event);
  //     const original = state.events.get(relId);
  //     if (!original) return queueRelation(relId, event);
  //     if (type === "m.replace") {
  //       // TODO: invert current method of edits
  //       // instead of replacing with an edit event with `original`
  //       // keep the original with `edit` 
  //       const index = timeline.lastIndexOf(relId);
  //       if (index < 0) return queueRelation(relId, event);
  //       state.events.set(id, {
  //         ...format(event),
  //         content: { ...original.content, ...event.getContent()["m.new_content"] },
  //         original,
  //       });
  //     } else if (type === "m.annotation") {
  //       const [count, selfReacted] = original.reactions.get(key) ?? [0, false];
  //       original.reactions.set(key, [count + 1, selfReacted || event.getSender() === state.client.getUserId()]);
  //     }
  // } else {
  
  // TODO: update on state events
  state.events.set(id, format(roomId, event));
  addToTimeline(roomId, id, toStart);
  
  //   if (relations.has(id)) {
  //     for (let relation of relations.get(id)) add(relation);
  //     relations.delete(id);
  //   }
  // }
}

export function redact(roomId, event) {
  const id = event.redacts ?? event.content.redacts;
  if (!state.events.has(id)) return;
  state.log.debug(`handle redaction in ${roomId} for ${id} ${state.sliceEnd === id}`);
  
  const [timeline, index] = state.roomTimelines.get(roomId).for(id);
  timeline.splice(index);
  
  const slice = state.roomSlices.get(roomId);
  if (slice.end === id) slice.end = state.timeline.at(-1);
  const sliceIndex = slice.events.findIndex(i => i.eventId === id);
  if (sliceIndex !== -1) slice.events.splice(sliceIndex);
  state.slice.set(slice);
}

export function handleEphermeral(roomId, event) {
  // TODO
}
