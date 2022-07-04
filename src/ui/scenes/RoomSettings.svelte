<script>
// TODO: merge code with UserSettings
import { onMount, onDestroy } from 'svelte';
import Overview from "../settings/room/Overview.svelte";

let userid = state.client.getUserId();
let focusedView = "overview";

// TODO: categories
const views = [
  { id: "overview",      name: "Overview" },
  { id: "permissions",   name: "Permissions" },
  null,
  { id: "members",       name: "Members" },
  { id: "bans",          name: "Bans" },
  { id: "invites",       name: "Invites" },
  null,
  { id: "archive",       name: "Archive Room" },
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
	color: var(--fg-interactive);
	border-radius: 4px;
	font-size: 16px;
	font-weight: 500;
	cursor: pointer;
  font-weight: semibold;
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
      {#if view}
      <div on:click={() => focusedView = view.id} class={focusedView === view.id ? "item selected" : "item"}>{view.name}</div>
      {:else}
      <div class="separator"></div>
      {/if}
      {/each}
    </nav>
  </div>
  <div class="main">
    <div class="wrapper">
      <h1>{views.find(i => i?.id === focusedView).display ?? views.find(i => i?.id === focusedView).name}</h1>
      <!-- TODO: clean this up/DRY, maybe use svelte:component? -->
      {#if focusedView === "overview"}
        <Overview />
      {:else if focusedView === "permissions"}
        <p>todo: list power levels for each permission</p>
      {:else if focusedView === "members"}
        <p>todo: show joined users, ban and change power levels</p>
      {:else if focusedView === "bans"}
        <p>todo: show banned users and reason, unban</p>
      {:else if focusedView === "invites"}
        <p>todo: show invited users, copy-able matrix.to invite link if public</p>
      {:else if focusedView === "archive"}
        <p>todo: idk what to put here, tombstone event, maybe remove room from space, make a button instead of section.</p>
        <p>what about upgrading?</p>
      {/if}
    </div>
  </div>
  <div class="exit" on:click={() => state.scene.set("chat")}>ESC</div>
</div>
