<script>
import Loading from './scenes/Loading.svelte';
import Chat from './scenes/Chat.svelte';
import LoginRegister from './scenes/LoginRegister.svelte';
import UserSettings from './scenes/UserSettings.svelte';
import SpaceSettings from './scenes/SpaceSettings.svelte';
import RoomSettings from './scenes/RoomSettings.svelte';
import Popups from './Popups.svelte';
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

scene.subscribe(() => {
  state.log.ui("switch scene to " + $scene);
});
</script>
<style>
main {
  display: flex;
  height: 100vh;
  user-select: none;
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

.chat {
  transition: transform 300ms ease-in-out;
}

.chat.hide {
  transform: scale(0.9);
}
</style>
<main>
  {#if $scene !== "auth"}
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
<Popups />
<ContextMenus />
