import type { Room } from "discount";

interface Notifications {
  level: "default" | "all" | "mentions" | "muted",
  // suppressRoom: boolean, // TODO: suppress @room mentions
}

function getRules(room: Room): Array<any> {
  const pushRules = state.accountDataRef.get("m.push_rules").global;
  return [
    pushRules.room?.find(i => i.rule_id === room.id),
    pushRules.override?.find(i => i.rule_id === room.id),
  ];
}

export function getRoomNotifRule(room: Room): Notifications {
  const [roomRule, overrideRule] = getRules(room);
  if (roomRule && roomRule.enabled) {
    if (roomRule.actions.includes("notify")) {
      return { level: "all" };
    } else {
      return { level: "mentions" };
    }
  } else if (overrideRule && overrideRule.enabled) {
    if (overrideRule.actions.includes("dont_notify")) {
      return { level: "muted" };
    } else {
      return { level: "default" };
    }
  } else {
    return { level: "default" };
  }
}

export async function putRoomNotifRule(room: Room, notifications: Notifications): Promise<any> {
  const [roomRule, overrideRule] = getRules(room);
  const promises = [];
  
  if (notifications.level === "muted") {
    promises.push(state.api.deleteRule("room", room.id));
    promises.push(state.api.putRule("override", room.id, {
      conditions: [
        {
          kind: "event_match",
          key: "room_id",
          pattern: room.id,
        },
      ],
      actions: [
        "dont_notify",
      ],
    }));
  } else {
    if (overrideRule) promises.push(state.api.deleteRule("override", room.id));
    if (notifications.level === "all") {
      promises.push(state.api.putRule("room", room.id, {
        actions: ["notify"]
      }));
    } else if (notifications.level === "mentions") {
      promises.push(state.api.putRule("room", room.id, {
        actions: ["dont_notify"]
      }));
    } else if (notifications.level === "default" && roomRule) {
      promises.push(state.api.deleteRule("room", room.id));
    }
  }
    
  return Promise.all(promises);
}

