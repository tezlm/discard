<script>
import { formatDate } from "../../../util/format.ts";
import { calculateHash } from "../../../util/content.ts";
export let room;
export let event;
let settings = state.settings;
$: victim = room.members.get(event.stateKey) ?? { userId: event.stateKey };
$: action = getAction(event);

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
  if (changes.has("avatar_url"))  return { icon: "person", type: "avatar" };
  if (changes.has("displayname")) return { icon: "person", type: "displayname", name: content.displayname || event.sender.userId };
  return { icon: "help", type: "something" };
}

function getMembership(current = "leave", old = "leave", event) {
  const self = event.sender.userId === event.stateKey;
  if (current === "leave") {
    if (old === "ban") return { icon: "east", type: "unban" };
    if (old === "leave") return { icon: "close", type: "disinvite" };
    return { icon: "west", color: self ? null : "var(--color-red)", type: self ? "leave" : "kick" };
  } else if (current === "invite") {
    return { icon: "east", color: "var(--color-accent)", type: "invite" };
  } else if (current === "join") {
    if (old === "join") return { icon: "help", type: "noop" };
    return { icon: "east", color: "var(--color-green)", type: "join" };
  } else if (current === "ban") {
    return { icon: "close", color: "var(--color-red)", type: "ban" };
  }
  return { icon: "person", type: "membership" };
}

function getColor(sender, settings) {
  const level = settings.get("namecolors");
  if (!sender) return;
  if (level === "never") return `var(--fg-content)`;
  if (level === "power" && sender.power <= (room.power.users_default ?? 0)) return `var(--fg-content)`;
  return `var(--mxid-${calculateHash(sender.userId) % 8 + 1})`
}

function getJoinMessage(event) {
  const messages = [
    ["", " slid into the room"],
    ["a wild ", " appeared"],
    ["", " hopped into the room"],
    ["", " suddenly materialized"],
    ["big ", " just showed up"],
    ["", " just landed"],
    ["", " arrived in time for the party"],
  ];
  return messages[calculateHash(event.eventId) % messages.length];
}
</script>
<style>
.change {
  display: flex;
  align-items: center;
  user-select: text;
  padding: 2px 0;
  color: var(--fg-light);
}

.icon {
  color: var(--fg-muted);
  font-size: 22px;
  width: 72px;
}

.author {
  color: var(--fg-content);
  font-weight: 700;
  cursor: pointer;
}

.author:hover {
  text-decoration: underline;
}

time {
  color: var(--fg-muted);
  font-size: 11px;
  font-family: var(--font-display);
  margin-left: .25rem;
}
</style>
<div class="change">
  <div class="icon" style:color={action.color}>{action.icon}</div>
  <div>
    {#if action.type !== "join"}
    <span class="author" style:color={getColor(victim, $settings)} data-mx-ping={victim.userId}>
      {victim.name || victim.userId}
    </span>
    {/if}
    {#if action.type === "something"}
      did something
    {:else if action.type === "avatar"}
      changed their avatar
    {:else if action.type === "displayname"}
      changed their name to <b style:color="var(--fg-content)">{action.name}</b>
    {:else if action.type === "join"}
      {@const [before, after] = getJoinMessage(event)}
      {before}<span class="author" style:color={getColor(victim, $settings)} data-mx-ping={victim.userId}>{victim.name || victim.userId}</span>{after}
    {:else if action.type === "invite"}
      was invited by
    {:else if action.type === "disinvite"}
      was disinvited by
    {:else if action.type === "leave"}
      left the room
    {:else if action.type === "kick"}
      was kicked by
    {:else if action.type === "ban"}
      was banned by
    {:else if action.type === "unban"}
      was unbanned by
    {:else if action.type === "noop"}
      did nothing
    {:else}
      {action}
    {/if}
    {#if event.sender.userId !== event.stateKey}
    <span class="author" style:color={getColor(event.sender, $settings)} data-mx-ping={victim.userId}>
      {event.sender.name || event.sender.userId}
    </span>
    {/if}
    <time datetime={event.date.toISOString()}>{formatDate(event.date)}</time>
  </div>
</div>
