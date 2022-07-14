<script>
import { onDestroy } from "svelte";
import Tooltip from "../atoms/Tooltip.svelte";

let focusedSpace = state.focusedSpace;
let spaceMap = state.spaceMap;
let rooms = state.rooms;

let mxcToHttp = h => h?.replace(/mxc:\/\/([^/]+)\/(.+)/, `https://celery.eu.org/_matrix/media/r0/download/$1/$2`) // TODO: not hardcode this, split into module

onDestroy(state.focusedSpace.subscribe(() => spaceMap = state.spaceMap));
onDestroy(state.rooms.subscribe(() => spaceMap = state.spaceMap));

function getLastMessage(timeline) {
	for (let i = timeline.length - 1; i >= 0; i--) {
		if (timeline[i].getType() === "m.room.message" && !timeline[i].isRedacted()) return timeline[i];
	}
	return null;
}

// TODO: fix unread
function isRead(room) {
	const userId = state.userId;
	const eventId = getLastMessage(room.timeline)?.getId();
	if (!eventId) return true;
	return room.hasUserReadEvent(userId, eventId);
}

function allRead(spaceId) {
  return true;
  return $spaceMap.get(spaceId).every(roomId => {
    const room = state.client.getRoom(roomId);
    if (!room || room.getMyMembership() !== "join") return true;
    return isRead(room);
  });
}

function getClasses(space) {
	const classes = ["space"];
	if ($focusedSpace === space) classes.push("selected");
	if (!allRead(space)) classes.push("unread");
	return classes;
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
  z-index: 3;
  /* overflow: hidden scroll; */
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

.space.selected img {
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

.space.unread::before, .space:hover::before, .space.selected::before {
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

.space.selected::before {
  height: 36px;
	top: 14px;
}

.separator {
  background: var(--color-gray);
  height: 2px;
  width: 32px;
  margin: 4px 0 0;
}
</style>
<div class="nav">
  <div class="space" class:selected={$focusedSpace === null}>
    <Tooltip position="right" tip="Home">
      <img
        class={$focusedSpace ? "space" : "space selected"}
        src={"https://celery.eu.org/_matrix/media/r0/download/celery.eu.org/Wm9T9Nnch8IUQsVaJAInkaoVsgCJlmGx"}
        on:click={() => actions.spaces.focus(null)}
      />
    </Tooltip>
  </div>
  <div class="separator"></div>
	{#each $spaceMap.get("orphanSpaces") ?? [] as space}
  <div class={getClasses(space).join(" ")}>
    <Tooltip position="right">
      <img
        src={mxcToHttp(space?.avatar) ?? "https://www.adweek.com/wp-content/uploads/2018/07/confused-guy-meme-content-2018.jpg"}
        on:click={() => actions.spaces.focus(space)}
      />
      <b slot="tip">{space?.name ?? "unknown..."}</b>
    </Tooltip>
  </div>
	{/each}
</div>

