// import type { Timeline } from "discount";
// import type { Event } from "discount";

// export function getLastEvent(timeline: Array<Event>): Event | null {
//   for (let i = timeline.length - 1; i >= 0; i--) {
//     const event = timeline[i];
//     if (event.type !== "m.room.message") continue;
// 		if (event.flags?.has("redacted")) return event;
// 		if (event.unsigned.redacted_because) return event;
//   }
//   return null;
// }

export function getLastMessage(timeline: any, fromEventId: string): string | null {
  for (let i = fromEventId ? timeline.live.lastIndexOf(fromEventId) : timeline.live.length - 1; i >= 0; i--) {
    const event = state.events.get(timeline.live[i]);
    if (event && event.type === "m.room.message" && !event.flags?.has("redacted") && !event.unsigned?.redacted_because) return event.id;
  }
  return null;
}
