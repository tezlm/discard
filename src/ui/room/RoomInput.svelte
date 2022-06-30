<script>
export let placeholder;
let rows = 1;

function handleInput(e) {
  const value = e.target.value;
  if (e.key === "Backspace" || e.key === "Delete" || (e.key === "Enter" && e.shiftKey)) {
    rows = Math.min(value.split("\n").length, 10);
  } else if (e.key === "Enter" && value.trim()) {
    state.client.sendEvent(state.focusedRoomId, null, "m.room.message", { body: value.trim() });
    e.target.value = "";
  }
}
</script>
<style>
.input {
  padding: 12px;
  margin: 0 16px 0;
  border-radius: 8px;
  background: #40444b;
}

.input textarea {
  font: inherit;
  background: none;
  color: var(--fg-content);
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  resize: none;
}
</style>
<div class="input">
  <textarea rows={rows} on:keydown={e => setTimeout(() => handleInput(e), 1)} placeholder={placeholder}></textarea>
</div>
