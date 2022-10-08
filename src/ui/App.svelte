<script>
import Loading from './scenes/Loading.svelte';
import Chat from './scenes/Chat.svelte';
import LoginRegister from './scenes/LoginRegister.svelte';
import UserSettings from './scenes/UserSettings.svelte';
import SpaceSettings from './scenes/SpaceSettings.svelte';
import RoomSettings from './scenes/RoomSettings.svelte';
import Popups from './Popups.svelte';
import Popouts from './Popouts.svelte';
import ContextMenus from './ContextMenus.svelte';
import { quadInOut, quartInOut } from 'svelte/easing';
let scene = state.scene;

function opacity() {
  return {
    duration: 500,
    easing: quadInOut,
    css: t => `opacity: ${t * 10}`,
  }
}

function ease() {
  return {
    duration: 300,
    easing: quartInOut,
    css: t => `opacity: ${Math.min(t * 2, 1)}; transform: scale(${1.1 - t / 10})`,
  }
}

function easeRev() {
  return {
    duration: 300,
    easing: quartInOut,
    css: t => `transform: scale(${.9 + (t / 10)})`,
  }
}

function handleClick(e) {
  const ping = e.target.getAttribute("data-mx-ping");
  if (ping) {
    state.popup.set({ id: "user", userId: ping });
  }
}

let focusedRoom = state.focusedRoom;
scene.subscribe(() => {
  state.log.ui("switch scene to " + $scene);
  // disabled for now because copied link doesn't actually do anything
  // location.hash = `/${$scene}/${$focusedRoom?.roomId ?? ""}`; // TODO: better routing
});

// focusedRoom.subscribe(() => {
  // location.hash = `/${$scene}/${$focusedRoom?.roomId ?? ""}`; // TODO: better routing
// });
</script>
<style>
main {
  display: flex;
  height: 100vh;
}

main > div {
  position: fixed;
  display: flex;
  width: 100%;
  height: 100%;
}

.chat {
  transition: transform 300ms ease-in-out;
}

.chat.hide {
  transform: scale(0.9);
}

.settings { z-index: 1 }
.loading { z-index: 2 }

.layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 10;
}

.layer.context {
  z-index: 20;
}
</style>
<main>
  <!--
  {#if $scene === "chat"}
  <div class="chat" transition:easeRev><Chat /></div>
  -->
  {#if $scene !== "loading" && $scene !== "auth"}
  <div class="chat" class:hide={$scene !== "chat"}><Chat /></div>
  {/if}
  {#if $scene === "user-settings"}
  <div class="settings" transition:ease><UserSettings /></div>
  {:else if $scene === "space-settings"}
  <div class="settings" transition:ease><SpaceSettings /></div>
  {:else if $scene === "room-settings"}
  <div class="settings" transition:ease><RoomSettings /></div>
  {:else if $scene === "auth"}
  <LoginRegister />
  {:else if $scene !== "chat"}
  <div class="loading" transition:opacity><Loading /></div>
  {/if}
</main>
<div class="layer"><Popups /></div>
<div class="layer"><Popouts /></div>
<div class="layer context"><ContextMenus /></div>
<svelte:window on:click={handleClick} />
