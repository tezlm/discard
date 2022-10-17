<script>
import { onDestroy } from "svelte";
import Scroller from '../../molecules/Scroller.svelte';
import Divider from '../timeline/Divider.svelte';
import Upload from '../timeline/Upload.svelte';
import Placeholder from '../timeline/Placeholder.svelte';
import Event from "../timeline/Event.svelte";
import { getLastMessage } from "../../../util/timeline";
export let room;
export let slice;
let { focused, reply, edit, upload } = state.roomState;
let settings = state.settings;
let shiftKey = false;
let scrollTop, scrollMax, scrollTo, reset;
let pushRules = state.pushRules;

$: if (slice) refocus();

function shouldSplit(prev, ev) {
	if (!prev) return true;
	if (ev.type !== "m.room.message" && prev.type !== "m.room.message") return false;
	if (ev.type !== "m.room.message" && prev.type === "m.room.message") return true;
	if (ev.type === "m.room.message" && prev.type !== "m.room.message") return true;
	if (prev.sender.id !== ev.sender.id) return true;
	if (ev.content["m.relates_to"]?.["m.in_reply_to"]) return true;
	if (ev.date - prev.date > 1000 * 60 * 10) return true;
	if (ev.date.getDay() !== prev.date.getDay()) return true;
	return false;
}

function dividerProps(prev, ev) {
	const room = state.rooms.get(ev.room.id);
	return {
		unpad: shouldSplit(prev, ev),
		unread: room.readEvent === prev.id,
		newdate: prev.date.getDay() !== ev.date.getDay() ? ev.date
			: prev.type === "m.room.create" ? ev.date
			: null,
	};
}

async function fetchBackwards() {
	const success = await actions.slice.backwards();
	return [!success || slice.events[0]?.type === "m.room.create", slice.atEnd()];
}

async function fetchForwards() {
	const success = await actions.slice.forwards();
	return [!success || slice.events[0]?.type === "m.room.create", slice.atEnd()];
}

function refocus() {
	if (scrollTo && scrollTop === scrollMax) {
		queueMicrotask(() => scrollTo(-1));
	}
}

let resizeTimeout;
function handleResize() {
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(refocus, 50);
}

function handleKeyDown(e) {
	if (e.type === "keydown") return shiftKey = e.key === "Shift";
	if (e.type === "keyup") return shiftKey = false;
}

function checkShift(e) {
  shiftKey = e.shiftKey;
}

function getHighlight(event, reply) {
	if (reply?.eventId === event.id) return "var(--color-blue)";
}

function shouldRender(_type, _settings) {
	// TODO:
	// joinleave, nickavatar
	// if (["m.room.name", "m.room.topic"].includes(type) && !settings.get("shownametopic")) return false;
	return true;
}

function shouldPing(event) {
	const parsed = $pushRules.parse(event);
	if (!parsed) return false;
	const highlight = parsed.actions.find(i => i.set_tweak === "highlight");
	if (!highlight) return false;
	return highlight.value !== false;
}

onDestroy(state.focusedRoom.subscribe(() => {
	console.time("focus room")
	queueMicrotask(() => console.timeEnd("focus room"));
}));

onDestroy(state.focusedRoom.subscribe(() => queueMicrotask(() => reset && reset())));
onDestroy(upload.subscribe(refocus));
onDestroy(reply.subscribe(refocus));
onDestroy(edit.subscribe(refocus));
$: if($focused) {
	const id = $focused;
	const element = document.querySelector(`[data-event-id="${id}"]`);
	if (element) {
		queueMicrotask(() => element.scrollIntoView({ behavior: "smooth", block: "center" }));
		setTimeout(() => id === $focused && focused.set(null), 2000);
	}
}

$: if($edit) {
	const element = document.querySelector(`[data-event-id="${$edit}"]`);
	if (element) {
		setTimeout(() => element.scrollIntoView({ behavior: "smooth", block: "center" }));
	}
}


function isRead(room) {
	const tl = room.events.live;
	return getLastMessage(tl, room.readEvent)	=== getLastMessage(tl);
}
</script>
<style>
.content {
	flex: 1;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: end;
	overflow: hidden;
}

.spacer {
	margin: 10px 0;
}

.tall {
	display: flex;
	min-height: 1200px;
	overflow: hidden;
}

.header {
	margin-top: 14px;
}

.highlight {
	position: relative;
}

.highlight::before, .highlight::after {
	content: "";
	position: absolute;
	top: 0;
	height: 100%;
	background: var(--color);
}

.highlight::after {
	width: 2px;
}

.highlight::before {
	width: 100%;
	opacity: .2;
}

.ping {
	position: relative;
	background: var(--event-ping-bg);
}

.editing {
	position: relative;
  background: rgba(4,4,5,0.07);
}

.focused {
	position: relative;
}

.ping::after {
	content: "";
	position: absolute;
	top: 0;
	height: 100%;
	width: 2px;
	background: var(--event-ping);
}

.focused {
	background: var(--event-focus-bg);
	animation: unfocus 1s 1s forwards;
}

@keyframes unfocus {
	100% { background: none }
}

.unread {
	display: flex;
	position: absolute;
	left: 16px;
	top: -1px;
	width: calc(100% - 32px);
	padding: 4px 12px;
	border-radius: 0 0 8px 8px;
	background: var(--color-accent);
	font-size: 14px;
	font-weight: 500;
	box-shadow: var(--shadow-high);
	cursor: pointer;
	z-index: 1;
	user-select: none;
}

.unread:active {
	top: 0;
}
</style>
<div class="content" style:display={room ? null : "none"}>
	<!--
	{#if !isRead(room)}
	<div class="unread" on:click={() => actions.slice.jump(room.id, room.readEvent)}>
		<div style="flex: 1;">
		{5} new messages
		</div>
		<div style="display: flex; font-weight: 700">
			Mark As Read <div class="icon" style="margin-left: 4px">mark_chat_read</div>
		</div>
	</div>
	{/if}
	-->
	<Scroller
		items={slice.events}
		itemKey="id"
		direction="up"
		margin={300}
		bind:scrollTop={scrollTop}
		bind:scrollMax={scrollMax}
		bind:scrollTo={scrollTo}
		bind:reset={reset}
		let:data={event}
		let:index={index}
		{fetchBackwards}
		{fetchForwards}
		getDefault={() => [slice.events[0]?.type === "m.room.create", slice.atEnd()]}
	>
		<div slot="top" style="margin-top: auto"></div>
		<div slot="placeholder-start" class="tall" style="align-items: end"><Placeholder /></div>
		<div>
			{#if !event.flags?.has("redacted") && shouldRender(event.type, $settings)}
				<div
					class:header={shouldSplit(slice.events[index - 1], event) ? true : null}
					class:ping={shouldPing(event)}
					class:focused={$focused === event.id}
					class:editing={$edit === event.id}
					data-event-id={event.id}
					class:highlight={getHighlight(event, $reply)}
					style:--color={getHighlight(event, $reply)}
				>
				  <Event
						{shiftKey} {room} {event}
						header={shouldSplit(slice.events[index - 1], event) ? true : null}
					/>
				</div>
			{/if}
			{#if index < slice.events.length - 1}
				<Divider {...dividerProps(event, slice.events[index + 1])} />
			{/if}
		</div>
		<div slot="placeholder-end" class="tall"><Placeholder /></div>
		<div slot="bottom" class="spacer">
		{#if $upload}<Upload upload={$upload} />{/if}
		</div>
	</Scroller>
</div>
<svelte:window on:resize={handleResize} on:keydown={handleKeyDown} on:keyup={handleKeyDown} on:mousemove={checkShift} />
