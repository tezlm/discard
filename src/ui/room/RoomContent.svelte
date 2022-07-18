<script>
import { onDestroy } from "svelte";
import Scroller from '../molecules/Scroller.svelte';
import Divider from './timeline/Divider.svelte';
import Upload from './timeline/Upload.svelte';
import Create from './timeline/Create.svelte';
import Placeholder from './timeline/Placeholder.svelte';
import Message from './message/Message.svelte';
let slice = state.slice;
let { focused, reply, edit, upload } = state.roomState;
let shiftKey = false;
let scrollTop, scrollMax, scrollTo, reset;
const get = id => state.events.get(id); // TODO: this is just a shim for now to get things working. find a better way soon?

// TODO: update read marker on esc

function shouldSplit(prev, ev) {
	if (!prev) return true;
	if (prev.type !== "m.room.message") return true;
	if (prev.sender !== ev.sender) return true;
	if (ev.content["m.relates_to"]?.["m.in_reply_to"]) return true;
	if (ev.date - prev.date > 1000 * 60 * 10) return true;
	if (ev.date.getDay() !== prev.date.getDay()) return true;
	return false;
}

function dividerProps(prev, ev) {
	const room = state.rooms.get(ev.roomId);
	return {
		unpad: shouldSplit(prev, ev),
		unread: room.readEvent === prev.eventId, // TODO: fix, only shows unread if its exactly the right event id
		newdate: prev.date.getDay() !== ev.date.getDay() ? ev.date : null,
	};
}

function atBottom() {
	return $slice.events.at(-1).eventId === state.timeline.at(-1);
}

async function fetchBackwards() {
	const success = await actions.slice.backwards();
	return [!success, atBottom()];
}

async function fetchForwards() {
	const success = await actions.slice.forwards();
	return [!success, atBottom()];
}

function refocus() {
	if (scrollTo && scrollTop === scrollMax) queueMicrotask(() => scrollTo(-1));
}

function checkShift(e) {
	if (e.type === "keydown") return shiftKey = e.key === "Shift";
	if (e.type === "keyup") return shiftKey = false;
  shiftKey = e.shiftKey;
}

onDestroy(state.focusedRoom.subscribe(() => reset && reset()));
onDestroy(slice.subscribe(refocus));
onDestroy(reply.subscribe(refocus));
onDestroy(focused.subscribe(() => {
	if (!$focused) return;
	const id = $focused;
	const element = document.querySelector(`[data-event-id="${id}"]`);
	if (element) {
		queueMicrotask(() => element.scrollIntoView({ behavior: "smooth", block: "center" }));
		setTimeout(() => id === $focused && focused.set(null), 2000);
	}
}));
</script>
<style>
.content {
	flex: 1;
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
	min-height: 800px;
	overflow: hidden;
}

.header {
	margin-top: 14px;
}

.ping {
	position: relative;
	background: var(--event-ping-bg);
}

.reply {
	position: relative;
	background: var(--event-focus-bg);
}

/* actually edit *
.edit {
	position: relative;
	background: var(--event-ping-bg);
}
*/

.focused {
	position: relative;
}

.ping::after, .reply::after {
	content: "";
	position: absolute;
	top: 0;
	height: 100%;
	width: 2px;
	background: var(--event-ping);
}

.reply::after {
	background: var(--event-focus);
}

.focused::before {
	content: "";
	position: absolute;
	top: 0;
	height: 100%;
	width: 100%;
	background: var(--event-focus-bg);	
	animation: unfocus 1s 1s forwards;
}

@keyframes unfocus {
	100% { background: none }
}
</style>
<div class="content">
	<Scroller
		items={$slice.events}
		itemKey="eventId"
		margin={300}
		bind:scrollTop={scrollTop}
		bind:scrollMax={scrollMax}
		bind:scrollTo={scrollTo}
		bind:reset={reset}
		let:data={event}
		let:index={index}
		{fetchBackwards}
		{fetchForwards}
	>
		<div slot="top" style="margin-top: auto"></div>
		<div slot="placeholder-start" class="tall" style="align-items: end"><Placeholder /></div>
		<div>
			{#if true} <!-- so i can use const -->
			{#if event.special !== "redacted"}
				<div
					class:header={shouldSplit($slice.events[index - 1], event) ? true : null}
					class:ping={event.isPing}
					class:reply={$reply?.eventId === event.eventId}
					class:focused={$focused === event.eventId}
					data-event-id={event.eventId}
				>
					{#if event.type === "m.room.create"}
						<Create event={event} />
					{:else if event.type === "m.room.message"}
					  <Message
							{shiftKey}
							event={event}
							header={shouldSplit($slice.events[index - 1], event) ? true : null}
						/>
					{/if}
				</div>
				{#if index < $slice.events.length - 1}
					<Divider {...dividerProps(event, $slice.events[index + 1])} />
				{/if}
			{/if}
			{/if}
		</div>
		<div slot="placeholder-end" class="tall"><Placeholder /></div>
		<div slot="bottom" class="spacer">
		{#if $upload}<Upload upload={$upload} />{/if}
		</div>
	</Scroller>
</div>
<svelte:window on:resize={refocus} on:keydown={checkShift} on:keyup={checkShift} on:mousemove={checkShift} />
