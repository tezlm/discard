<script>
import { formatDate } from "../../../util/format.ts";
import { calculateHash } from "../../../util/content.js";
export let room;
export let event;
let settings = state.settings;

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
  white-space: pre;
  user-select: text;
  padding: 2px 0;
}

.content {
  overflow: hidden;
  text-overflow: ellipsis;
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
  <div class="icon">edit</div>
  <div class="content">
    <span class="author" style:color={getColor(event.sender, $settings)}>
      {event.sender.name || event.sender.userId}
    </span>
    {#if event.type === "m.room.name"}
    changed the room name to <b class="name">{event.content.name}</b>
    {:else if event.type === "m.room.topic"}
    changed the room topic
    {/if}
    <time datetime={event.date.toISOString()}>{formatDate(event.date)}</time>
  </div>
</div>
