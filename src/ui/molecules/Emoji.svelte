<script>
import twemoji from "twemoji";
import fuzzysort from "fuzzysort";
import shortJoypixels from "emojibase-data/en/shortcodes/joypixels.json";
import shortEmojibase from "emojibase-data/en/shortcodes/emojibase.json";
import emojis from "emojibase-data/en/compact.json";
import Input from "../atoms/Input.svelte";
const groups = parseEmoji();
export let selected;
let search = "";
let hover;

async function parseEmoji() {
  const groups = [[], [], [], [], [], [], [], [], [], []];
  for (let emoji of emojis) {
    if (emoji.group === 2) continue;
    groups[emoji.group ?? 8].push(emoji);
  }
  return groups;
}

async function getFiltered(search) {
  if (!search) return groups;
  return (await groups).map(i => fuzzysort
    .go(search, i, { key: "label", threshold: -1000 })
    .map(j => j.obj)
    .sort((a, b) => a.hexcode > b.hexcode ? 1 : -1)
    .sort((a, b) => a.order > b.order ? 1 : -1)
  );
}

function getGroupName(id) {
  switch(id) {
    case 0: return "Faces";
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

function getShortcode(hex) {
  const codes = shortJoypixels[hex] ?? shortEmojibase[hex];
  return Array.isArray(codes) ? codes[0] : codes;
}

function getTwemoji(unicode) {
  return twemoji.parse(unicode, {
    attributes: () => ({ loading: 'lazy' }),
    folder: "svg",
    ext: ".svg",
  });
}

async function handleSubmit(value, e) {
  if (e.ctrlKey) {
    selected(value, e.shiftKey);
  } else {
    const filtered = await getFiltered(search);
    const group = filtered.find(i => i.length);
    const emoji = group?.[0]?.unicode;
    if (emoji) selected(emoji, e.shiftKey);
  }
}
</script>
<style>
.selector {
  display: grid;
  grid-template-columns: 48px auto;
  grid-template-rows: 64px auto 48px;
  height: 420px;
  width: 420px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow-popup);
  user-select: none;
}

.header {
  grid-column: 1/3;
  background: var(--bg-rooms-members);
  box-shadow: var(--shadow-header);
  z-index: 1;
  padding: 16px;
}

.categories {
  grid-row: 2/4;
  display: flex;
  flex-direction: column;
  padding: 4px 0;
  background: var(--bg-spaces);
}

.categories .icon {
  font-size: 24px;
  margin: 4px 0;
  color: var(--fg-interactive);
  cursor: pointer;
}

.categories .icon:hover {
  color: var(--fg-notice);
}

.emojis {
  background: var(--bg-rooms-members);
  overflow-y: scroll;
  scrollbar-width: thin;
}

.group {
  display: grid;
  grid-template-columns: repeat(auto-fill, 40px);  
  padding: 4px;
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
  font-size: 30px;
  height: 40px;
  width: 40px;
  padding: 4px;
  border-radius: 4px;
}

.emojis .emoji:hover {
  cursor: pointer;
}

.emojis .emoji:hover {
  background: var(--color-gray-light);
}

.preview {
  display: flex;
  background: var(--bg-misc);
  align-items: center;
}

.preview .emoji {
  margin: 0 8px;
}
</style>
<div class="selector" on:clickstopPropagation>
  <div class="header">
    <Input
      small optional
      placeholder="search do it you wont"
      bind:value={search}
      submitted={handleSubmit}
      escaped={() => selected(null, false)}
    />
  </div>
  <div class="categories">
    <div class="icon">emoji_emotions</div>
    <div class="icon">emoji_people</div>
    <div class="icon">park</div>
    <div class="icon">emoji_food_beverage</div>
    <div class="icon">snowmobile</div>
    <div class="icon">emoji_events</div>
    <div class="icon">emoji_objects</div>
    <div class="icon">emoji_symbols</div>
    <div class="icon">flag</div>
  </div>
  <div class="emojis">
    {#await getFiltered(search)}
      <div style="display: flex; align-items: center; justify-content: center; width 100%; height: 100%">getting emoji...</div>
    {:then filtered}
      {#each filtered as emojis, i (i)}
        {#if emojis && emojis.length}
        <div class="label">{getGroupName(i)}</div>
        <div class="group">
        {#each emojis as emoji (emoji.unicode)}
          <div
            class="emoji"
            on:mouseover={() => hover = emoji}
            on:focus={() => hover = emoji}
            on:click={(e) => selected(emoji.unicode, e.shiftKey)}
          >
            {@html getTwemoji(emoji.unicode)}
          </div>
        {/each}
        </div>
        {/if}
      {/each}
      {#if filtered.every(i => i.length === 0)}
        <div style="display: flex; align-items: center; justify-content: center; width 100%; height: 100%">no emoji :(</div>
      {/if}
    {/await}
  </div>
  <div class="preview">
    {#if hover}
    <div class="emoji">{@html getTwemoji(hover.unicode)}</div>
    <b>:{getShortcode(hover.hexcode)}:</b>
    {/if}
  </div>
</div>
