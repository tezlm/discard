<script>
import Search from "../atoms/Search.svelte";
import { parseHtml } from "../../util/html.js";
export let room;
const space = state.focusedSpace;
const settings = state.settings;
$: dark = $space && !room;

let roomfocus = false;
let search;
</script>
<style>
.header {
  display: flex;
  align-items: center;
  padding: 8px;
  height: 48px;
  box-shadow: var(--shadow-header);
  z-index: 2;
  max-width: 100%;
}

.dark {
  background: #2c2e33;
}

.name {
  font-family: var(--font-display);
  font-weight: 500;
  color: var(--fg-notice);
}

.spacer {
  width: 1px;
  background: var(--color-gray);
  height: 1.5em;
  margin: 8px;
}

.topic {
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.icon {
  font-size: 24px;
  margin: 0 8px;
  color: var(--fg-interactive);
  cursor: pointer;
}

.icon:hover {
  color: var(--fg-content);
}

.roomicon {
  color: var(--fg-dim);
}

.roomsearch {
  margin: 0 8px;
  position: relative;
}

.roomsearch .recent {
  position: absolute;
  background: var(--bg-context);
  width: 100%;
  top: 28px;
  padding: 8px;
  border-radius: 4px;
  box-shadow: var(--shadow-popup);
}

.roomsearch .title{
  padding: 4px 8px 0;
}

.roomsearch .option {
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
}

.roomsearch .option:hover {
  background: var(--bg-spaces);
}
</style>
<div class="header" class:dark={dark}>
  {#if room}
  <span class="roomicon icon">tag</span>
  {/if}
  <span class="name">{room ? room.name : "Home"}</span>
  {#if room?.topic}
  <div class="spacer"></div>
  <div class="topic" on:click={() => state.popup.set({ id: "info", head: room.name, body: parseHtml(room.topic, { linkify: true }), html: true })}>
    {@html parseHtml(room.topic, { linkify: true })}
  </div>
  {:else}
  <div style:flex={1}></div>
  {/if}
  {#if room}
  <div
    class="icon"
    style:color={$settings.get("showmemberlist") ? "var(--fg-notice)" : null}
    on:click={() => $settings.put("showmemberlist", !$settings.get("showmemberlist")) }
  >
    people
  </div>
  <!--
  <div class="roomsearch">
    <Search bind:focus={roomfocus} bind:value={search} />
    {#if roomfocus}
    <div class="recent">
      <div class="title">History</div>
      <div class="option" on:click={() => search = "Option 1"}>Option 1</div>
      <div class="option" on:click={() => search = "Option 2"}>Option 2</div>
      <div class="option" on:click={() => search = "Option 3"}>Option 3</div>
    </div>
    {/if}
  </div>
  -->
  {/if}
  <!--
  <div class="icon">inbox</div>
  <div class="icon">help</div>
  -->
</div>
