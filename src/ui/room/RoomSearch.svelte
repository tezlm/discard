<script>
import { circOut } from "svelte/easing";
import Message from "./message/Message.svelte";

export let room;
export let search;

function resize() {
  return {
    duration: 300,
    easing: circOut,
    css: (t) => `width: ${240 + 200 * t}px`,
  };
}
</script>
<style>
.search {
  background: var(--bg-rooms-members);
  height: 100%;
  width: 440px;
}

.item {
  border: solid var(--bg-spaces) 1px;
  background: var(--bg-content);
  padding: 8px 0;
  border-radius: 4px;
  margin: 8px;
}

a {
  margin: 8px;
}
</style>
<div class="search scroll" in:resize>
  <a href="#" on:click|preventDefault={() => state.roomState.search.set(null)}>close</a>
  {#each room.events.live.filter(i => i.type === "m.room.message").slice(0, 10) as event}
  <div class="item" on:click={() => actions.slice.jump(room.id, event.id)}>
    <Message {room} {event} header />
  </div>
  {/each}
</div>
