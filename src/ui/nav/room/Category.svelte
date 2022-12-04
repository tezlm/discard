<script lang="ts">
import { fastclick } from "../../../util/use";
import Tooltip from "../../atoms/Tooltip.svelte";
import Room from "./Room.svelte";
// import Room from "./RoomTall.svelte";
import { roomContext } from "../../../util/context";
import { getLastMessage } from "../../../util/timeline";
import { parseHtml } from "../../../util/html";
export let room: Room;
let expanded = true;
let { pushRules, context, popup } = state;
$: rooms = state.spaces.get(room.id);

function sanitize(str: string): string {
  return str
    ?.replace(/&amp;/g, "&")
    .replace(/>/g, "&gt;")
    .replace(/</g, "&lt;");
}

function isMuted(room: Room): boolean {
	const rule = $pushRules.rules.find(i => i.id === room.id);
	if (!rule) return false;
	return rule.actions.includes("dont_notify");
}

function isRead(room: Room): boolean {
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

.add:active {
  transform: translateY(1px);
}
</style>
<div style="min-height: 14px"></div>
<div
  class="category"
  use:fastclick
  on:fastclick={() => expanded = !expanded}
  on:contextmenu|preventDefault|stopPropagation={e => $context = { items: roomContext(room), x: e.clientX, y: e.clientY }}
>
  <div class="icon chevron" class:expanded>chevron_right</div>
  <div class="title">{@html parseHtml(sanitize(room.name ?? "null"), { twemojify: true })}</div>
  {#if room.power.me >= room.power.forState("m.space.child")}
  <div style="flex: 1"></div>
  <Tooltip tip="Create Room">
    <div
      class="icon add"
      use:fastclick
      on:fastclick={() => $popup = { id: "create", type: "room", parent: room }}
    >add</div>
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
