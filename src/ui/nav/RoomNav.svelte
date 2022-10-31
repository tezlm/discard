<script>
import Room from "./room/Room.svelte";
// import Room from "./room/RoomTall.svelte";
import Home from "./room/Home.svelte";
import Category from "./room/Category.svelte";
let { focusedSpace, navRooms, pushRules } = state;
$: flattenedRooms = state.spaces.get($focusedSpace?.id ?? "orphanRooms")?.flatMap(i => i.type === "m.space" ? state.spaces.get(i.id) : i) ?? [];

function isMuted(room) {
	const rule = $pushRules.rules.find(i => i.id === room.id);
	if (!rule) return false;
	return rule.actions.includes("dont_notify");
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
	{#each $navRooms as room (room.id)}
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
	if (!(e.altKey && !e.ctrlKey && !e.shiftKey) || (e.key !== "ArrowUp" && e.key !== "ArrowDown")) return;
	const idx = flattenedRooms.findIndex(i => i.id === state.focusedRoomId);
	const newRoom = flattenedRooms[(idx + (e.key === "ArrowUp" ? -1 : 1) + flattenedRooms.length + 1) % (flattenedRooms.length + 1)];
	actions.to(`/room/${newRoom.id}`);
}} />
