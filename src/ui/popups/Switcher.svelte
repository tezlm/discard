<script>
import fuzzysort from "fuzzysort";
import Input from "../atoms/Input.svelte";
import Popup from "../atoms/Popup.svelte";
let search = "";
let highlighted = 0;
$: results = getRooms(search);

let dms = state.dms;

// this code is a mess, surely there's a better way

// TODO: handle spaces
function getRooms(search) {
  if (!search) return state.recentRooms.slice(1);
  const rooms = [...state.rooms.values()].map(room => ({ name: sanitize(room.name ?? dms.get(room.id)?.name), room }));
  return fuzzysort.go(search, rooms, { key: "name", limit: 5 });
}

// TODO: move into utility function
function sanitize(str) {
  return str
    ?.replace(/&amp;/g, "&")
    .replace(/>/g, "&gt;")
    .replace(/</g, "&lt;");
}

function focusRoom(room) {
  if (!room) return;
  if (state.spaces.has(room.id)) {
    actions.spaces.focus(room);
  } else {
    actions.rooms.focus(room);
  }
  state.popup.set({});
}

function handleKeyDown(e) {
  if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
    if (e.key === "Tab") {
        highlighted = (highlighted + 1) % results.length;
    } else {
        highlighted = Math.min(highlighted + 1, results.length - 1);
    }
  } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
    if (e.key === "Tab") {
        highlighted = (highlighted + results.length - 1) % results.length;
    } else {
        highlighted = Math.max(highlighted - 1, 0);
    }
  } else return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
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
  /* display: flex; */
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
}

.room .icon {
  display: inline;
  color: var(--fg-muted);
  font-weight: 500;
  font-family: var(--font-monospace);
  font-size: 16px;
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
      submitted={() => focusRoom(search ? results[highlighted].obj.room : results[highlighted])}
    />
    <div class="rooms">
      <!-- this is horrible and i should feel bad -->
      {#if !search}
        {#each results as room, i}
          {@const parent = findParent(room)}
          <div
            class="room"
            class:highlighted={highlighted === i}
            on:click={() => focusRoom(room)}
            on:mouseover={() => highlighted = i}
            on:focus={() => highlighted = i}
          >
            <span class="icon">{#if dms.has(room.id)}@{:else}#{/if}</span>
            {room.name}
            {#if parent}<span class="dim">- {parent.name}</span>{/if}
          </div>
        {/each}
      {:else}
        {#each results as result, i}
          {@const room = result.obj.room}
          {@const parent = findParent(room)}
          <div
            class="room"
            class:highlighted={highlighted === i}
            on:click={() => focusRoom(room)}
            on:mouseover={() => highlighted = i}
            on:focus={() => highlighted = i}
          >
            <!-- <span class="icon">{#if dms.has(room.id)}@{:else if state.spaces.has(room.id)}folder{:else}#{/if}</span> -->
            <span class="icon">{#if dms.has(room.id)}@{:else if state.spaces.has(room.id)}*{:else}#{/if}</span>
            {@html fuzzysort.highlight(result, "<span style='color: var(--color-accent)'>", "</span>")}
            {#if parent}<span class="dim">- {parent.name}</span>{/if}
          </div>
        {/each}
      {/if}
    </div>
  </div>
</Popup>

