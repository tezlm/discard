<script>
// TODO: this whole file is a mess and needs to be refactored
import { onMount, onDestroy } from 'svelte';
import RoomNav from '../nav/RoomNav.svelte';
import SpaceNav from '../nav/SpaceNav.svelte';
import Homeserver from '../settings/Homeserver.svelte';
import Account from '../settings/Account.svelte';
import PrivacySecurity from '../settings/PrivacySecurity.svelte';

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
  flex: 1;
}

nav {
  width: 240px;
  margin: 4em 0;
  margin-left: auto;
}

.item {
	margin: 2px 8px;
	padding: 6px 10px;
	color: var(--fg-dim);
	border-radius: 4px;
	font-size: 16px;
	cursor: pointer;
  font-weight: bold;
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
  width: 600px;
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
  position: absolute;
  top: 2em;
  left: 660px;
  cursor: pointer;
}

h2 {
  margin-bottom: 1em;
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
    <div class="exit" on:click={() => state.scene.set("chat")}>ESC</div>
    <div class="wrapper">
      {#if focusedView === "account"}
        <h2>My Account</h2>
        <Account />
      {:else if focusedView === "privsec"}
        <h2>Privacy and Security</h2>
        <PrivacySecurity />
      {:else if focusedView === "homeserver"}
        <h2>Homeserver</h2>
        <Homeserver />
      {:else if focusedView === "notifications"}
        <h2>Notifications</h2>
        <p>todo: show a way to edit notifications similar to element</p>
      {/if}
    </div>
  </div>
</div>
