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
  <div class="icon">info</div>
  <div class="text">
    unknown event type <b>{event.type}</b> from
    <Name bold member={event.sender} />
    <time datetime={event.timestamp.toISOString()}>{formatDate(event.timestamp)}</time>
  </div>
</div>
