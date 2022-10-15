<script>
import Tooltip from "../atoms/Tooltip.svelte";
import { parseMxc } from "../../util/content.ts";
import { roomContext } from "../../util/context";
import { getLastMessage } from "../../util/timeline";
let focusedSpace = state.focusedSpace;
let navSpaces = state.navSpaces;
let spaces = state.spaces;
let pushRules = state.pushRules;

function isMuted(room) {
	const rule = $pushRules.rules.find(i => i.id === room.id);
	if (!rule) return false;
	return rule.actions.includes("dont_notify");
}

function isRead(room) {
  if (isMuted(room)) return true;

	const tl = state.roomTimelines.get(room.id);
  if (getLastMessage(tl, room.readEvent) === getLastMessage(tl)) {
    return room.type === "m.space" ? state.spaces.get(room.id).every(i => isRead(i)) : true;
  } else {
    return false;
  }  
}

function allRead(spaceId) {
  return spaces.get(spaceId).every(room => isRead(room));
}

function getHomeContextMenu() {
	return [
	  // { label: "Mark As Read",  clicked: markRead, icon: "done" },
	  { label: "Create Room",  clicked: () => state.popup.set({ id: "create", type: "room" }),  icon: "tag" },
	  { label: "Create Space", clicked: () => state.popup.set({ id: "create", type: "space" }), icon: "folder" },
	  { label: "Join",         clicked: () => state.popup.set({ id: "join" }), icon: "add" },
	  null,
	  { label: "Settings", clicked: () => state.scene.set("user-settings"), icon: "settings" /* submenu: [
	    { label: "Foo", clicked: todo },
	    { label: "Bar", clicked: todo },
	    { label: "Baz", clicked: todo },
	  ]*/ },
	];
}
</script>
<style>
.nav {
  background: var(--bg-spaces);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 72px;
  padding: 4px 12px;
  scrollbar-width: thin;
}

.space {
	position: relative;
}

.space img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-top: 8px;
  cursor: pointer;
  transition: border-radius 0.3s;
}

.space:hover img {
  border-radius: 35%;
}

.space:active img {
  transform: translateY(1px);
}

.space.focused img {
  border-radius: 35%;
}

.space::before {
	content: "";
	position: absolute;
  width: 8px;
  height: 0;
	left: -24px;
	top: 32px;
	background: var(--fg-notice);
  border-radius: 4px;
  opacity: 0;
  transition: all 200ms;
}

.space::before {
  opacity: 1;
	left: -16px;
}

.space.unread::before {
  height: 8px;
	top: 28px;
}

.space:hover::before {
  height: 18px;
	top: 22px;
}

.space.focused::before {
  height: 36px;
	top: 14px;
}

.separator {
  background: var(--color-gray);
  min-height: 2px;
  width: 32px;
  margin: 4px 0 0;
}

.pings {
  position: absolute;
  bottom: 0;
  right: -8px;

	display: flex;
	justify-content: center;
	align-items: center;
	height: 22px;
	min-width: 22px;
	margin-right: 4px;
  padding: 4px;
  pointer-events: none;

	background: var(--color-red);
	border: solid var(--bg-spaces) 3px;
	color: var(--fg-notice);
	font-size: 12px;
	font-weight: 700;
	border-radius: 50%;
}
</style>
<div class="nav scroll">
  <div class="space" class:selected={$focusedSpace === null}>
    <Tooltip position="right" tip="Home">
      <img
        class="space"
        class:selected={$focusedSpace}
        src={"https://celery.eu.org/_matrix/media/r0/download/celery.eu.org/Wm9T9Nnch8IUQsVaJAInkaoVsgCJlmGx"}
        on:click={() => actions.spaces.focus(null)}
    		on:contextmenu|preventDefault|stopPropagation={e => state.context.set({ items: getHomeContextMenu(), x: e.clientX, y: e.clientY })}
      />
    </Tooltip>
  </div>
  <div class="separator"></div>
	{#each $navSpaces as space}
  {@const pings = spaces.get(space.id).reduce((pings, room) => pings + room.notifications.highlight, 0)}
  <div
    class="space"
    class:focused={$focusedSpace?.id === space.id}
    class:unread={!allRead(space.id)}
  >
    <Tooltip position="right">
      <!-- TODO: use <Avatar> (need to find out how to do border-radius) -->
      <img
        src={parseMxc(space?.avatar) ?? "https://www.adweek.com/wp-content/uploads/2018/07/confused-guy-meme-content-2018.jpg"}
        on:click={() => actions.spaces.focus(space)}
    		on:contextmenu|preventDefault|stopPropagation={e => state.context.set({ items: roomContext(space), x: e.clientX, y: e.clientY })}
      />
      <b slot="tip">{space?.name ?? "unknown..."}</b>
    </Tooltip>
    {#if pings}
      <div class="pings">{pings}</div>
    {/if}    
  </div>
	{/each}
</div>
<svelte:window on:keydown={(e) => {
	// TODO: move into proper keybind handler
	if (!(e.altKey && e.ctrlKey && !e.shiftKey) || (e.key !== "ArrowUp" && e.key !== "ArrowDown")) return;
	const idx = $navSpaces.findIndex(i => i.id === state.focusedSpaceId);
	const newSpace = $navSpaces[(idx + (e.key === "ArrowUp" ? -1 : 1) + $navSpaces.length + 1) % ($navSpaces.length + 1)];
	actions.spaces.focus(newSpace ?? null);
  e.preventDefault();
  e.stopPropagation();
}} />
