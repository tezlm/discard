// this module handles the recieved events from sync

const supportedEvents = ["m.room.create", "m.room.message", "m.reaction"];
const relations = new Map();

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
    // isRedacted: ev.isRedacted(), // TODO: fix
    reactions:  new Map(),
  };
  return event;
}


function getRelation(event) {
  const relation = event.content["m.relates_to"];
  for (let key in relation) {
    return { rel_type: key, event_id: relation[key].event_id, key: relation[key].key }
  }
}

function queueRelation(id, event) {
  if (!relations.has(id)) relations.set(id, []);
  relations.get(id).push(event);
}

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

export function handleEvent(roomId, event, toStart) {
  if (!supportedEvents.includes(event.type)) return;
  if (event.content.redacts) return;
  const id = event.event_id;
  const timeline = get(roomId);
  
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
  //         ...Events.format(event),
  //         content: { ...original.content, ...event.getContent()["m.new_content"] },
  //         original,
  //       });
  //     } else if (type === "m.annotation") {
  //       const [count, selfReacted] = original.reactions.get(key) ?? [0, false];
  //       original.reactions.set(key, [count + 1, selfReacted || event.getSender() === state.client.getUserId()]);
  //     }
  // } else {
  const atEnd = actions.slice.isAtEnd();
  state.events.set(id, format(roomId, event));
  timeline[toStart ? "unshift" : "push"](id);
  
  // TODO: update on state events
  // TODO: clean up
  if (state.focusedRoomId === roomId && !toStart && atEnd) {
    // TODO: fix relations
    // if (event.isRelation()) {
      // state.sliceEnd = state.timeline.at(-1);
      // state.sliceRef[state.sliceRef.length - 1] = state.timeline.at(-1);
    // } else {
      state.sliceRef.push(timeline.at(-1));
      state.sliceEnd = timeline.at(-1);
  
      const startIndex = timeline.lastIndexOf(state.sliceStart);
      if (startIndex >= 0) {
        state.sliceStart = timeline[startIndex + 1];
        state.sliceRef.shift();
      }
    // }
  
    state.slice.set(state.sliceRef);        
  }
  
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

export function handleEphermeral(roomId, event) {
  // TODO
}

export function handleState(roomId, event, batch) {
  actions.rooms.handleJoin(roomId, event, batch);
}
