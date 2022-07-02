<script>
import Tooltip from "../atoms/Tooltip.svelte";

let focusedSpace = state.focusedSpace;
let spaceMap = state.spaceMap;

state.focusedSpace.subscribe(() => {
	spaceMap = state.spaceMap; // hacky svelte ;)
});

function getClasses(space) {
	const classes = ["space"];
	if ($focusedSpace === space) classes.push("selected");
	return classes;
}
</script>
<style>
.nav {
  background: var(--bg-spaces);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4px;
  width: 72px;
}

.space {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-top: 8px;
  cursor: pointer;
  border: solid var(--bg-rooms-members) 0;
  transition: border-radius 0.2s, border 0.05s;
}

.space:hover {
  border-radius: 35%;
}

.space.selected {
  border-radius: 35%;
  border: solid var(--bg-rooms-members) 3px;
}

.separator {
  border: solid #ffffff10 1px;
  width: 45%;
  margin-top: 8px;
}
</style>
<div class="nav">
  <img
    class={$focusedSpace ? "space" : "space selected"}
    src={state.client.mxcUrlToHttp("mxc://celery.eu.org/Wm9T9Nnch8IUQsVaJAInkaoVsgCJlmGx")}
    on:click={() => actions.spaces.focus(null)}
  />
  <div class="separator"></div>
	{#each $spaceMap.get("orphanSpaces") ?? [] as space}
  <Tooltip position="right">
    <img
      class={getClasses(space).join(" ")}
      src={state.client.getRoom(space).getAvatarUrl(state.client.baseUrl)}
      on:click={() => actions.spaces.focus(space)}
    />
    <b slot="tip">{state.client.getRoom(space).name}</b>
  </Tooltip>
	{/each}
</div>

