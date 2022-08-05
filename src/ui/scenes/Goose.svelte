<script>
function handleKeyDown(e) {
  if (e.key === "Escape") {
    state.scene.set("chat");
  }
}
</script>
<style>
.goose {
  background: var(--bg-content);
  flex: 1;
  display: flex;
  justify-content: center;
}

.content {
  width: 500px;
  margin: 2em 2em;
}

.exit {
  position: absolute;
  top: 2em;
  right: 2em;
  height: fit-content;
  color: var(--fg-interactive);
  font-weight: 700;
  cursor: pointer;
}

h1 {
  text-align: center;
}

.cards {
  display: flex;
  overflow-x: scroll;
}

.card {
  min-width: 200px;
  height: 200px;
  margin-right: 16px;
  background: var(--bg-rooms-members);
  border-radius: 5px;
  overflow: hidden;
}

.card .header { 
  padding: 8px;
  text-align: center;
  background: var(--bg-spaces);
}

.card ul {
  padding: 8px;
}

.exit:hover {
  color: var(--fg-notice);
}
</style>
<div class="goose">
  <div class="content">
    <h1>Space Goose</h1>
    level 0<br />
    boost this space to get nothing
    <br />
    <br />
    <div class="cards">
      <div class="card">
        <div class="header">Level 0</div>
        <ul>
          <li>nothing</li>
        </ul>
      </div>
      <div class="card">
        <div class="header">Level 1</div>
        <ul>
          <li>nothing useful</li>
        </ul>
      </div>
      <div class="card">
        <div class="header">Level 2</div>
        <ul>
          <li>still not much useful</li>
        </ul>
      </div>
      <div class="card">
        <div class="header">Level 3</div>
        <ul>
          <li>i stop bothering you</li>
        </ul>
      </div>
    </div>
  </div>
  <div class="exit" on:click={() => state.scene.set("chat")}>ESC</div>
</div>
<svelte:window on:keydown={handleKeyDown} />
