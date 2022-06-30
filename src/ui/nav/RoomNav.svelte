<script>
import settingsIcon from "../../assets/icons/settings.svg";
import { getAvatar } from "../../util/events.js";
let rooms = [];
let focusedRoom = null;
state.rooms.subscribe((newRooms) => rooms = newRooms.filter(i => !i.isSpaceRoom()));
state.focusedRoom.subscribe((newRoom) => focusedRoom = newRoom);
</script>
<style>
.nav {
  background: var(--bg-rooms-members);
  color: var(--fg-content);
	width: 240px;
	display: flex;
	flex-direction: column;
}

.room {
	margin: 2px 8px;
	padding: 6px 10px;
	color: var(--fg-dim);
	border-radius: 4px;
	font-size: 16px;
	cursor: pointer;
}

.room:hover {
	background: rgba(79,84,92,0.4);
  color: var(--fg-light);
}

.room.selected {
	color: var(--fg-content); 
	background: rgba(79,84,92,0.6);
}

.room:before {
	content: "# ";
	font-weight: bold;
}

.user {
	display: flex;
	align-items: center;
	margin-top: auto;
	background: var(--bg-spaces);
	width: 100%;
	height: 52px;
	padding: 8px;
}

.user .icon {
	height: 28px;
	width: 28px;
	cursor: pointer;
	padding: 6px;
	border-radius: 3px;
}

.user .icon:not(.avatar):hover {
	filter: brightness(2);
	background: #ffffff33;
}

.user .avatar {
	height: 48px;
	width: 48px;
	border-radius: 50%;
	margin-right: auto;
}
</style>
<div class="nav">
	{#each rooms as room}
  <div class={focusedRoom?.roomId === room.roomId ? "room selected" : "room"} on:click={actions.rooms.focus(room)}>{room.name}</div>
	{/each}
	<div class="user">
		<img class="icon avatar" src={getAvatar(state.client.getUserId())} />
		<img class="icon" src={settingsIcon} on:click={() => state.scene.set("settings")} />
	</div>
</div>
