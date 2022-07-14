import { handleEvent } from "./events.js";

class Timeline {
  constructor(events) {
   this.events = [];
    this._batchEnd = null;
    this._batchStart = null;
  }
  
  backwards() {
    const { end, chunk } = state.api.fetchMessages(this.roomId, this._batchEnd, "b");
    this._batchEnd = end;
  }
  
  forwards() {
    
  }
}

export default class TimelineSet {
  constructor(roomId) {
    this.roomId = roomId;
    this._timelines = new Set();
  }
    
  backwards() {
    const oldStartIndex = state.timeline.indexOf(state.sliceStart);
    if (oldStartIndex - limit < 0 && state.events.get(state.timeline[0])?.type !== "m.room.create") {
      const roomId = state.focusedRoomId;
      if (!timelineBatches.has(roomId)) timelineBatches.set(roomId, (await state.store.rooms.get(state.focusedRoomId)).batch);
      const batch = timelineBatches.get(roomId);
      const { end, chunk } = await state.api.fetchMessages(state.focusedRoomId, batch, "b");
      for (let event of chunk) actions.timeline.handleEvent(state.focusedRoomId, event, true);
      timelineBatches.set(roomId, end);
      // if (state.timeline.length < limit && state.timeline.at(-1) !== lastTop) { // lastTop is a hacky solution for now
      //   return actions.slice.backwards(limit, state.timeline.at(-1));
      // }
    }
  }
  
  forwards() {
    
  }
  
  live() {
    
  }
  
  for(eventId) {
    
  }
}
