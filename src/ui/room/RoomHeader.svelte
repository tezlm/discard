<script lang="ts">
import { onDestroy } from "svelte";
import Tooltip from "../atoms/Tooltip.svelte";
import Search from "../atoms/Search.svelte";
import { parseHtml } from "../../util/html";
import { roomContext } from "../../util/context";
import { fastclick } from "../../util/use";
import type { Room } from "discount.ts";
export let room: Room;
let { focusedSpace: space, settings, scene, events } = state;
let copyCount = 0;
$: dark = $space && !room;

let { popout, invites, dms } = state;

function sanitize(str: string): string {
  return str
    ?.replace(/&amp;/g, "&")
    .replace(/>/g, "&gt;")
    .replace(/</g, "&lt;");
}

function getName(room: Room): string {
	if (!dms.has(room.id)) return room.name;
	const other = dms.get(room.id);
	return other.name ?? other.id;
}

function getCopyText(count) {
	switch(count) {
		case 0: return "Click to copy user id";
		case 1: return "Copied!";
		case 2: return "Double Copy!";
		case 3: return "Triple Copy!";
		case 4: return "Dominating!!";
		case 5: return "Rampage!!";
		case 6: return "Mega Copy!!";
		case 7: return "Unstoppable!!";
		case 8: return "Wicked Sick!!";
		case 9: return "Monster Copy!!!";
//		case 10: return "GODLIKE!!!";
//		default: return "BEYOND GODLIKE!!!";
		default: return "good jbo you copied it";
	}
}

function copy(text: string) {
  copyCount++;
  navigator.clipboard.writeText(text);
}

export let selectedTab = "home";
$: if ($scene === "home") {
  selectedTab = "home";
} else if ($scene === "invites") {
  selectedTab = "invites";
}

let search;
let searchfocus = false;

let pinsShown = false;
let pinButtonEl;

function showHeader() {
  const content = room.getState("m.room.topic")?.content ?? {};
  const html = (content["org.matrix.msc3765.topic"] ?? content["m.topic"])?.find(i => i.mimetype === "text/html")?.body;
  state.popup.set({
    id: "info",
    head: room.name,
    body: html
      ? parseHtml(html, { sanitize: true, linkify: true, twemojify: true })
      : parseHtml(sanitize(room.topic), { linkify: true, twemojify: true }),
    html: true,
  });
}

function togglePins() {
  pinsShown = !pinsShown;
  if (pinsShown) {
    const rect = pinButtonEl.getBoundingClientRect();
    $popout = {
      id: "pinned",
      animate: "bottom",
      top: rect.top + rect.height + 16,
      right: window.innerWidth - rect.right,
      room
    };
  } else {
    $popout = {};
  }
}

events.on("ui.header.pins.toggle", togglePins);
onDestroy(() => events.off("ui.header.pins.toggle", togglePins));
</script>
<style>
.header {
  display: flex;
  align-items: center;
  padding: 0 8px;
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
  background: var(--color-gray-light);
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

.icon:active {
  transform: translateY(1px);
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

.tab-wrap {
  padding: 16px 2px;
  cursor: pointer;
}

.tab-wrap:focus {
  outline: none;
}

.tab {
  display: flex;
  align-items: center;
  border-radius: 3px;
  padding: 2px 8px;
  font-weight: 500;
}

.tab-wrap:hover .tab,
.tab-wrap:focus .tab {
  background: var(--mod-lighten);
}

.tab-wrap:focus .tab {
  outline: solid var(--color-accent) 3px;
}

.tab-wrap.selected .tab {
  background: var(--mod-lightener);
  color: var(--fg-notice);
}

.ping {
	display: inline-block;
	height: 16px;
	min-width: 16px;
	padding: 0 4px;
  margin-left: 4px;
  text-align: center;

	background: var(--color-red);
	color: var(--fg-notice);
	font-size: 12px;
	font-weight: 700;
	border-radius: 11px;
}
</style>
<div class="header" class:dark={dark} on:contextmenu|preventDefault|stopPropagation={(e) => room && state.context.set({ items: roomContext(room), x: e.clientX, y: e.clientY })}>
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
  {#if room}
    {#if dms.has(room?.id)}
    {@const member = dms.get(room.id)}
    <Tooltip position="down" color={copyCount === 0 ? null : "var(--color-green)"}>
      <span slot="tip" style="font-family: var(--font-primary); color: var(--fg-light); font-size: .9rem;">
        {copyCount === 0 ? member.id : getCopyText(copyCount)}
      </span>
      <span style="cursor: pointer" use:fastclick on:fastclick={() => copy(member.id)} on:mouseleave={() => setTimeout(() => copyCount = 0, 50)}>
        {@html parseHtml(sanitize(getName(room) ?? "null"), { twemojify: true })}
      </span>
    </Tooltip>
    {:else}
    {@html parseHtml(sanitize(getName(room) ?? "null"), { twemojify: true })}
    {/if}
  {:else}
    Home
  {/if}
  </span>
  {#if room?.topic}
  <div class="spacer"></div>
  <div class="topic" on:click={showHeader}>
    {@html parseHtml(sanitize(room.topic), { linkify: true, twemojify: true })}
  </div>
  {:else if !room && !$space}
  <div class="spacer"></div>
  <div style="flex:1;display:flex">
    <div tabindex="0" class="tab-wrap" class:selected={selectedTab === "home"}     use:fastclick on:fastclick={() => actions.to("/home")}><div class="tab">Dashboard</div></div>
    <div tabindex="0" class="tab-wrap" class:selected={selectedTab === "invites"}  use:fastclick on:fastclick={() => actions.to("/invites")}><div class="tab">Invites {#if $invites.size}<span class="ping">{$invites.size}</span>{/if}</div></div>
    <!-- <div class="tab-wrap" class:selected={selectedTab === "knocking"} on:click={() => actions.to("/knocking")}><div class="tab">Knocking</div></div> -->
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
  <div class="icon" class:active={pinsShown} bind:this={pinButtonEl} on:click|stopPropagation={() => state.events.emit("ui.header.pins.toggle")}>push_pin</div>
  <div
    class="icon"
    style:color={$settings.get("showmemberlist") ? "var(--fg-notice)" : null}
    on:click={() => $settings.put("showmemberlist", !$settings.get("showmemberlist")) }
  >
    people
  </div>
  <div class="spacer"></div>
  {/if}
  <!-- TODO: inbox to show notifications -->
  <!-- TODO: search messages -->
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
  -->
  <!-- TODO: if i have time, i should write in-app help -->
  <div class="icon" on:click={() => actions.to("/user-settings/help")}>help</div>
</div>
<svelte:window on:click={() => { pinsShown = false }} />
