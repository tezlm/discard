<script>
import Tooltip from "../atoms/Tooltip.svelte";
import { parseMxc } from "../../util/content.js";
let focusedSpace = state.focusedSpace;
let navSpaces = state.navSpaces;
let spaces = state.spaces;

function isRead(room) {
	const timeline = state.roomTimelines.get(room.roomId).live;
	if (!timeline.length) return true;
	const lastMessage = timeline.at(-1);
	const readMessage = getLastMessage(timeline, room.readEvent);
	if (!readMessage) return false;
	return getLastMessage(timeline, room.readEvent) === lastMessage;

	function getLastMessage(timeline, fromEvent) {
		const index = timeline.lastIndexOf(fromEvent);
		if (index === -1) return null;
		for (let i = index; i >= 0; i--) {
			const event = state.events.get(timeline[i]);
			if (["m.room.message", "m.room.create"].includes(event.type) && event.special !== "redacted") return event.eventId;
		}
		return null;
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
  height: 2px;
  width: 32px;
  margin: 4px 0 0;
}
</style>
<div class="nav scroll">
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
	{#each $navSpaces as space}
  <div
    class="space"
    class:focused={$focusedSpace?.roomId === space.roomId}
    class:unread={!allRead(space.roomId)}
  >
    <Tooltip position="right">
      <img
        src={parseMxc(space?.avatar) ?? "https://www.adweek.com/wp-content/uploads/2018/07/confused-guy-meme-content-2018.jpg"}
        on:click={() => actions.spaces.focus(space)}
      />
      <b slot="tip">{space?.name ?? "unknown..."}</b>
    </Tooltip>
  </div>
	{/each}
</div>

