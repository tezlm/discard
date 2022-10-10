<script>
import Button from "../../atoms/Button.svelte";
</script>
<style>
.content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
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
  grid-template-columns: 300px 300px;
  margin-top: 1em;
}

.button {
  display: flex;
  text-align: left;
}

.button .icon {
  font-size: 32px;
  margin-right: 16px;
}

.button .description {
  font-weight: normal;
}
</style>
<div class="content">
  <div style="display: flex; flex-direction: column">
    <h1>welcome to discard!</h1>
    <div class="warning">
      discard is pre-alpha, expect things to break!
    </div>
    <div class="buttons">
      <Button clicked={() => state.popup.set({ id: "create", type: "room" })}>
        <div class="button">
          <div class="icon">tag</div>
          <div style="flex: 1">
            <div>Create room</div>
            <div class="description">Create a chatroom to talk in</div>
          </div>
        </div>
      </Button>
      <Button clicked={() => state.popup.set({ id: "create", type: "space" })}>
        <div class="button">
          <div class="icon">folder</div>
          <div style="flex: 1">
            <div>Create Space</div>
            <div class="description">Use spaces to organize rooms</div>
          </div>
        </div>
      </Button>
      <Button clicked={todo}>
        <div class="button">
          <div class="icon">person</div>
          <div style="flex: 1">
            <div>Start DM</div>
            <div class="description">Start a converation with someone</div>
          </div>
        </div>
      </Button>
      <Button clicked={todo}>
        <div class="button">
          <div class="icon">explore</div>
          <div style="flex: 1">
            <div>Explore Rooms</div>
            <div class="description">Find public rooms to talk in</div>
          </div>
        </div>
      </Button>
      <Button clicked={() => state.scene.set("user-settings")}>
        <div class="button">
          <div class="icon">settings</div>
          <div style="flex: 1">
            <div>Open Settings</div>
            <div class="description">Set up and configure some stuff</div>
          </div>
        </div>
      </Button>
      <Button clicked={() => window.open("https://git.celery.eu.org/tezlm/discard")}>
        <div class="button">
          <div class="icon">code</div>
          <div style="flex: 1">
            <div>View Source</div>
            <div class="description">Check out the source code on gitea</div>
          </div>
        </div>
      </Button>
    </div>
  </div>
</div>
