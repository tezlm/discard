<script>
import Item from "./Item.svelte";
import Tooltip from "../../atoms/Tooltip.svelte";
import Avatar from "../../atoms/Avatar.svelte";
import { roomContext } from "../../../util/context";
import { getLastMessage } from "../../../util/timeline";
export let room;
export let muted = false;
let focusedRoom = state.focusedRoom;
let dms = state.dms;
$: focused= $focusedRoom?.id === room.id;

// move dm status into the room object?
function getName(room) {
	if (!dms.has(room.id)) return room.name;
	const other = dms.get(room.id);
	return other.name ?? other.id;
}

function getAvatar(room) {
	if (!dms.has(room.id)) return room.avatar;
	return dms.get(room.id).avatar;
}

function isRead(room) {
	if (muted) return true;

	const tl = room.events.live;
	if (!tl) return room.notifications.unread === 0;
	return getLastMessage(tl, room.readEvent)	=== getLastMessage(tl);
}

function openSettings(room) {
	return () => {
		state.selectedRoom.set(room);
		actions.to(`/room-settings/${room.id}`);
	};
}
</script>
<style>
.avatar {
	padding: 5px 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.name {
	margin-left: 12px;
	overflow: hidden;
	text-overflow: ellipsis;
	padding: 6px 0;
}

.spacer {
	margin-left: auto;
	min-width: 4px;
}

.settings .icon {
	color: var(--fg-dim);
	font-size: 16px;
	padding: 6px 2px;
}

.settings .icon:hover {
	color: var(--fg-light);
}

.settings .icon:active {
	transform: translateY(1px);
}

.pings {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 16px;
	min-width: 16px;
	margin-right: 4px;

	background: var(--color-red);
	color: var(--fg-notice);
	font-size: 12px;
	font-weight: 700;
	border-radius: 50%;
}

.hover.focused {
	display: block;
}
</style>
<Item
	{focused}
	{muted}
	unread={!isRead(room)}
	clicked={() => actions.to(`/room/${room.id}`)}
	getContext={() => roomContext(room)}
>
	<div class="avatar"><Avatar user={{ ...room, avatar: getAvatar(room) }} size={32} /></div>
	<div class="name">{getName(room)}</div>
	<div class="spacer"></div>
	{#if room.notifications.pings}<div class="pings">{room.notifications.pings}</div>{/if}
	{#if (room.power.me >= room.power.invite ?? 0) || room.joinRule === "public"}
	<div class="settings hover" class:focused on:click|stopPropagation={(e) => state.popup.set({ id: "invite", type: "room", room })}>
		<Tooltip tip="Send Invite">
			<span class="icon">person_add</span>
		</Tooltip>
	</div>
	{/if}
	<div class="settings hover" class:focused on:click|stopPropagation={openSettings(room)}>
		<Tooltip tip="Edit Room">
			<span class="icon">settings</span>
		</Tooltip>
	</div>
	<div style="width: 4px"></div>
</Item>
