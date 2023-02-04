<script>
import { formatDate } from "../../../util/format.ts";
import Name from "../../atoms/Name.svelte";
export let room;
export let event;
</script>
<style>
.change {
  display: flex;
  align-items: center;
  white-space: pre;
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
  <div class="text">
    <Name bold member={event.sender} />
    {#if event.type === "m.room.name"}
    changed the room name to <b class="name">{event.content.name}</b>
    {:else if event.type === "m.room.topic"}
    changed the room topic
    {/if}
    <time datetime={event.timestamp.toISOString()}>{formatDate(event.timestamp)}</time>
  </div>
</div>
