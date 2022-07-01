<script>
// TODO: this whole file is a mess and needs to be refactored
import { onMount, onDestroy } from 'svelte';
import RoomNav from '../nav/RoomNav.svelte';
import SpaceNav from '../nav/SpaceNav.svelte';
import { getAvatar, getDisplayName } from '../../util/events.js';
let userid = state.client.getUserId();
let focusedView = "account";

const views = [
  { id: "account",       name: "My Account" },
  { id: "privsec",       name: "Privacy and Security" },
  { id: "homeserver",    name: "Homeserver" },
  { id: "notifications", name: "Notifications" },
];

function formatSize(size) {
  if (!size) return "??? kb";
  let max = 1024;
  for (let unit of ["bytes", "KiB", "MiB", "GiB", "TiB"]) {
    if (size < max) return `${Math.floor(size / (max / 1024))} ${unit}`;
    max *= 1024;
  }
  return "very big";
}

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
  margin: 4em 2em;
  width: 600px;
  position: relative;
}

.homeserver {
  border: solid var(--bg-spaces) 1px;
  background: var(--bg-rooms-members);
  padding: 1em;
  border-radius: 3px;
}

.big {
  font-size: 1.5em;
  font-weight: bold;
}

.account {
  background: var(--bg-spaces);
  border-radius: 6px;
  padding: 1em;
  display: flex;
}

.account > img {
  border-radius: 50%;
  height: 72px;
  width: 72px;
  margin-right: 1em;
}

.account > .details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.exit {
  position: absolute;
  top: 0;
  right: -4em;
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
    <div class="wrapper">
      <div class="exit" on:click={() => state.scene.set("chat")}>ESC</div>
      {#if focusedView === "account"}
        <h2>My Account</h2>
        <div class="account">
          <img src={getAvatar(userid)} />
          <div class="details">
            <span class="big">{getDisplayName(userid)}</span>
            <span>{userid}</span>
          </div>
        </div>
      {:else if focusedView === "privsec"}
        <h2>Privacy and Security</h2>
        <p>todo: show sessions?</p>
      {:else if focusedView === "homeserver"}
        <h2>Homeserver</h2>
        <div class="homeserver">
          You are connected to<br>
          <span class="big">{localStorage.getItem("homeserver")}</span>
        </div>
        <br />
        {#await state.client.getMediaConfig()}
        <p>Max file size: loading..</p>
        {:then config}
        <p>Max file size: <b>{formatSize(config["m.upload.size"])}</b></p>
        {/await}
        {#await state.client.getCapabilities()}
        <p>Loding server capabilities</p>
        {:then cap}
        <p>You <b>{cap["m.change.password"]?.enabled ? "can" : "cannot"}</b> change your password</p>
        <p>The server supports room versions <b>{Object.entries(cap["m.room_versions"].available).map(i => i[0] + (i[1] === "unstable" ? " (unstable)" : "")).join(", ")}</b></p>
        <p>The default room version is <b>{cap["m.room_versions"].default}</b></p>
        {/await}
      {:else if focusedView === "notifications"}
        <h2>Notifications</h2>
        <p>todo: show a way to edit notifications similar to element</p>
      {/if}
    </div>
  </div>
</div>
