// TODO: relations
const supportedEvents = ["m.room.create", "m.room.message", "m.reaction"];
// const relations = new Map();

function format(roomId, raw) {
  const event = {
    roomId:     roomId,
    eventId:    raw.event_id,
    stateKey:   raw.state_key,
    content:    raw.content,
    sender:     raw.sender,
    type:       raw.type,
    date:       new Date(raw.origin_server_ts),
    isSending:  false,
    // isPing:     state.client.getPushActionsForEvent(ev).tweaks?.highlight || false, // TODO: fix
    isRedacted: raw.redacts,
    reactions:  new Map(),
    
    // these will be used when state events are shown in the timeline
    isState:    false,
    stateKey:   null,
  };
  return event;
}


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

export function get(roomId) {
  const tls = state.roomTimelines;
  if (!tls.has(roomId)) {
    const tl = [];
    tls.set(roomId, tl);
    return tl;
  } else {
    return tls.get(roomId);
  }
}

export function processEvent() {
  
}

export function handleEvent(event, timeline, toStart) {
  if (!supportedEvents.includes(event.type)) return;
  if (event.content.redacts) return;
  const id = event.event_id;
  
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
  //         ...Events.format(event),
  //         content: { ...original.content, ...event.getContent()["m.new_content"] },
  //         original,
  //       });
  //     } else if (type === "m.annotation") {
  //       const [count, selfReacted] = original.reactions.get(key) ?? [0, false];
  //       original.reactions.set(key, [count + 1, selfReacted || event.getSender() === state.client.getUserId()]);
  //     }
  // } else {
    state.events.set(id, format(roomId, event));
    timeline[toStart ? "unshift" : "push"](id);
    
  //   if (relations.has(id)) {
  //     for (let relation of relations.get(id)) add(relation);
  //     relations.delete(id);
  //   }
  // }
}

// TODO: merge into event()
export function redact(event) {
  const original = state.events.get(event.event.redacts);
  console.log("redact", original.eventId)
  original.isRedacted = true;
}
