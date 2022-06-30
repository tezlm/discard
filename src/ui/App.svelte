<script>
import Chat from './scenes/Chat.svelte';
import LoginRegister from './scenes/LoginRegister.svelte';
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
  {:else}
  <LoginRegister />
  {/if}
</main>
