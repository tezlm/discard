<script>
import Search from "../atoms/Search.svelte";
import { parseHtml } from "../../util/html.js";
export let room;
let space = state.focusedSpace;
let settings = state.settings;
$: dark = $space && !room;

let { popout, invites, dms } = state;

function getName(room) {
	if (!dms.has(room.id)) return room.name;
	const other = dms.get(room.id);
	return other.name ?? other.id;
}

export let selectedTab = "home";

let search;
let searchfocus = false;

let showPins = false;
let pinButtonEl;

$: if (showPins) {
  queueMicrotask(() => {
    const rect = pinButtonEl.getBoundingClientRect();
    state.popout.set({
      id: "pinned",
      animate: "bottom",
      top: rect.top + rect.height + 16,
      right: window.innerWidth - rect.right,
      room
    });
  });
} else {
  state.popout.set({});
}
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
  flex: 1;
  padding: 16px 0;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.icon.active {
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

.tab {
  display: flex;
  align-items: center;
  border-radius: 3px;
  padding: 2px 8px;
  margin-right: 4px;
  cursor: pointer;
  font-weight: 500;
}

.tab:hover {
  background: var(--mod-lighten);
}

.tab.selected {
  background: var(--mod-lightener);
  color: var(--fg-notice);
}

.ping {
	display: inline-block;
	height: 16px;
	min-width: 16px;
  margin-left: 4px;
  text-align: center;

	background: var(--color-red);
	color: var(--fg-notice);
	font-size: 12px;
	font-weight: 700;
	border-radius: 50%;
}
</style>
<div class="header" class:dark={dark}>
  {#if room}
    {#if dms.has(room.id)}
    <span class="roomicon" style="font-family: var(--font-display)">@</span>
    {:else}
    <span class="roomicon icon">tag</span>
    {/if}
  {:else}
    <span class="roomicon icon">home</span>
  {/if}
  <span class="name">
  {#if room}{@html parseHtml(getName(room) ?? "null", { twemojify: true })}{:else}Home{/if}
  </span>
  {#if room?.topic}
  <div class="spacer"></div>
  <div class="topic" on:click={() => state.popup.set({ id: "info", head: room.name, body: parseHtml(room.topic, { linkify: true, twemojify: true }), html: true })}>
    {@html parseHtml(room.topic, { linkify: true, twemojify: true })}
  </div>
  {:else if !room && !$space}
  <div class="spacer"></div>
  <div style="flex:1;display:flex">
    <div class="tab" class:selected={selectedTab === "home"}    on:click={() => selectedTab = "home"}>Dashboard</div>
    <div class="tab" class:selected={selectedTab === "invites"} on:click={() => selectedTab = "invites"}>Invites {#if $invites.size}<span class="ping">{$invites.size}</span>{/if}</div>
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
  {#if room}
  <!--
  <div class="icon" class:active={showPins} bind:this={pinButtonEl} on:click|stopPropagation={() => showPins = !showPins}>push_pin</div>
  -->
  <div
    class="icon"
    style:color={$settings.get("showmemberlist") ? "var(--fg-notice)" : null}
    on:click={() => $settings.put("showmemberlist", !$settings.get("showmemberlist")) }
  >
    people
  </div>
  {/if}
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
<svelte:window on:click={() => { showPins = false }} />
