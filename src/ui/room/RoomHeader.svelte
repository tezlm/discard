<script>
import { parseHtml } from "../../util/html.js";
let room = state.focusedRoom;
let space = state.focusedSpace;
</script>
<style>
.header {
  display: flex;
  align-items: center;
  padding: 8px 1rem;
  height: 48px;
  box-shadow: 0 1px 0 rgba(4, 4, 5, 0.2),
    0 1.5px 0 rgba(6, 6, 7, 0.05),
    0 2px 0 rgba(4, 4, 5, 0.05);
  z-index: 1;
  max-width: 100%;
}

.dark {
  background: #2c2e33;
}

.name {
  font-weight: bold;
  font-family: var(--font-display);
}

.spacer {
  width: 1px;
  background: var(--color-gray);
  height: 1.5em;
  margin: 8px;
}

.topic {
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.icon {
  margin-right: 6px;
  font-size: 24px;
  color: var(--fg-dim);
}
</style>
<div class="header" class:dark={$space && !$room}>
  {#if $room}
  <span class="icon">tag</span>
  {/if}
  <span class="name">{$room ? $room.name : "Home"}</span>
  {#if $room?.topic}
  <div class="spacer"></div>
  <div class="topic" on:click={() => state.popup.set({ id: "info", head: $room.name, body: parseHtml($room.topic, { linkify: true }), html: true })}>
    {@html parseHtml($room.topic, { linkify: true })}
  </div>
  {/if}
</div>
