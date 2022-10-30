<script>
import Confirm from "./Confirm.svelte";
export let views, options;
let focused = views.find(i => i.view);
let { popup } = state;
let save, reset;

function handleClick(view) {
  if (save) return alert("unsaved changes"); // TODO: replace with animation
  view.clicked ? view.clicked() : focused = view;
}

let oldPopup;
$: setTimeout(() => oldPopup = $popup);

function handleKeyDown(e) {
  if (e.key === "Escape" && !oldPopup?.id) {
    state.scene.set("chat");
  }
}
</script>
<style>
.settings {
  background: var(--bg-content);
  flex: 1;
  display: flex;
}

.sidebar {
  background: var(--bg-rooms-members);
  min-width: calc(50% - 300px);
  overflow-y: auto;
}

nav {
  width: 218px;
  margin: 4em 0;
  margin-left: auto;
}

.item {
 	margin: 2px 8px 0;
	padding: 6px 10px;
	border-radius: 4px;
  color: var(--fg-interactive);
	font-size: 16px;
  font-weight: 500;
	cursor: pointer;
}

.item:hover {
	background: rgba(79,84,92,0.4);
  color: var(--fg-light);
}

.item.selected {
	color: var(--fg-content); 
	background: rgba(79,84,92,0.6);
}

.icon {
  float: right;
}

.main {
  flex: 1;
  display: flex;
  position: relative;
  justify-content: stretch;
}

.wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
  padding: 4em 2em 0;
  max-width: 740px;
  user-select: text;
}

.hidescroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hidescroll::-webkit-scrollbar {
  display: none;
}

.exit {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: 4em;
  height: fit-content;
  margin-right: 2em;
  user-select: none;
}

.exit .close {
  border: solid var(--color-gray-light) 3px;
  cursor: pointer;
  border-radius: 50%;
  font-size: 24px;
  height: 18px;
  width: 18px;
  padding: 16px;
  color: var(--fg-notice);
}

.exit .close:hover {
  background: var(--mod-lighten);
}

.exit .close:active {
  transform: translateY(1px);
}

.exit .keybind {
  margin-top: 4px;
  color: var(--fg-interactive);
  font-size: 14px;
  font-weight: 14px;
}

h1 {
  margin-bottom: 1em;
  font: 20px var(--font-display);
  font-weight: 500;
}

.separator {
  width: 180px;
  height: 1px;
  margin: 8px auto;
  background: #4F545C7b;
}

.title {
  margin: 12px 18px 6px;
  color: var(--fg-dim);
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
<div class="settings">
  <div class="sidebar hidescroll">
    <nav role="tablist">
      {#each views as view (view.id)}
        {#if view.label || view.split}
          {#if view.split}<div class="separator"></div>{/if}
          {#if view.label}<div class="title">{view.label}</div>{/if}
        {:else}
        <div on:click={() => handleClick(view)} class="item" class:selected={view.id === focused.id} style:color={view.color} role="tab">
          {view.name}
          {#if view.icon}
          <div class="icon">{view.icon}</div>
          {/if}
        </div>
        {/if}
      {/each}
    </nav>
  </div>
  <div class="main scroll">
    <div class="wrapper" role="tabpanel">
      {#if !focused.raw}
      <h1>{focused.name}</h1>
      {/if}
      <svelte:component this={focused.view} {...options} {...focused.props} bind:save={save} bind:reset={reset} />
      {#if save}
      <Confirm {save} reset={() => reset ? reset() : todo} />
      {/if}
    </div>
    <div class="exit">
      <div class="close icon" on:click={() => state.scene.set("chat")}>close</div>
      <div class="keybind">ESC</div>
    </div>
  </div>
</div>
<svelte:window on:keydown={handleKeyDown} />
