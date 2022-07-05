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
  width: calc(50% - 300px)
}

.main {
  position: relative;
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

.wrapper {
  margin: 0 2em;
  padding: 4em 0;
  width: 660px;
  height: 100vh;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  outline: none;
}

.wrapper::-webkit-scrollbar {
  display: none;
}

.exit {
  cursor: pointer;
  font-weight: 700;
  margin-top: 2em;
  margin-right: auto;
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
  <div class="sidebar">
    <nav>
      {#each views as view, i}
        {#if view}
        <div on:click={() => focused = views[i]} class="item" class:selected={view === focused}>{view.name}</div>
        {:else}
        <div class="separator"></div>
        {/if}
      {/each}
    </nav>
  </div>
  <div class="main">
    <div class="wrapper">
      <h1>{focused.name}</h1>
      <svelte:component this={focused.view} {...options} />
    </div>
  </div>
  <div class="exit" on:click={() => state.scene.set("chat")}>ESC</div>
</div>
<svelte:window on:keydown={handleKeyDown} />
