<script>
import Loading from './scenes/Loading.svelte';
import Chat from './scenes/Chat.svelte';
import LoginRegister from './scenes/LoginRegister.svelte';
import UserSettings from './scenes/UserSettings.svelte';
import SpaceSettings from './scenes/SpaceSettings.svelte';
import RoomSettings from './scenes/RoomSettings.svelte';
import Popups from './Popups.svelte';
import { quadOut } from 'svelte/easing';
let scene = state.scene;

function opacity() {
  return {
    duration: 1000,
    easing: quadOut,
    css: t => `opacity: ${t * 20}`,
  }
}

function ease() {
  return {
    duration: 200,
    easing: quadOut,
    css: t => `opacity: ${Math.min(t * 1.5, 1)}; transform: scale(${1.1 - t / 10})`,
  }
}

function easeInv() {
  return {
    duration: 200,
    easing: quadOut,
    css: t => `transform: scale(${0.9 + t / 10})`,
  }
}
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

.loading {
  z-index: 10;
}

.settings {
  z-index: 5;
}
</style>
<main>
  {#if $scene === "chat"}
  <div transition:easeInv><Chat /></div>
  {:else if $scene === "user-settings"}
  <div class="settings" transition:ease><UserSettings /></div>
  {:else if $scene === "space-settings"}
  <div class="settings" transition:ease><SpaceSettings /></div>
  {:else if $scene === "room-settings"}
  <div class="settings" transition:ease><RoomSettings /></div>
  {:else if $scene === "auth"}
  <LoginRegister />
  {:else}
  <div class="loading" transition:opacity><Loading /></div>
  {/if}
</main>
<Popups />
