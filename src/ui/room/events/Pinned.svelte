<script>
import { formatDate } from "../../../util/format.ts";
import Name from "../../atoms/Name.svelte";
export let room;
export let event;
$: [added, removed] = getState(event);

// TODO: make buttons/links work

function getState(event) {
  const pinned = event.content.pinned;
  const prev = event.unsigned?.prev_content?.pinned ?? [];
  const added = pinned.filter(i => !prev.includes(i));
  const removed = prev.filter(i => !pinned.includes(i));
  return [added, removed];
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
  min-width: 72px;
}

.text {
  padding-right: 8px;
}

.link {
  font-weight: 700;
  cursor: pointer;
}

.link:hover {
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
  <div class="text">
    <Name bold member={event.sender} />
    {#if added.length === 0 && removed.length === 0}
    did nothing to the pins in this room.
    {:else if event.content.pinned.length === 0}
    cleared all the pins in this room.
    {:else if added.length === 1 && removed.length === 0}
    pinned <b class="link" on:click={() => actions.slice.jump(room.id, added[0])}>a message</b> to this room.
    {:else if added.length > 1 && removed.length === 0}
    pinned {added.length} messages to this room.
    {:else if added.length === 0 && removed.length === 1}
    unpinned <b class="link" on:click={() => actions.slice.jump(room.id, removed[0])}>a message</b> from this room.
    {:else if added.length === 0 && removed.length > 1}
    unpinned {removed.length} messages from this room.
    {:else}
    modified the pinned messages in this room.
    {/if}
    See all <b class="link" on:click|stopPropagation={() => state.events.emit("ui.header.pins.toggle")}>pinned messages</b>.
    <time datetime={event.date.toISOString()}>{formatDate(event.date)}</time>
  </div>
</div>

