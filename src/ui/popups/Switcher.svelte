<script>
import fuzzysort from "fuzzysort";
import Input from "../atoms/Input.svelte";
import Popup from "../atoms/Popup.svelte";
let search = "";
let highlighted = 0;
$: rooms = getRooms(search);

// TODO: highlight matches
// TODO: handle spaces
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

function handleKeyDown(e) {
  if (e.key === "ArrowDown") {
    highlighted = Math.min(highlighted + 1, rooms.length - 1);
  } else if (e.key === "ArrowUp") {
    highlighted = Math.max(highlighted - 1, 0);
  }
}

function findParent(room) {
  if (state.spaces.get("orphanRooms").includes(room)) return null;
  if (state.spaces.get("orphanSpaces").includes(room)) return null;
  for (let [id, rooms] of state.spaces) {
    if (rooms.includes(room)) return state.rooms.get(id);
  }
  return null;
}
</script>
<style>
.rooms {
  margin-top: 8px;
}

.room {
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
}

.room .icon {
  display: inline;
  color: var(--fg-muted);
  font-weight: 500;
}

.room.highlighted {
  background: var(--mod-lighten);
}
</style>
<Popup>
  <div slot="content" on:keydown={handleKeyDown}>
    <div style="height: 16px"></div>
    <Input
      placeholder="Where do you want to go"
      optional
      autofocus
      bind:value={search}
      submitted={() => focusRoom(rooms[highlighted])}
    />
    <div class="rooms">
      {#each rooms as room, i}
        {@const parent = findParent(room)}
        <div
          class="room"
          class:highlighted={highlighted === i}
          on:click={() => focusRoom(room)}
          on:mouseover={() => highlighted = i}
        >
          <span class="icon">#</span>
          {room.name}
          {#if parent}<span class="dim">- {parent.name}</span>{/if}
        </div>
      {/each}
    </div>
  </div>
</Popup>

