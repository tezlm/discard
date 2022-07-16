import { handle } from "../actions/timeline.js";

class Timeline extends Array {
  constructor(roomId, start, end) {
    super();
    this.roomId = roomId;
    this.batchStart = start;
    this.batchEnd = end;
  }
  
  async backwards() {
    if (!this.batchEnd) return false;
    const { end, chunk } = await state.api.fetchMessages(this.roomId, this.batchEnd, "b");
    for (let i of chunk) handle(this.roomId, i, true);
    this.batchEnd = end;
    return true;
  }
  
  async forwards() {
    if (!this.batchStart) return false;
    const { start, chunk } = await state.api.fetchMessages(this.roomId, this.batchStart, "f");
    for (let i of chunk) handleEvent(this.roomId, i);
    this.batchStart = start;
    return true;
  }
  
  merge(other) {
    const index = this.lastIndexOf(other[0]);
    if (index >= 0) {
        this.push(...other.slice(index));
        return true;
    } else {
      const index = this.indexOf(other[other.length - 1]);
      if (index >= 0) {
        this.unshift(...other.slice(-index));
        return true;
      } else {
        return false;
      }
    }
  }
}

export default class TimelineSet {
  constructor(roomId, batch) {
    state.log.debug("create new timelineset for " + roomId)
    this.roomId = roomId;
    this.live = new Timeline(roomId, null, batch);
    this.current = this.live;
    this._timelines = new Set();
    this._timelines.add(this.live);
  }
  
  async backwards() {
    if (!this.current.backwards()) return false;
    for (let timeline of this._timelines) {
      if (this.current !== timeline && this.current.merge(other)) {
        this._timelines.delete(other);
        return true;
      }
    }
    return true;
  }
  
  async forwards() {
    if (!this.current.forwards()) return false;
    for (let timeline of this._timelines) {
      if (this.current !== timeline && this.current.merge(other)) {
        this._timelines.delete(other);
        return true;
      }
    }
    return true;
  }
  
  async jump(eventId) {
    if (!eventId) this.current = this.live;

    for (let timeline of this._timelines) {
      if (timeline.includes(eventId)) {
        this.current = timeline;
        return;
      }
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
    this.current = timeline;
  }
}
