<script>
import emojis from "emojibase-data/en/compact.json";
import Input from "../../atoms/Input.svelte";
const groups = [[], [], null, [], [], [], [], [], [], []];
let selected;

for (let emoji of emojis) {
  if (emoji.group === 2) continue;
  groups[emoji.group ?? 8].push(emoji);
}

function getGroupName(id) {
  switch(id) {
    case 0: return "Smilies";
    case 1: return "People";
    case 2: return "???";
    case 3: return "Animals & nature";
    case 4: return "Food & Drink";
    case 5: return "Travel & Places";
    case 6: return "Activities";
    case 7: return "Objects";
    case 8: return "Symbols";
    case 9: return "Flags";
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
  background: var(--bg-rooms-members);
  overflow-y: scroll;
}

.group {
  display: grid;
  grid-template-columns: repeat(auto-fill, 40px);  
}

.emojis .label {
  position: sticky;
  top: 0;
  padding: 8px;

  background: var(--bg-rooms-members);
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
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

.preview {
  display: flex;
  background: var(--bg-misc);
  align-items: center;
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
<br>
<div class="selector">
  <div class="header">
    <Input small placeholder="search do it you wont" />
  </div>
  <div style="grid-row: 2/4; background: var(--bg-spaces)"></div>
  <div class="emojis">
    {#each groups as emojis, i}
      {#if emojis}
      <div class="label">{getGroupName(i)}</div>
      <div class="group">
      {#each emojis as emoji}
        <div class="emoji" on:mouseover={() => selected = emoji}>{emoji.unicode}</div>
      {/each}
      </div>
      {/if}
    {/each}
  </div>
  <div class="preview">
    {#if selected}
    <div class="preview">{selected?.unicode}</div>
    <b>{selected.label}</b>
    {/if}
  </div>
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
<div class="autocomplete">
  <h3>Commands matching <b>/</b></h3>
  <div class="option">foo</div>
  <div class="option">bar</div>
  <div class="option">baz</div>
</div>
