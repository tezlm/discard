<script>
import { formatDate } from "../../../util/format.js";
import { calculateHash } from "../../../util/content.js";
export let room;
export let event;
let settings = state.settings;
$: [added, removed] = getState(event);

// TODO: clean up

function getState(event) {
  const pinned = event.content.pinned;
  const prev = event.unsigned.prev_content?.pinned ?? [];
  const added = pinned.filter(i => !prev.includes(i));
  const removed = prev.filter(i => !pinned.includes(i));
  return [added, removed];
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

.author, .link {
  font-weight: 700;
  cursor: pointer;
}

.author:hover, .link:hover {
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
  <div class="icon">push_pin</div>
  <div>
    <span class="author" style:color={getColor(event.sender, $settings)}>
      {event.sender.name || event.sender.userId}
    </span>
    {#if added.length === 0 && removed.length === 0}
    did nothing to the pins in this room.
    {:else if added.length === 1 && removed.length === 0}
    pinned <b class="link" on:click={() => actions.slice.jump(room.roomId, added[0])}>a message</b> from this room.
    {:else if added.length > 1 && removed.length === 0}
    pinned {added.length} messages to this room.
    {:else if added.length === 0 && removed.length === 1}
    unpinned <b class="link" on:click={() => actions.slice.jump(room.roomId, removed[0])}>a message</b> from this room.
    {:else if added.length === 0 && removed.length > 1}
    unpinned {removed.length} messages from this room.
    {:else}
    modified the pinned messages in this room.
    {/if}
    See all <b>pinned messages</b>.
    <time datetime={event.date.toISOString()}>{formatDate(event.date)}</time>
  </div>
</div>

