<script>
import { fastclick } from "../../../util/use";
export let focused = false;
export let unread = false;
export let muted = false;
export let clicked = () => {};
export let getContext = () => null;

function handleContextMenu(e) {
	const items = getContext();
	if (items) {
		e.preventDefault();
		e.stopPropagation();
		state.context.set({ items, x: e.clientX, y: e.clientY });
	}
}
</script>
<style>
.item {
	position: relative;
	white-space: nowrap;
}

.content {
	display: flex;
	align-items: center;
	margin: 1px 8px;
	padding: 0 2px 0 10px;

	color: var(--fg-dim);
	border-radius: 4px;
	font-size: 16px;
	font-weight: 500;
	cursor: pointer;
}

.item.muted .content {
	color: var(--color-gray-light); 
}

.item:hover .content {
	background: var(--mod-lighten);
  color: var(--fg-light);
}

.item.focused .content {
	color: var(--fg-content); 
	background: var(--mod-lightener);
}

.item.unread .content {
	color: var(--fg-content); 
}

.item.unread:not(.focused)::before {
	content: "\2b24";
	position: absolute;
	color: var(--fg-content);
	font-size: 8px;
	left: -4px;
	top: 12px;
}

.item :global(.hover) {
	display: none;
}

.item:hover :global(.hover) {
	display: block;
}
</style>
<div
	class="item"
	class:focused
	class:unread
	class:muted
	use:fastclick
	on:fastclick={clicked}
	on:contextmenu|preventDefault|stopPropagation={handleContextMenu}
>
  <div class="content">
    <slot></slot>
  </div>
</div>
