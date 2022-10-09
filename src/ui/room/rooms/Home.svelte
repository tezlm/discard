<script>
import Button from "../../atoms/Button.svelte";
</script>
<style>
.content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.content h1 {
  text-align: center;
}

.content .warning {  
  padding: 8px;
  margin: 1em 0 8px;
  border: solid var(--event-ping) 2px;
  background: var(--event-ping-bg);
  border-radius: 4px;
}

.buttons {
  display: grid;
  grid-gap: 8px;
  grid-template-columns: auto auto;
  margin-top: 1em;
}
</style>
<div class="content">
  <div style="display: flex; flex-direction: column">
    <h1>welcome to discard!</h1>
    <div class="warning">
      discard is pre-alpha, expect things to break!
    </div>
    <div class="buttons">
      <Button clicked={() => state.popup.set({ id: "create", type: "space" })}>Create Space</Button>
      <Button clicked={() => state.popup.set({ id: "create", type: "room" })}>Create Room</Button>
      <Button clicked={() => state.scene.set("user-settings")}>Open Settings</Button>
      <Button clicked={() => window.open("https://git.celery.eu.org/tezlm/discard")}>View Source</Button>
    </div>
    <!-- <Button clicked={() => window.open("https://git.celery.eu.org/tezlm/discard")}>View source</Button> -->
  </div>
</div>
