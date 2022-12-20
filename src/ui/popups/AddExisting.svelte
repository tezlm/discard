<script lang="ts">
import fuzzysort from "fuzzysort";
import Button from "../atoms/Button.svelte";
import Popup from "../atoms/Popup.svelte";
import Search from "../atoms/Search.svelte";
import Checkbox from "../atoms/Checkbox.svelte";
import type { Room } from "discount.ts";
// export const confirm = () => {};
export let current;
let checked = {};
let search = "";
let loading = false;

let { dms, rooms, spaces, popup } = state;

$: children = (current.parent as Room).getAllState("m.space.child").map(i => i.stateKey);
$: results = getRooms(search);

function getRooms(search: string): Array<{ name: string, room: Room, fuzzy?: Fuzzysort.Result }> {
  let options = [...rooms.values()]
    .filter(i => !children.includes(i.id) || i.id === current.parent.id)
    .map(room => ({ name: sanitize(room.name ?? dms.get(room.id)?.name), room }));
  if (!search) return options;
  const type = search[0] === "#" ? "room"
    : search[0] === "@" ? "dm"
    : search[0] === "*" ? "space"
    : null;
  if (type) search = search.slice(1);
  if (type === "space") options = options.filter(i => i.room.type === "m.space");
  if (type === "room") options = options.filter(i => i.room.type !== "m.space" && !dms.has(i.room.id));
  if (type === "dm") options = options.filter(i => dms.has(i.room.id));
  if (!search) return options;
  return fuzzysort
    .go(search, options, { key: "name" })
    .map(i => ({ ...i.obj, fuzzy: i }));
}

// TODO: move into utility function
function sanitize(str: string): string {
  return str
    ?.replace(/&amp;/g, "&")
    .replace(/>/g, "&gt;")
    .replace(/</g, "&lt;");
}

function close() {
  $popup = { ...current, id: null };
}

function findParent(room: Room): Room | null {
  if (spaces.get("orphanRooms").includes(room)) return null;
  if (spaces.get("orphanSpaces").includes(room)) return null;
  for (let [id, children] of spaces) {
    if (children.includes(room)) return rooms.get(id);
  }
  return null;
}

async function add() {
  loading = true;
  const roomIds = Object.entries(checked).filter(i => i[1]).map(i => i[0]);
  const promises = [];
  const space = current.parent as Room;
  for (let roomId of roomIds) {
    promises.push(space.sendState("m.space.child", { via: getServers(rooms.get(roomId)) }, roomId));
  }
  await Promise.all(promises);
  close();
  
  function getServers(room: Room): Array<string> {
    return [
      room.id.split(":")[1],
      ...[...room.members.values()].map(i => i.id.split(":")[1]),
    ].slice(0, 5);
  }
}
</script>
<style>
.rooms {
  max-width: 440px;
  max-height: 400px;
  user-select: none;
}

.room {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px;
  margin-bottom: 1px;
  border-radius: 3px;
}

.room:hover {
  background: var(--mod-lighten);
}

.room.checked {
  background: var(--mod-lightener);
}

.room .name {
  flex: 1;
  display: flex;
  align-items: center;
}

.room .icon {
  margin-right: 4px;
  color: var(--fg-muted);
  font-weight: 500;
  font-family: var(--font-monospace);
  font-size: 18px;
}

.room input {
  display: none;
}
</style>
<Popup>
  <div slot="header">
    <h2>Add Existing Room (TODO)</h2>
    <div style="margin-top: 1em">
      <Search autofocus size="input" escaped={close} bind:value={search} />
    </div>
  </div>
  <div slot="content" class="rooms">
    {#each results as result}
      {@const { room } = result}
      {@const parent = findParent(room)}
      {#if !spaces.get(current.parent.id).includes(room)}
        <label class="room" class:checked={checked[room.id]}>
          <div class="name">
          <span class="icon">{#if dms.has(room.id)}@{:else if spaces.has(room.id)}*{:else}#{/if}</span>
          {#if result.fuzzy}
            {@html fuzzysort.highlight(result.fuzzy, "<span style='color: var(--color-accent)'>", "</span>")}
          {:else}
            {result.name}
          {/if}
          {#if parent}
            <span class="dim"> - {parent.name}</span>
          {/if}
          </div>
          <Checkbox bind:checked={checked[room.id]} />
          <input type="checkbox" bind:checked={checked[room.id]} />
        </label>
      {/if}
    {:else}
      <div style="text-align: center; padding: 50px 0">
        no results
      </div>
    {/each}
  </div>
  <div slot="footer">
    <Button type="link" label="Cancel" on:click={close} />
    <Button type="primary" label="Add" disabled={!Object.values(checked).some((i) => i)} {loading} on:click={add} />
  </div>
</Popup>
