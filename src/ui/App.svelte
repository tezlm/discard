<script>
import Chat from './scenes/Chat.svelte';
import LoginRegister from './scenes/LoginRegister.svelte';
import Settings from './scenes/Settings.svelte';
import { quadOut } from 'svelte/easing';
let scene = state.scene;

function ease(node) {
  return {
    duration: 150,
    easing: quadOut,
    css: t => `opacity: ${Math.min(t * 1.5, 1)}; transform: scale(${1.1 - t / 10})`,
  }
}

function easeInv(node) {
  return {
    duration: 150,
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
</style>

<main>
  {#if $scene === "chat"}
  <div transition:easeInv><Chat /></div>
  {:else if $scene === "settings"}
  <div transition:ease style="z-index: 999"><Settings /></div>
  {:else if $scene !== "chat"}
  <div transition:ease><LoginRegister /></div>
  {/if}
</main>
