<script>
import Search from "../atoms/Search.svelte";
import { parseHtml } from "../../util/html.js";
export let room;
let space = state.focusedSpace;
let settings = state.settings;
$: dark = $space && !room;

// move dm status into the room object?
let dms = state.dms;
function getName(room) {
	if (!dms.has(room.roomId)) return room.name;
	// return room.name.toLowerCase().replace(/ /g, "-").replace(/^#/, "");
	const other = dms.get(room.roomId);
	return other.name ?? other.userId;
}

let search;
let searchfocus = false;
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

.icon, .roomicon {
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
  transition: width .2s;
  width: 180px;
}

.roomsearch.focus {
  width: 260px;
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

.roomsearch .title {
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
    {#if dms.has(room.roomId)}
    <span class="roomicon" style="font-family: var(--font-display)">@</span>
    {:else}
    <span class="roomicon icon">tag</span>
    {/if}
  {/if}
  <span class="name">{room ? getName(room) : "Home"}</span>
  {#if room?.topic}
  <div class="spacer"></div>
  <div class="topic" on:click={() => state.popup.set({ id: "info", head: room.name, body: parseHtml(room.topic, { linkify: true }), html: true })}>
    {@html parseHtml(room.topic, { linkify: true })}
  </div>
  {:else}
  <div style:flex={1}></div>
  {/if}
  <!--
  {#if room}
  {#if dms.has(room.id)}
  <div class="icon" on:click={todo}>videocam</div>
  <div class="icon" on:click={todo}>call</div>
  <div class="icon" on:click={todo}>push_pin</div>
  {:else}
  <div class="icon" on:click={todo}>forum</div>
  <div class="icon" on:click={todo}>push_pin</div>
  {/if}
  -->
  <div
    class="icon"
    style:color={$settings.get("showmemberlist") ? "var(--fg-notice)" : null}
    on:click={() => $settings.put("showmemberlist", !$settings.get("showmemberlist")) }
  >
    people
  </div>
  <!--
  <div class="roomsearch" class:focus={searchfocus || !!search}>
    <Search bind:focus={searchfocus} bind:value={search} />
    {#if searchfocus}
    <div class="recent">
      <div class="title">History</div>
      <div class="option" on:click={() => search = "Option 1"}>Option 1</div>
      <div class="option" on:click={() => search = "Option 2"}>Option 2</div>
      <div class="option" on:click={() => search = "Option 3"}>Option 3</div>
    </div>
    {/if}
  </div>
  {:else}
  <div class="icon" on:click={todo}>person_add</div>
  {/if}
  <div class="spacer"></div>
  <div class="icon" on:click={todo}>inbox</div>
  <div class="icon" on:click={todo}>help</div>
  -->
</div>
