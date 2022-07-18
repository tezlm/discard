export default class Slice {
  constructor(timelineSet, count = 50) {
    // this assumes that there's at least some events in the timeline    
    this.timelineSet = timelineSet;
    
    const timeline = timelineSet.current;
    const startIdx = Math.max(timeline.length - count - 1, 0);
    const endIdx = timeline.length - 1;
    this.start = timeline[startIdx];
    this.end = timeline[endIdx];
    this.events = timeline.slice(startIdx, endIdx + 1).map(i => state.events.get(i));
  }
  
  atEnd() {
    return this.end === this.timelineSet.live.at(-1);
  }
  
  async backwards(count = 50) {
    const timeline = this.timelineSet.current;
    const oldStart = timeline.indexOf(this.start);
    if (oldStart - count < 0) {
      state.log.matrix(`fetching backwards in ${this.timelineSet.roomId}`);
      if (!await timeline.backwards()) return; // no new events
    }
    
    const startIdx = this.start ? timeline.indexOf(this.start) : Math.max(timeline.length - count, 0);
    if (startIdx < 0) throw "this shouldn't happen";
    
    const eventCount = 100;
    const newStart = Math.max(startIdx - count, 0);
    const newEnd = Math.min(newStart + eventCount, state.timeline.length - 1);
     
    state.log.ui(`now viewing [${newStart}..${newEnd}] of ${state.timeline.length}`);
    
    this.start = timeline[newStart];
    this.end = timeline[newEnd];
    this.events = timeline.slice(newStart, newEnd + 1).map(i => state.events.get(i));
  }
  
  async forwards(count = 50) {
    // TODO: fetch events
    
    const timeline = this.timelineSet.current;
    const startIdx = timeline.indexOf(this.start);
    if (startIdx < 0) throw "this shouldn't happen";
    
    const eventCount = 100;
    const newStart = Math.max(startIdx + count, 0);
    const newEnd = Math.min(newStart + eventCount, state.timeline.length - 1);
     
    state.log.ui(`now viewing [${newStart}..${newEnd}] of ${state.timeline.length}`);
    
    this.start = timeline[newStart];
    this.end = timeline[newEnd];
    this.events = timeline.slice(newStart, newEnd + 1).map(i => state.events.get(i));
  }
  
  async jump(count = 50) {
    // TODO: jump to context
  }
}
