<script>
import Room from "./room/Room.svelte";
// import Room from "./room/RoomTall.svelte";
import Home from "./room/Home.svelte";
import Category from "./room/Category.svelte";
import { getLastMessage } from "../../util/timeline";
let { focusedSpace, navRooms, pushRules, dms } = state;
$: flattenedRooms = state.spaces.get($focusedSpace?.id ?? "orphanRooms")?.flatMap(i => i.type === "m.space" ? state.spaces.get(i.id) : i) ?? [];

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
</script>
<style>
.nav {
	flex: 1;
  background: var(--bg-rooms-members);
  color: var(--fg-content);
	display: flex;
	flex-direction: column;
  scrollbar-width: thin;
}

.nav > .spacer {
	margin-top: 16px;
}
</style>
<div class="nav scroll" tabindex=-1>
	<div class="spacer"></div>
	<Home />
	{#each $navRooms.sort((a, b) => dms.has(a.id) - dms.has(b.id)) as room (room.id)}
		{#if room.type === "m.space"}
		<Category {room} />
		{:else}
		<Room {room} muted={isMuted(room)} />
		{/if}
	{/each}
	<div class="spacer"></div>
</div>
<svelte:window on:keydown={(e) => {
	// TODO: move into proper keybind handler
	if (!(e.altKey && !e.ctrlKey) || (e.key !== "ArrowUp" && e.key !== "ArrowDown")) return;
	const idx = flattenedRooms.findIndex(i => i.id === state.focusedRoomId);
	const newRoom = e.shiftKey
		? findUnread()
		: flattenedRooms[(idx + (e.key === "ArrowUp" ? -1 : 1) + flattenedRooms.length + 1) % (flattenedRooms.length + 1)];
	if (newRoom) {
		actions.to(`/room/${newRoom.id}`);
	} else if ($focusedSpace) {
		actions.to(`/space/${$focusedSpace.id}`);
	} else {
		actions.to(`/home`);
	}
	
	function findUnread() {
		if (e.key === "ArrowDown") {
		console.log(flattenedRooms, idx, )
			return flattenedRooms.slice(idx + 1).find(i => i.type !== "m.space" && !isRead(i)) ??
				flattenedRooms.slice(0, idx).find(i => i.type !== "m.space" && !isRead(i));
		} else {
			return flattenedRooms.slice(0, idx).findLast(i => i.type !== "m.space" && !isRead(i)) ??
				flattenedRooms.slice(idx + 1).findLast(i => i.type !== "m.space" && !isRead(i));
		}
	}
}} />
