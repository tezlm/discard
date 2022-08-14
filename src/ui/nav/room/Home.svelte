<script>
import Item from "./Item.svelte";
import Tooltip from "../../atoms/Tooltip.svelte";
export let room;
let focusedRoom = state.focusedRoom;
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
</style>
<Item focused={!$focusedRoom?.roomId} clicked={() => actions.rooms.focus(null)}>
	<div class="icon">home</div>
	<div class="name">Home</div>
</Item>
