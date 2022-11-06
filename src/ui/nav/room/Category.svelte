<script>
import Tooltip from "../../atoms/Tooltip.svelte";
import Room from "./Room.svelte";
// import Room from "./RoomTall.svelte";
import Category from "./Category.svelte";
import { roomContext } from "../../../util/context";
import { getLastMessage } from "../../../util/timeline";
export let room;
let expanded = true;
let { pushRules } = state;
$: rooms = state.spaces.get(room.id);

function isMuted(room) {
	const rule = $pushRules.rules.find(i => i.id === room.id);
	if (!rule) return false;
	return rule.actions.includes("dont_notify");
}


function isRead(room) {
	if (isMuted(room)) return true;
	
	const tl = room.events.live;
	if (!tl) return room.notifications.unread === 0;
	return getLastMessage(tl, room.readEvent) === getLastMessage(tl);
}

// TODO: persist `expanded`
// TODO: subspace-specific menu?
</script>
<style>
.category {
  display: flex;
	align-items: center;
  cursor: pointer;
}

.title {
  color: var(--fg-dim);
  margin-bottom: 0;
}

.chevron {
  color: var(--fg-dim);
  margin: 3px;
  font-size: 12px;
  transition: transform .2s;
}

.chevron.expanded {
  transform: rotate(90deg);
}

.category:hover .title, .category:hover .chevron {
  color: var(--fg-content);
}

.add {
  color: var(--fg-muted);
  font-size: 22px;
}

.add:hover {
  color: var(--fg-content);
}
</style>
<div style="min-height: 14px"></div>
<div class="category" on:click={() => expanded = !expanded} on:contextmenu|preventDefault|stopPropagation={e => state.context.set({ items: roomContext(room), x: e.clientX, y: e.clientY })}>
  <div class="icon chevron" class:expanded>chevron_right</div>
  <div class="title">{room.name}</div>
  {#if room.power.me >= room.power.forState("m.space.child")}
  <div style="flex: 1"></div>
  <Tooltip tip="Create Room">
    <div class="icon add" on:click|stopPropagation={() => state.popup.set({ id: "create", type: "room", parent: room })}>add</div>
  </Tooltip>
  <div style="width: 14px"></div>
  {/if}
</div>
{#each rooms as room (room.id)}
{#if room.type === "m.space"}
<!-- <Category {room} /> -->
<!-- {:else if expanded || !isRead(room)} -->
{:else if expanded}
<Room {room} muted={isMuted(room)} />
{/if}
{/each}
