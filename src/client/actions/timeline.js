// this module handles the recieved events from sync
import { format } from "../../util/events.js";
import TimelineSet from "../matrix/timeline.js";

const supportedEvents = [
  "m.room.create", "m.room.name", "m.room.topic", "m.room.pinned_events", "m.room.canonical_alias",
  "m.room.message", "m.sticker",
  "m.reaction", "m.room.member",
];

const relations = new Map();

// TODO: multiple relations
function getRelation(content) {
  const relation = content["m.relates_to"];
  if (!relation) return null;
  if (relation.rel_type && relation.rel_type !== "m.in_reply_to") {
    return relation;
  } else {
    const type = Object.keys(relation)?.[0];
    if (!type || type === "m.in_reply_to") return null;
    return { rel_type: type, ...relation[type] };
  }
}

function queueRelation(id, event) {
  if (!relations.has(id)) relations.set(id, []);
  relations.get(id).push(event);
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
  
  state.rooms.get(roomId).readEvent = id;
  state.slice.set(state.roomSlices.get(roomId));
  state.api.sendEvent(roomId, type, content, id);
}

export function handle(roomId, event, toStart = false) {
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
      
      state.rooms.get(roomId).readEvent = id;
      state.api.sendReceipt(roomId, id);
      if (roomId === state.focusedRoomId) state.slice.set(slice);
      return;
    }
  }
  
  const relation = getRelation(event.content);
  if (relation) {
    const original = state.events.get(relation.event_id);
    if (!original) return queueRelation(relation.event_id, event);
    if (relation.rel_type === "m.replace") {
        // TODO: invert current method of edits
        // instead of replacing with an edit event with `original`
        // keep the original with `edit`
        state.events.set(relation.event_id, {
          ...format(roomId, event),
          content: { ...original.content, ...event.content["m.new_content"] },
          eventId: original.eventId, // this is why the todo exists
          original,
        });
    } else if (relation.rel_type === "m.annotation") {
      const key = relation.key;
      if (!original.reactions) original.reactions = new Map();
      if (!original.reactions.has(key)) original.reactions.set(key, { count: 0, senders: new Set(), mine: null });
      const reaction = original.reactions.get(relation.key);
      if (event.sender === state.userId) reaction.mine = id;
      reaction.senders.add(event.sender);
      reaction.count++;
    }
    state.events.set(id, format(roomId, event));
    const slice = actions.slice.get(roomId);
    slice.reslice();
    if (roomId === state.focusedRoomId) state.slice.set(slice);
  } else {
    state.events.set(id, format(roomId, event));
    addToTimeline(roomId, id, toStart);
    actions.rooms.update();
    actions.spaces.update();
    if (relations.has(id)) {
      for (let relation of relations.get(id)) handle(roomId, relation);
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
  } else {
    const original = state.events.get(id);
    const slice = actions.slice.get(roomId);
    const relation = getRelation(original.content);
    if (relation?.rel_type === "m.annotation") {
      const reactions = state.events.get(relation.event_id)?.reactions;
      const reaction = reactions?.get(relation.key);
      if (!reaction) return;
      reaction.count--;
      reaction.senders.delete(original.sender.userId);
      if (original.sender.userId === state.userId) reaction.mine = null;
      if (reaction.count === 0) {
        reactions.delete(relation.key);
        if (reactions.size === 0) state.events.get(relation.event_id).reactions = null;
      }
      slice.reslice();
      state.slice.set(slice);
    }    
  }
  
  state.events.delete(id);
}
