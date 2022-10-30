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

time {
  color: var(--fg-muted);
  font-size: 11px;
  font-family: var(--font-display);
  margin-left: .25rem;
}
</style>
<div class="change">
  <div class="icon">tag</div>
  <div class="text">
    <Name bold member={event.sender} />
    {#if event.content.alias}
    set the room's main alias to <b>{event.content.alias}</b>
    {:else}
    unset the room's main alias
    {/if}
    <time datetime={event.date.toISOString()}>{formatDate(event.date)}</time>
  </div>
</div>
