<script>
import fuzzysort from "fuzzysort";
import Input from "../atoms/Input.svelte";
import Popup from "../atoms/Popup.svelte";
let search = "";

// TODO: highlight matches
function getRooms(search) {
  const recent = state.recentRooms.slice(1);
  if (!search) return recent;
  return fuzzysort
    .go(search, [...state.rooms.values()], { key: "name", limit: 5, })
    .map(i => i.obj)
    .sort((a, b) => recent.find(i => i.roomId === a.roomId) ? -1 : recent.find(i => i.roomId === b.roomId) ? 1 : 0);
}

function focusRoom(room) {
  if (!room) return;
  actions.rooms.focus(room);
  state.popup.set({});
}
</script>
<style>
</style>
<Popup>
  <div slot="content">
    <div style="height: 16px"></div>
    <Input
      placeholder="Where do you want to go"
      optional
      autofocus
      bind:value={search}
      submitted={() => focusRoom(getRooms(search)[0])}
    />
    <ul>
      {#each getRooms(search) as room}
        <li on:click={() => focusRoom(room)}>{room.name}</li>
      {/each}
    </ul>
  </div>
</Popup>

