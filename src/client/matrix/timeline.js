import { handleEvent } from "./events.js";

class Timeline extends Array {
  constructor(start, end) {
    super();
    this._batchStart = start;
    this._batchEnd = end;
  }
  
  backwards() {
    if (!this._batchEnd) return false;
    const { end, chunk } = state.api.fetchMessages(this.roomId, this._batchEnd, "b");
    for (let i of chunk) handleEvent(this, i, true);
    this._batchEnd = end;
    return true;
  }
  
  forwards() {
    if (!this._batchStart) return false;
    const { start, chunk } = state.api.fetchMessages(this.roomId, this._batchEnd, "f");
    for (let i of chunk) handleEvent(this, i);
    this._batchStart = start;
    return true;
  }
  
  merge(other) {
    const index = this.lastIndexOf(other[0]);
    if (index >= 0) {
        return true;
    } else {
      const index = this.indexOf(other[other.length - 1]);
      if (index >= 0) {
        return true;
      } else {
        return false;
      }
    }
  }
}

export default class TimelineSet {
  constructor(roomId) {
    this.roomId = roomId;
    this._timelines = new Set();
  }
  
  async for(eventId) {
    for (let timeline of this._timelines) {
      if (timeline.includes(eventId)) return timeline;
    }
    
    // couldn't find any timeline for that event, get the event's context
    const [event, { start, end, events_before, events_after }] = Promise.all([
      await state.api.fetchEent(this.roomId, eventId),
      await state.api.fetchContext(this.roomId, eventId),
    ]);
    const events = events_before.reverse().concat([event, ...events_after]);

    for (let timeline of this._timelines) {
      if (timeline.merge(events)) return timeline;
    }
    
    // no timeline, make a new one    
    const timeline = new Timeline(start, end);
    for (let i of events_before.reverse().concat([event, ...events_after])) {
      handleEvent(i, timeline);
    }
    this._timelines.add(timeline);
    return timeline;
  }
}
