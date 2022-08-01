<script>
export let onclick = () => {};
export let onclose = () => {};
export let event;

function handleClose(e) {
  e.stopImmediatePropagation();
  onclose();
}
</script>
<style>
.reply {
  position: relative;
  background: var(--bg-rooms-members);
  padding: .5rem 16px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  color: var(--fg-interactive);
  font-size: 14px;
  cursor: pointer;
}

.reply .close {
  position: absolute;
  display: flex;
  align-items: center;
  height: 100%;
  top: 0;
  right: 0;
  padding: 0 18px;

  font-size: 18px;
  cursor: pointer;
  color: var(--fg-interactive);
}

.close:hover {
  color: var(--fg-content);  
}
</style>
<div class="reply" on:click={onclick}>
  <div>Replying to <b>{event.sender.name || event.sender.userId}</b></div>
  <div class="close icon" on:click={handleClose}>cancel</div>
</div>
