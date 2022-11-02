<script>
import Tooltip from "../atoms/Tooltip.svelte";
import Avatar from "../atoms/Avatar.svelte";
import { roomContext, homeContext } from "../../util/context";
import { getLastMessage } from "../../util/timeline";
let { focusedSpace, navSpaces, spaces, context, popup, pushRules } = state;

function isMuted(room) {
	const rule = $pushRules.rules.find(i => i.id === room.id);
	if (!rule) return false;
	return rule.actions.includes("dont_notify");
}

function isRead(room) {
  if (isMuted(room)) return true;

	const tl = room.events.live;
  if (getLastMessage(tl, room.readEvent) === getLastMessage(tl)) {
    return room.type === "m.space" ? spaces.get(room.id).every(i => isRead(i)) : true;
  } else {
    return false;
  }  
}

function allRead(spaceId) {
  return spaces.get(spaceId).every(room => isRead(room));
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
  margin-top: 8px;
}

.space .avatar {
  border-radius: 50%;
  overflow: hidden;
  transition: border-radius 0.3s;
}

.space:hover .avatar {
  border-radius: 35%;
}

.space:active .avatar {
  transform: translateY(1px);
}

.space.focused .avatar {
  border-radius: 35%;
}

.space::before {
	content: "";
	position: absolute;
  width: 8px;
  height: 0;
	left: -24px;
	top: 22px;
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
	top: 20px;
}

.space:hover::before {
  height: 18px;
	top: 14px;
}

.space.focused::before {
  height: 36px;
	top: 6px;
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
	border-radius: 11px;
}
</style>
<div
  class="nav scroll"
	on:contextmenu|preventDefault|stopPropagation={e => $context = { items: homeContext(), x: e.clientX, y: e.clientY }}
>
  <div
    class="space"
    class:focused={$focusedSpace === null}
    on:click={() => actions.spaces.focus(null)}
  >
    <Tooltip position="right" tip="Home">
      <div class="avatar" style="height: 48px; width: 48px">
        <img src="https://celery.eu.org/_matrix/media/r0/download/celery.eu.org/Wm9T9Nnch8IUQsVaJAInkaoVsgCJlmGx" height=48 width=48 />
      </div>
    </Tooltip>
  </div>
  <div class="separator"></div>
  {#each $navSpaces as space (space.id)}
  {@const pings = spaces.get(space.id).reduce((pings, room) => pings + room.notifications.highlight, 0)}
  <div
    class="space"
    class:focused={$focusedSpace?.id === space.id}
    class:unread={!allRead(space.id)}
    on:click={() => actions.spaces.focus(space)}
    on:contextmenu|preventDefault|stopPropagation={e => $context = { items: roomContext(space), x: e.clientX, y: e.clientY }}
  >
    <Tooltip position="right" tip="arst">
      <div class="avatar">
        <Avatar square user={space} size={48} />
      </div>
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
	const idx = $navSpaces.findIndex(i => i.id === $focusedSpace?.id);
	const newSpace = $navSpaces[(idx + (e.key === "ArrowUp" ? -1 : 1) + $navSpaces.length + 1) % ($navSpaces.length + 1)];
	actions.spaces.focus(newSpace ?? null);
  e.preventDefault();
  e.stopPropagation();
}} />
