<script>
import Chat from './scenes/Chat.svelte';
import LoginRegister from './scenes/LoginRegister.svelte';
let flow = "chat";
if (!localStorage.getItem("token")) flow = "auth";
</script>
<style>
main {
  display: flex;
  height: 100vh;
}
</style>

<main>
  {#if flow === "chat"}
  <Chat />
  {:else}
  <LoginRegister />
  {/if}
</main>
