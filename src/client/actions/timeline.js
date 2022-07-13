import Events from "../state/events.js";
const supportedEvents = ["m.room.create", "m.room.message", "m.reaction"];
const relations = new Map();

function queueRelation(id, event) {
  if (!relations.has(id)) relations.set(id, []);
  relations.get(id).push(event);
}

export function get(roomId) {
  const tls = state.roomTimelines;
  if (!tls.has(roomId)) {
    const tl = [];
    tls.set(roomId, tl);
    for (let event of state.client.getRoom(roomId)?.timeline || []) add(event);
    return tl;
  } else {
    return tls.get(roomId);
  }
}

export function add(event, toBeginning = false) {
  if (!supportedEvents.includes(event.getType())) return;
  if (event.isRedacted()) return;
  if (event.getId() === "$2Hp8ue8W6jhBSoPkCSIdYtdG9oqmZSKfb3_to8R75Is") console.log("ayyy it's ", event.isRedacted()); 
  const id = event.getId();
  const timeline = get(event.getRoomId());
  
  if (event.getRelation()) {
      const { rel_type: type, event_id: relId, key } = event.getRelation();
      const original = state.events.get(relId);
      if (!original) return queueRelation(relId, event);
      if (type === "m.replace") {
        // TODO: invert current method of edits
        // instead of replacing with an edit event with `original`
        // keep the original with `edit` 
        const index = timeline.lastIndexOf(relId);
        if (index < 0) return queueRelation(relId, event);
        state.events.set(id, {
          ...Events.format(event),
          content: { ...original.content, ...event.getContent()["m.new_content"] },
          original,
        });
      } else if (type === "m.annotation") {
        const [count, selfReacted] = original.reactions.get(key) ?? [0, false];
        original.reactions.set(key, [count + 1, selfReacted || event.getSender() === state.client.getUserId()]);
      }
  } else {
    state.events.set(id, Events.format(event));
    timeline[toBeginning ? "unshift" : "push"](id);
    
    if (relations.has(id)) {
      for (let relation of relations.get(id)) add(relation);
      relations.delete(id);
    }
  }
}

export function redact(event) {
  const original = state.events.get(event.event.redacts);
  console.log("redact", original.eventId)
  original.isRedacted = true;
}