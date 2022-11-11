<script lang="ts">
import fuzzysort from "fuzzysort";
import Search from "../atoms/Search.svelte";
import Popup from "../atoms/Popup.svelte";
import { getLastMessage } from "../../util/timeline";
import type { Room } from "discount.ts";
let search = "";
let highlighted = 0;
$: results = getRooms(search);

let { dms, rooms, spaces } = state;

function getRooms(search: string): Array<{ name: string, room: Room, fuzzy?: Fuzzysort.Result }> {
  if (!search) return state.recentRooms.slice(1).map(i => ({ name: sanitize(i.name ?? dms.get(i.id)?.name), room: i }));
  const type = search[0] === "#" ? "room"
    : search[0] === "@" ? "dm"
    : search[0] === "*" ? "space"
    : null;
  if (type) search = search.slice(1);
  let options = [...rooms.values()].map(room => ({ name: sanitize(room.name ?? dms.get(room.id)?.name), room }));
  if (type === "space") options = options.filter(i => i.room.type === "m.space");
  if (type === "room") options = options.filter(i => i.room.type !== "m.space" && !dms.has(i.room.id));
  if (type === "dm") options = options.filter(i => dms.has(i.room.id));
  if (!search) return options.slice(0, 5);
  return fuzzysort
    .go(search, options, { key: "name", limit: 7 })
    .map(i => ({ ...i.obj, fuzzy: i }));
}

// TODO: move into utility function
function sanitize(str: string): string {
  return str
    ?.replace(/&amp;/g, "&")
    .replace(/>/g, "&gt;")
    .replace(/</g, "&lt;");
}

function focusRoom(room: Room) {
  if (!room) return;
  if (spaces.has(room.id)) {
    actions.to(`/space/${room.id}`);
  } else {
    actions.to(`/room/${room.id}`);
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
  } else {
    return;
  }
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
}

function findParent(room: Room): Room | null {
  if (spaces.get("orphanRooms").includes(room)) return null;
  if (spaces.get("orphanSpaces").includes(room)) return null;
  for (let [id, children] of spaces) {
    if (children.includes(room)) return rooms.get(id);
  }
  return null;
}
</script>
<style>
.content {
  display: flex;
  flex-direction: column;
  background: var(--bg-content);
  padding: 16px;
  border-radius: 4px;
  min-width: 480px;
  min-height: 220px;
  overflow: hidden;
}

.rooms {
  flex: 1;
  margin-top: 8px;
}

.room {
  /* display: flex; */
  padding: 4px;
  margin-top: 2px;
  border-radius: 4px;
  color: var(--fg-content);
  cursor: pointer;
}

.room.unread {
  color: var(--fg-notice);
  font-weight: 500;
}

.room.unread .icon {
  color: var(--fg-notice);
}

.room .icon {
  display: inline;
  color: var(--fg-muted);
  font-weight: 500;
  font-family: var(--font-monospace);
  font-size: 16px;
}

.rooms:not(:hover) .room.highlighted, .room:hover {
  background: var(--mod-lighten);
}

.help {
  margin: -16px;
  margin-top: 8px;
  padding: 16px;
  background: var(--bg-misc);
  color: var(--fg-dim);
}

.help code {
  color: var(--fg-content);
}
</style>
<Popup raw>
  <div slot="content" class="content" on:keydown={handleKeyDown}>
    <Search
      size="tall"
      placeholder="Where do you want to go"
      autofocus
      bind:value={search}
      submitted={() => focusRoom(results[highlighted]?.room)}
    />
    <div class="rooms">
      {#each results as result, i (result.room.id)}
        {@const { room } = result}
        {@const parent = findParent(room)}
        <div
          class="room"
          class:unread={getLastMessage(room.events.live, room.readEvent) !== getLastMessage(room.events.live)}
          class:highlighted={highlighted === i}
          on:click={() => focusRoom(room)}
        >
          <span class="icon">{#if dms.has(room.id)}@{:else if spaces.has(room.id)}*{:else}#{/if}</span>
          {#if result.fuzzy}
            {@html fuzzysort.highlight(result.fuzzy, "<span style='color: var(--color-accent)'>", "</span>")}
          {:else}
            {result.name}
          {/if}
          {#if parent}
            <span class="dim">- {parent.name}</span>
          {/if}
        </div>
      {:else}
        <div style="display: flex; align-items: center; justify-content: center; flex: 1; height: 120px">
          {#if search}
            <i>no rooms, typo?</i>
          {:else}
            <i>no recent rooms</i>
          {/if}
        </div>
      {/each}
    </div>
    <div class="help">
      <code>*</code> for spaces, <code>#</code> for rooms, <code>@</code> for dms. Keybind: <kbd>ctrl+k</kbd>
    </div>
  </div>
</Popup>

