<script>
// TODO: merge code with SpaceSettings
import { onMount, onDestroy } from 'svelte';
import Homeserver from '../settings/user/Homeserver.svelte';
import Account from '../settings/user/Account.svelte';
import PrivacySecurity from '../settings/user/PrivacySecurity.svelte';

let userid = state.client.getUserId();
let focusedView = "account";

const views = [
  { id: "account",       name: "My Account" },
  { id: "privsec",       name: "Privacy and Security" },
  { id: "homeserver",    name: "Homeserver" },
  { id: "notifications", name: "Notifications" },
];

function handleKeyDown(e) {
  if (e.key === "Escape") state.scene.set("chat");
}

onDestroy(() => document.removeEventListener("keydown", handleKeyDown));
onMount(() => document.addEventListener("keydown", handleKeyDown));
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
	color: var(--fg-dim);
	border-radius: 4px;
	font-size: 16px;
	cursor: pointer;
  font-weight: 500;
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
  margin-top: 2em;
  margin-right: auto;
}

h1 {
  margin-bottom: 1em;
  font: 20px var(--font-display);
  font-weight: 500;
}

.separator {
  width: 202px;
  height: 1px;
  margin: 8px auto;
  background: #4F545C7b;
}
</style>
<div class="settings">
  <div class="sidebar">
    <nav>
      {#each views as view}
      <div on:click={() => focusedView = view.id} class={focusedView === view.id ? "item selected" : "item"}>{view.name}</div>
      {/each}
    </nav>
  </div>
  <div class="main">
    <div class="wrapper">
      <h1>{views.find(i => i?.id === focusedView).name}</h1>
      {#if focusedView === "account"}
        <Account />
      {:else if focusedView === "privsec"}
        <PrivacySecurity />
      {:else if focusedView === "homeserver"}
        <Homeserver />
      {:else if focusedView === "notifications"}
        <p>todo: show a way to edit notifications similar to element</p>
      {/if}
    </div>
  </div>
  <div class="exit" on:click={() => state.scene.set("chat")}>ESC</div>
</div>
