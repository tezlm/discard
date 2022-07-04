<script>
import Tooltip from "../atoms/Tooltip.svelte";

let focusedSpace = state.focusedSpace;
let spaceMap = state.spaceMap;

state.focusedSpace.subscribe(() => {
	spaceMap = state.spaceMap; // hacky svelte ;)
});

function isRead(room) {
	const userId = state.client.getUserId();
	const eventId = room.timeline[room.timeline.length - 1].getId();
	return room.hasUserReadEvent(userId, eventId);
}

function allRead(spaceId) {
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
  padding: 12px;
  padding-top: 4px;
  z-index: 3;
}

.space {
  position: relative;
}

.space.unread::before {
	content: "\2b24";
	position: absolute;
	color: var(--fg-content);
	font-size: 8px;
	left: -16px;
	top: 28px;
}

.space img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-top: 8px;
  cursor: pointer;
  transition: border-radius 0.2s;
}

.space:hover img {
  border-radius: 35%;
}

.space.selected img {
  border-radius: 35%;
}

.separator {
  border: solid #ffffff10 1px;
  width: 45%;
  margin-top: 8px;
}
</style>
<div class="nav">
  <div class="space">
    <Tooltip position="right" tip="Home">
      <img
        class={$focusedSpace ? "space" : "space selected"}
        src={state.client.mxcUrlToHttp("mxc://celery.eu.org/Wm9T9Nnch8IUQsVaJAInkaoVsgCJlmGx")}
        on:click={() => actions.spaces.focus(null)}
      />
    </Tooltip>
  </div>
  <div class="separator"></div>
	{#each $spaceMap.get("orphanSpaces") ?? [] as space}
  <div class={getClasses(space).join(" ")}>
    <Tooltip position="right">
      <img
        src={state.client.getRoom(space).getAvatarUrl(state.client.baseUrl)}
        on:click={() => actions.spaces.focus(space)}
      />
      <b slot="tip">{state.client.getRoom(space).name}</b>
    </Tooltip>
  </div>
	{/each}
</div>

