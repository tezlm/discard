<script>
import Item from "./Item.svelte";
export let room;
let { focusedRoom, focusedSpace, invites } = state;

function focus() {
	if ($focusedSpace) {
		actions.to(`/space/${$focusedSpace.id}`);
	} else {
		actions.to("/home");
	}
}
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
	display: inline-block;
	height: 16px;
	min-width: 16px;
	padding: 0 4px;
	margin-right: 4px;
	margin-left: auto;

	text-align: center;

	background: var(--color-red);
	color: var(--fg-notice);
	font-size: 12px;
	font-weight: 700;
	border-radius: 11px;
}
</style>
<Item focused={!$focusedRoom?.id} clicked={focus}>
	<div class="icon">home</div>
	<div class="name">Home</div>
	{#if !$focusedSpace && $invites.size}<div class="mentions">{$invites.size}</div>{/if}
</Item>
