<script>
import { formatDate } from "../../../util/format.ts";
import { calculateHash } from "../../../util/content.ts";
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

time {
  color: var(--fg-muted);
  font-size: 11px;
  font-family: var(--font-display);
  margin-left: .25rem;
}
</style>
<div class="change">
  <div class="icon">info</div>
  <div>
    unknown event type <b>{event.type}</b> from
    <span class="author" style:color={getColor(event.sender, $settings)} data-mx-ping={event.sender.id}>
      {event.sender.name || event.sender.userId}
    </span>
    <time datetime={event.date.toISOString()}>{formatDate(event.date)}</time>
  </div>
</div>
