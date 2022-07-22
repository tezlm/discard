<script>
import Context from "../../atoms/Context.svelte";
let context = null;
</script>
<style>
.popout {
  width: 300px;
  padding: 16px;
  background: var(--bg-context);
  border-radius: 8px;
  box-shadow: var(--shadow-popup);
}

.popout img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.popout h3 {
  margin-top: 16px;
  font-weight: 500;
  font-family: var(--font-display);
  color: var(--fg-notice);
}

.popout .id {
  color: var(--fg-muted);
  font-size: 14px;
  user-select: all;
}

.autocomplete {
  background: var(--bg-rooms-members);
  border-radius: 5px;
  box-shadow: var(--shadow-popup);
  overflow: hidden scroll;
  padding: 8px;
  min-width: 430px;
  max-width: 800px;
}

.option {
  border-radius: 5px;
  padding: 8px;
}

.option:hover {
  background: var(--bg-content);
}
</style>
<p>testbed for random stuff</p>
<br />
<div on:contextmenu={(e) => {
  e.preventDefault();
  context = {
    x: e.x, 
    y: e.y, 
  };
}}>
  right click
</div>
{#if context}
<Context x={context.x} y={context.y} items={[
  { label: "Mark As Read", clicked: todo },
  null,
  { label: "Settings", clicked: todo, submenu: [
    { label: "Foo", clicked: todo },
    { label: "Bar", clicked: todo },
    { label: "Bar", clicked: todo },
  ] },
  null,
  { label: "Invite", clicked: todo, color: "var(--color-accent)" },
  null,
  { label: "Leave", clicked: todo, color: "var(--color-red)" },
  null,
  { label: "Copy ID", clicked: todo },
]} />
{/if}
<svelte:window on:click={() => context = null} />
<br />
<!--
<Context items={[
  { label: "Profile", clicked: todo },
  { label: "Message", clicked: todo },
  { label: "Block", clicked: todo },
  null,
  { label: "Kick [user]", clicked: todo, color: "var(--color-red)" },
  { label: "Ban [user]", clicked: todo, color: "var(--color-red)" },
  null,
  { label: "Copy ID", clicked: todo },
]} />
<br />
-->
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<div class="popout">
  <a href="https://celery.eu.org/_matrix/media/r0/download/celery.eu.org/h7g7YzhWoMJXVaOBT0vpOheqaOEQBhxY">
    <img src="https://celery.eu.org/_matrix/media/r0/download/celery.eu.org/h7g7YzhWoMJXVaOBT0vpOheqaOEQBhxY" />
  </a>
  <h3>Display Name</h3>
  <div class="id">@username:example.com</div>
</div>
<br />
<div class="autocomplete">
  <h3>Commands matching <b>/</b></h3>
  <div class="option">foo</div>
  <div class="option">bar</div>
  <div class="option">baz</div>
</div>
