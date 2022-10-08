<script>
import Event from "../room/timeline/Event.svelte";
export let room;
let pinned = room.getState("m.room.pinned_events")?.content.pinned ?? [];
</script>
<style>
.pins {
  width: 420px;
  max-height: calc(100vh - 64px);
  border-radius: 4px;
  
  box-shadow: var(--shadow-popup);
  background: var(--bg-rooms-members);
}

.header {
  position: sticky;
  top: 0;
  background: var(--bg-spaces);
  padding: 16px;
  font-size: 18px;
  font-weight: 500;
  z-index: 1;
  box-shadow: var(--shadow-header);
}

.content {
  margin: 16px;
}

.item {
  border: solid var(--bg-spaces) 1px;
  background: var(--bg-content);
  padding: 8px;
  border-radius: 4px;
  margin-top: 8px;
}

.nopins {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}
</style>
<div class="pins scroll" on:click|stopPropagation={() => state.context.set({})}>
  <div class="header">Pinned Messages</div>
  <div class="content">
  {#each pinned as eventId (eventId)}
    <div class="item">
    {#await state.events.fetch(room, eventId)}
    loading {eventId}
    {:then event}
    <Event {room} {event} />
    {:catch error}
    error loading event. {error.error}
    {/await}
    </div>
  {:else}
    <div class="nopins">no pinned messages</div>
  {/each}
  </div>
</div>
