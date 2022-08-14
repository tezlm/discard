<script>
export let views, options;
let focused = views[0];
let popup = state.popup;

// TODO: categories

function handleKeyDown(e) {
  if (e.key === "Escape" && !$popup.id) {
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
	color: var(--fg-interactive);
	border-radius: 4px;
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
  position: sticky;
  top: 2em;
  margin-right: 2em;
  height: fit-content;
  color: var(--fg-interactive);
  font-weight: 700;
  cursor: pointer;
}

.exit:hover {
  color: var(--fg-notice);
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
</style>
<div class="settings">
  <div class="sidebar hidescroll">
    <nav>
      {#each views as view, i}
        {#if view}
        <div on:click={() => view.clicked ? view.clicked() : focused = view} class="item" class:selected={view === focused} style:color={view.color}>
          {view.name}
          {#if view.icon}
          <div class="icon">{view.icon}</div>
          {/if}
        </div>
        {:else}
        <div class="separator"></div>
        {/if}
      {/each}
    </nav>
  </div>
  <div class="main scroll">
    <div class="wrapper">
      {#if !focused.raw}
      <h1>{focused.name}</h1>
      {/if}
      <svelte:component this={focused.view} {...options} {...focused.props} />
    </div>
    <div class="exit" on:click={() => state.scene.set("chat")}>ESC</div>
  </div>
</div>
<svelte:window on:keydown={handleKeyDown} />
