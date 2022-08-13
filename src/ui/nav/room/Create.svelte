<script>
import Item from "./Item.svelte";

function getContext() {
	return [
	  { label: "Create Room",  clicked: () => state.popup.set({ id: "create", type: "room" }),  icon: "tag" },
	  { label: "Create Space", clicked: () => state.popup.set({ id: "create", type: "space" }), icon: "folder" },
	];
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
</style>
<Item clicked={() => state.popup.set({ id: "create", type: "room" })} {getContext}>
	<div class="icon">add</div>
	<div class="name">Create Room</div>
</Item>