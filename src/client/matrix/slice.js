export default class Slice {
  constructor(timelineSet) {
    // this assumes that there's at least some events in the timeline    
    this.timelineSet = timelineSet;    
    this.reset();
  }
  
  atEnd() {
    return this.end === this.timelineSet.live.at(-1);
  }
  
  reset(count = 50) {
    const timeline = this.timelineSet.current;
    const startIdx = Math.max(timeline.length - (count * 2) - 1, 0);
    const endIdx = timeline.length - 1;
    this.start = timeline[startIdx];
    this.end = timeline[endIdx];
    this.events = timeline.slice(startIdx, endIdx + 1).map(i => state.events.get(i));
  }
    
  reslice() {
    const timeline = this.timelineSet.current;
    const startIdx = timeline.lastIndexOf(this.start);
    const endIdx = timeline.lastIndexOf(this.end);
    this.events = timeline.slice(startIdx, endIdx + 1).map(i => state.events.get(i));
  }
  
  async backwards(count = 50) {
    const timeline = this.timelineSet.current;
    const oldStart = timeline.indexOf(this.start);
    if (oldStart - count < 0) {
      state.log.matrix(`fetching backwards in ${this.timelineSet.roomId}`);
      if (!await timeline.backwards()) return; // no new events
    }
    
    const startIdx = this.start ? timeline.indexOf(this.start) : Math.max(timeline.length - count, 0);
    if (startIdx < 0) this.reset();
    
    const eventCount = count * 2;
    const newStart = Math.max(startIdx - count, 0);
    const newEnd = Math.min(newStart + eventCount, timeline.length - 1);
     
    state.log.ui(`now viewing [${newStart}..${newEnd}] of ${timeline.length}`);
    
    this.start = timeline[newStart];
    this.end = timeline[newEnd];
    this.events = timeline.slice(newStart, newEnd + 1).map(i => state.events.get(i));
  }
  
  async forwards(count = 50) {
    // TODO: fetch events
    
    const timeline = this.timelineSet.current;
    const startIdx = timeline.lastIndexOf(this.start);
    if (startIdx < 0) this.reset();
    
    const eventCount = count * 2;
    const newStart = Math.max(Math.min(startIdx + count, timeline.length - count - 1), 0);
    const newEnd = Math.min(newStart + eventCount, timeline.length - 1);
     
    state.log.ui(`now viewing [${newStart}..${newEnd}] of ${timeline.length}`);
    
    this.start = timeline[newStart];
    this.end = timeline[newEnd];
    this.events = timeline.slice(newStart, newEnd + 1).map(i => state.events.get(i));
  }
  
  async jump(eventId, count = 50) {
    await this.timelineSet.jump(eventId);
    const timeline = this.timelineSet.current;
    const evIdx = timeline.indexOf(eventId);
    
    const newStart = Math.max(evIdx - count, 0);
    const newEnd = Math.min(evIdx + count - 1, timeline.length - 1);
    // const newStart = Math.min(Math.max(startIdx + count, 0), timeline.length - count - 1);
    // const newEnd = Math.min(newStart + eventCount, timeline.length - 1);
    
    this.start = timeline[newStart];
    this.end = timeline[newEnd];
    this.events = timeline.slice(newStart, newEnd + 1).map(i => state.events.get(i));
  }
}
