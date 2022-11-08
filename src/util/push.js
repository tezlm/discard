// matrix push rules are awful to parse, so many things make me go "why" or "no stopp dont do that"

const ruleTypes = [
  "override",
  "content",
  "room",
  "sender",
  "underride",
];

function parseRule(type, raw) {
  const rule = {
    type,
    id: raw.rule_id,
    actions: raw.actions,
    conditions: [],
  };
  
  switch (type) {
    case "override": 
    case "underride":
      rule.conditions = raw.conditions;
      break;
    case "content":
      if (!raw.pattern) return null;
      rule.conditions.push({
        kind: "event_match",
        pattern: raw.pattern,
        key: "content.body",
      });
      break;
    case "room":
      if (!rule.id) return null;
      rule.conditions.push({
        kind: "event_match",
        pattern: raw.pattern,
        key: "room_id",
      });
      break;
    case "sender":
      if (!rule.id) return null;
      rule.conditions.push({
        kind: "event_match",
        pattern: raw.pattern,
        key: "sender",
      });
      break;
  }
  
  return rule;
}

function parseGlob(glob) {
  return escapeRegex(glob)
    .replace(/\\\*/g, ".*")
    .replace(/\\\?/g, ".")
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesRule(cond, event) {
  if (cond.kind === "event_match") {
    let obj = event.raw;
    for (let key of cond.key.split(".")) obj = obj?.[key];
    if (typeof obj !== "string") return false;
    if (cond.value) return obj === cond.value;
    if (!cond.pattern) return false;
    if (cond.key === "content.body") {
      return new RegExp(`(^|\\W)${parseGlob(cond.pattern)}(\\W|$)`, "i").test(obj);
    } else {
      return new RegExp(`^${parseGlob(cond.pattern)}$`, "i").test(obj);
    }
  } else if (cond.kind === "contains_display_name") {
    if (!event.content.body || typeof event.content.body !== "string") return;
    const myname = event.room.members.get(state.userId)?.displayname;
    if (!myname) return false;
    return new RegExp(`(^|\\W)${escapeRegex(myname)}(\\W|$)`, "i").test(event.content.body);
  } else if (cond.kind === "room_member_count") {
    if (!cond.is) return false;
    const count = event.room.members.with("join").length;
    const match = cond.is.match(/^([=<>]*)(\d*)$/);
    if (!match) return false;
    const ineq = match[1];
    const val = parseInt(match[2], 10);
    switch(ineq) {
      case "":
      case "==": return count === val;
      case "<":  return count < val;
      case ">":  return count > val;
      case "<=": return count <= val;
      case ">=": return count >= val;
      default: return false;
    }
  } else if (cond.kind === "sender_notification_permission") {
    if (!cond.key) return false;
    const userPower = event.room.power.forUser(event.sender.id);
    const pingPower = event.room.power.notifications?.[cond.key] ?? 50;
    return userPower >= pingPower;
  }
  return true;
}

// function matchBuiltinRule(ruleId, event) {
//   switch (ruleId) {
//     case ".m.rule.master": return true;
//     case ".m.rule.suppress_notices": return event.;
//     default: return null;
//   }
// }

export default class PushRules {
  constructor(rules) {
    this.setRules(rules);
  }
  
  setRules(rules) {
    this.rules = [];
    
    for (let type of ruleTypes) {
      for (let rule of rules[type] ?? []) {
        if (!rule.enabled) continue;
        this.rules.push(parseRule(type, rule));
      }
    }
  }
  
  parse(event) {
    if (event.sender.userId === state.userId) return [];
    const rules = [];
    for (let rule of this.rules) {
      let passed = true;
      for (let cond of rule.conditions) {
        if (!matchesRule(cond, event)) {
          passed = false;
          break;
        }
      }
      if (passed) rules.push(rule);
    }
    return rules;
  }
}
