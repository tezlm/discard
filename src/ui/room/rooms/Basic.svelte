<script>
import { tick, onDestroy } from "svelte";
import Scroller from "../../molecules/Scroller.svelte"
import Divider from '../timeline/Divider.svelte';
import Upload from '../timeline/Upload.svelte';
import Placeholder from '../timeline/Placeholder.svelte';
import Event from "../timeline/Event.svelte";
import Loading from "../../atoms/Loading.svelte";
import { getLastMessage } from "../../../util/timeline";
export let room;
let { focused, navRooms, reply, edit, upload } = state.roomState;
let { slice, settings, pushRules } = state;
let shiftKey = false;
let scroller, scrollTop, scrollMax, scrollTo, reset;

let refresh;
let list;

$: if ($slice || $navRooms) {
	refresh?.();
	/*
	timeline = room.events.live?.filter((ev) => {
		// todo
		if (ev.content["m.new_content"]) return false;
		if (ev.type === "m.room.message") return true;
		// if (ev.type === "m.room.member") {
		// };
		
		if ($settings.get("showmisc") && ["m.room.name", "m.room.avatar", "m.room.topic", "m.room.pinned_messages"].includes(ev.type)) return true;
		if ($settings.get("showmoderation") && ["m.room.power_levels", "m.room.acl", "m.room.history_visibility"].includes(ev.type)) return true;
		return $settings.get("showunknown") !== "never";
		// if ($settings.get("showunknown") && !ev.isState()) return false;

// function shouldRender(_type, _settings) {
	// TODO: render wanted events
	// TODO: should i move "what type of membership event is this" into a helper function?
	/*
	"showjoinleave" ["m.room.membership"]
	"shownickavatar" ["m.room.membership"]
	"showunknown" not ["m.room.messages"]
	// return true;
// }
	}) ?? []
	tick().then(() => refocus?.());
	*/
	refocus?.();
}

queueMicrotask(() => refocus?.());

function shouldSplit(prev, ev) {
	if (!prev) return true;
	if (ev.type !== "m.room.message" && prev.type !== "m.room.message") return false;
	if (ev.type !== "m.room.message" || prev.type !== "m.room.message") return true;
	if (prev.sender.id !== ev.sender.id) return true;
	if (ev.content["m.relates_to"]?.["m.in_reply_to"]) return true;
	if (ev.date - prev.date > 1000 * 60 * 10) return true;
	if (ev.date.getDay() !== prev.date.getDay()) return true;
	return false;
}

function dividerProps(prev, ev) {
	const room = ev.room;
	return {
		unpad: shouldSplit(prev, ev),
		unread: room.readEvent === prev.id,
		newdate: prev.date.getDay() !== ev.date.getDay() ? ev.date
			: prev.type === "m.room.create" ? ev.date
			: null,
	};
}

function refocus() {
	if (scrollTop > scrollMax - 16) {
		queueMicrotask(() => scrollTo?.(-1));
	}

	// if (!scroller) return;
 //  if (scroller.scrollHeight - scroller.offsetHeight < scroller.scrollTop + 50) {
	// 	scroller.scrollTo(-1);
	// }
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
	if (reply?.id === event.id) return "var(--color-blue)";
	if (shouldPing(event)) return "var(--event-ping)";
}

function shouldPing(event) {
	const parsed = $pushRules.parse(event);
	let highlight = false;
	parsed.reverse();
	for (let { actions } of parsed) {
		const hl = actions.find(a => a.set_tweak === "highlight");
		if (!hl) continue;
		if (hl.value === false) {
			highlight = false;
		} else {
			highlight = true;
		}
	}
	return highlight;
}

onDestroy(state.focusedRoom.subscribe(() => {
	console.time("focus room")
	queueMicrotask(() => console.timeEnd("focus room"));
}));

// onDestroy(state.focusedRoom.subscribe(() => queueMicrotask(() => refresh?.())));
onDestroy(upload.subscribe(refocus));
onDestroy(reply.subscribe(refocus));
onDestroy(edit.subscribe(refocus));
$: if ($focused) {
	const id = $focused;
	const element = document.querySelector(`[data-event-id="${id}"]`);
	if (!element) list?.scrollToIndex(room.events.live.findIndex(i => i.id === id));
	tick().then(() => {
		const element = document.querySelector(`[data-event-id="${id}"]`);
		if (element) {
			queueMicrotask(() => element.scrollIntoView({ behavior: "smooth", block: "center" }));
		}
		setTimeout(() => id === $focused && focused.set(null), 2000);
	});
}

$: if($edit) {
	const element = document.querySelector(`[data-event-id="${$edit}"]`);
	if (element) {
		setTimeout(() => element.scrollIntoView({ behavior: "smooth", block: "center" }));
	}
}

function isRead(room) {
	const tl = room.events.live;
	if (!tl) return room.notifications.unread === 0;
	return getLastMessage(tl, room.readEvent) === getLastMessage(tl);
}

function getPrev(event) {
	const timeline = room.events.live;
	const index = timeline.lastIndexOf(event);
	return timeline[index - 1];
}

async function fetchBackwards() {
	const success = await actions.slice.backwards();
	return [!success || $slice.events[0]?.type === "m.room.create", $slice.atEnd()];
}

async function fetchForwards() {
	const success = await actions.slice.forwards();
	return [!success || $slice.events[0]?.type === "m.room.create", $slice.atEnd()];
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
	margin: 12px 0;
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
	opacity: .1;
}

.editing {
	position: relative;
	background: rgba(4,4,5,0.07);
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
	z-index: 2;
	user-select: none;
}

.unread:active {
	top: 0;
}
</style>
<div class="content">
	{#if room.events.live}
		{#if false && !isRead(room)}
		<div class="unread" on:click={() => actions.slice.jump(room.id, room.readEvent)}>
			<div style="flex: 1;">
			{room.notifications.unread} new messages
			</div>
			<div style="display: flex; font-weight: 700" on:click|stopPropagation={() => actions.rooms.markRead(room)}>
				Mark As Read <div class="icon" style="margin-left: 4px">mark_chat_read</div>
			</div>
		</div>
		{/if}
		<Scroller
			items={$slice.events}
			direction="up"
			bind:scrollTop={scrollTop}
			bind:scrollMax={scrollMax}
			bind:scrollTo={scrollTo}
			bind:reset={reset}
			let:data={event}
			let:index={index}
			{fetchBackwards}
			{fetchForwards}
			getDefault={() => [$slice.events[0]?.type === "m.room.create", $slice.atEnd()]}
		>
			{@const prev = getPrev(event)}
			{@const highlight = getHighlight(event, $reply)}
			{@const header = shouldSplit(prev, event)}
			<div slot="top" style="flex: 1"></div>
			<div slot="placeholder-start" class="tall" style="align-items: end"><Placeholder /></div>
			<div>
				{#if prev}
				<Divider {...dividerProps(prev, event)} />
				{/if}
				<div
					class:header
					class:highlight={!!highlight}
					class:focused={$focused === event.id}
					class:editing={$edit === event.id}
					data-event-id={event.id}
					style:--color={highlight}
				>
				  <Event {shiftKey} {event} {header} />
				</div>
			</div>
			<div slot="placeholder-end" class="placeholder-bottom">
				<Placeholder />
			</div>
			<div slot="bottom" class="spacer">
				{#if $upload}<Upload upload={$upload} />{/if}
			</div>
		</Scroller>
	{:else}
		<div style="padding: 16px">
			<Loading color="var(--fg-content)" />
		</div>
	{/if}
</div>
<svelte:window on:resize={handleResize} on:keydown={handleKeyDown} on:keyup={handleKeyDown} on:mousemove={checkShift} />
