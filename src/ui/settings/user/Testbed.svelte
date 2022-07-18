<script>
import Input from "../../atoms/Input.svelte";
import { quadOut } from 'svelte/easing';
let checked = false;

function toggle() {
  return {
    duration: 500,
    easing: quadOut,
    css: t => `opacity: ${t * 10}`,
  }
}
</script>
<style>
.selector {
  display: grid;
  grid-template-columns: 48px auto;
  grid-template-rows: 64px auto 48px;
  background: blue;
  height: 420px;
  width: 420px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow-popup);
}

.emojis {
  display: grid;
  grid-template-columns: repeat(auto-fill, 40px);
  background: var(--bg-rooms-members);
  overflow-y: scroll;
}

.emoji {
  height: 40px;
  width: 40px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji:hover {
  background: var(--color-gray-light);
}

.header {
  grid-column: 1/3;
  background: var(--bg-rooms-members);
  box-shadow: var(--shadow-header);
  z-index: 1;
  padding: 16px;
}

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

.toggle {
  display: block;
  position: relative;
  height: 24px;
  width: 40px;
  background: var(--fg-dim);
  border-radius: 16px;
}

.toggle input {
  display: none;
}

.toggle .slider {
  position: absolute;
  top: 3px;
  left: 3px;
  height: 18px;
  width: 18px;
  background: var(--fg-notice);
  border-radius: 50%;
  transition: all 200ms;
}

.toggle.checked {
  background: var(--color-green);
}

.slider.checked {
  left: calc(100% - 18px - 3px);
}
</style>
<p>testbed for random stuff</p>
<br>
<label class="toggle" class:checked>
  <input type="checkbox" bind:checked>
  <div class="slider" class:checked></div>
</label>
<div class="selector">
  <div class="header">
    <Input small placeholder="search do it you wont" />
  </div>
  <div style="grid-row: 2/4; background: var(--bg-spaces)"></div>
  <div class="emojis">
    {#each new Array(100) as _, i}
    <div class="emoji">{String.fromCodePoint(i + 127744)}</div>
    {/each}
  </div>
  <div style="background: var(--bg-misc)"></div>
</div>
<br>
<div class="popout">
  <a href="https://celery.eu.org/_matrix/media/r0/download/celery.eu.org/h7g7YzhWoMJXVaOBT0vpOheqaOEQBhxY">
    <img src="https://celery.eu.org/_matrix/media/r0/download/celery.eu.org/h7g7YzhWoMJXVaOBT0vpOheqaOEQBhxY" />
  </a>
  <h3>Display Name</h3>
  <div class="id">@username:example.com</div>
</div>
<br>
