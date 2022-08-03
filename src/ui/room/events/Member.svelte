<script>
import { formatDate } from "../../../util/format.js";
import { calculateHash } from "../../../util/content.js";
export let room;
export let event;
let settings = state.settings;
$: victim = room.members.get(event.stateKey) ?? { userId: event.stateKey };

function diff(content, prev) {
  const keys = new Set();
  for (let key of new Set([...Object.keys(content), ...Object.keys(prev)])) {
    if (content[key] && prev[key] && typeof content[key] === "object" && typeof prev[key] === "object") {
      if (diff(content[key], prev[key]).size) keys.add(key);
    } else if (content[key] !== prev[key]) {
      keys.add(key);
    }
  }
  return keys;
}

function getAction(event) {
  const content = event.content;
  const prev = event.unsigned?.prev_content ?? {};
  const changes = diff(content, prev);
  if (changes.size === 0 || changes.has("membership")) return getMembership(content.membership, prev.membership, event);
  if (changes.has("avatar_url")) return ["person", "changed their avatar"];
  // TODO: make displayname bold
  if (changes.has("displayname")) return ["person", "changed their display name to " + (content.displayname ?? event.sender.userId)];
  return ["help", "did something"];
}

function getMembership(current = "leave", old = "leave", event) {
  // you probably cant do "xyz themself", but why not have them
  const self = event.sender.userId === event.stateKey;
  if (current === "leave") {
    if (old === "ban") return self ? "unbanned themself" : "was unbanned";
    return ["person_remove", self ? "left the room" : "was kicked"];
  } else if (current === "invite") {
    return ["person_add", self ? "invited themself to the room" : "was invited to the room"];
  } else if (current === "join") {
    if (old === "join") return ["help", "did nothing"];
    return ["person_add", "joined the room"];
  } else if (current === "ban") {
    return ["person_remove", "was banned from the room"];
  }
  return ["person", "changed their membership"];
}

function getColor(sender, settings) {
  const level = settings.get("namecolors");
  if (!sender) return;
  if (level === "never") return `var(--fg-content)`;
  if (level === "power" && sender.power <= (room.power.users_default ?? 0)) return `var(--fg-content)`;
  return `var(--mxid-${calculateHash(sender.userId) % 8 + 1})`
}
</script>
<style>
.change {
  display: flex;
  align-items: center;
  user-select: text;
  padding: 2px 0;
}

.icon {
  color: var(--fg-muted);
  font-size: 22px;
  width: 72px;
}

.author {
  font-weight: 700;
  cursor: pointer;
}

.author:hover {
  text-decoration: underline;
}

.name {
  color: var(--fg-notice);
}

time {
  color: var(--fg-muted);
  font-size: 11px;
  font-family: var(--font-display);
  margin-left: .25rem;
}
</style>
<div class="change">
  <div class="icon">{getAction(event)[0]}</div>
  <div>
    <span class="author" style:color={getColor(victim, $settings)}>
      {victim.name || victim.userId}
    </span>
    {getAction(event)[1]}
    {#if event.sender.userId !== event.stateKey}
    by 
    <span class="author" style:color={getColor(event.sender, $settings)}>
      {event.sender.name || event.sender.userId}
    </span>
    {/if}
    <time datetime={event.date.toISOString()}>{formatDate(event.date)}</time>
  </div>
</div>
