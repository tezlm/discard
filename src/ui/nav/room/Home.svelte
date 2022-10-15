<script>
import Item from "./Item.svelte";
import Tooltip from "../../atoms/Tooltip.svelte";
export let room;
let { focusedRoom, invites } = state;
</script>
<style>
.icon {
	position: absolute;
	color: var(--fg-dim); 
	font-size: 20px;
	margin-left: -2px;
	padding: 6px 0;
}

.name {
	margin-left: 1.5em;
	overflow: hidden;
	text-overflow: ellipsis;
	padding: 6px 0;
}

.mentions {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 16px;
	min-width: 16px;
	margin-right: 4px;
	margin-left: auto;

	background: var(--color-red);
	color: var(--fg-notice);
	font-size: 12px;
	font-weight: 700;
	border-radius: 50%;
}
</style>
<Item focused={!$focusedRoom?.id} clicked={() => actions.rooms.focus(null)}>
	<div class="icon">home</div>
	<div class="name">Home</div>
	{#if $invites.size}<div class="mentions">{$invites.size}</div>{/if}
</Item>
