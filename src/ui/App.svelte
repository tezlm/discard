<script>
import Chat from './scenes/Chat.svelte';
import LoginRegister from './scenes/LoginRegister.svelte';
import Settings from './scenes/Settings.svelte';
let scene = state.scene;
</script>
<style>
main {
  display: flex;
  height: 100vh;
}
</style>

<main>
  {#if $scene === "chat"}
  <Chat />
  {:else if $scene === "settings"}
  <Settings />
  {:else}
  <LoginRegister />
  {/if}
</main>
