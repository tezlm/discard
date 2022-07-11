<script>
export let users;
</script>
<style>
.typing {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.typing > .dot {
  height: 6px;
  width: 6px;
  border-radius: 50%;
  margin-right: 2px;
  background: var(--fg-notice);
  animation: typing 1s infinite;
}

@keyframes typing {
  0% { transform: scale(1); opacity: .5 }
  40% { transform: scale(1.2); opacity: 1 }
  80% { transform: scale(1); opacity: .5 }
  100% { transform: scale(1); opacity: .5 }
}

.users {
  margin-left: -3px;
  padding-bottom: 4px;
}
</style>
<div class="typing">
  <div class="dot"></div>
  <div class="dot" style="animation-delay: 0.2s"></div>
  <div class="dot" style="animation-delay: 0.4s; margin-right: 9px"></div>
  <div class="users">
    {#if users.length === 1}
      <b>{users[0]}</b>
    {:else if users.length === 2}
      <b>{users[0]}</b> and <b>{users[1]}</b>
    {:else if users.length === 3}
      <b>{users[0]}</b>, <b>{users[1]}</b>, and <b>{users[2]}</b> 
    {:else if users.length === 4}
      <b>{users[0]}</b>, <b>{users[1]}</b>, <b>{users[2]}</b>, and <b>{users[3]}</b> 
    {:else}
      <b>{users[0]}</b>, <b>{users[1]}</b>, <b>{users[2]}</b>, <b>{users[3]}</b>, and {users.length - 4} {#if users.length === 5}other{:else}others{/if}
    {/if}
    {#if users.length === 1}is{:else}are{/if} typing...
  </div>
</div>
