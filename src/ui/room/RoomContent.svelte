<script>
import { onDestroy } from "svelte";
import Scroller from '../molecules/Scroller.svelte';
import Unread from './timeline/Unread.svelte';
import Upload from './timeline/Upload.svelte';
import Create from './timeline/Create.svelte';
import Placeholder from './timeline/Placeholder.svelte';
import Message from './message/Message.svelte';
let slice = state.slice;
let { focused, reply, upload } = state.roomState;
let shiftKey = false;
let scrollTop, scrollMax, scrollTo;

function shouldSplit(ev, prev) {
	if (!prev) return true;
	if (prev.type !== "m.room.message") return true;
	if (prev.sender !== ev.sender) return true;
	if (ev.content["m.relates_to"]?.["m.in_reply_to"]) return true;
	if (ev.date - prev.date > 1000 * 60 * 5) return true;
	return false;
}

function shouldUnread(ev) {
	const room = state.client.getRoom(ev.roomId);
	const user = state.client.getUserId();
	return room.getEventReadUpTo(user) === ev.eventId;
}

const atBottom = () => $slice.at(-1)?.eventId === state.timeline.at(-1)?.eventId;

async function fetchBackwards() {
	// const topChild = scroller.children[1];
	// const topEvent = topChild.dataset.eventId;
	await actions.slice.backwards();
	// if ($slice[0]?.type === "m.room.create" || $slice[0]?.eventId === topEvent) return true;
	return [$slice[0]?.type === "m.room.create", atBottom()];
}

async function fetchForwards() {
	await actions.slice.forwards();
	return [false, atBottom()];
}

function refocus() {
	if (scrollTo && scrollTop === scrollMax) queueMicrotask(() => scrollTo(-1));
}

function handleKeyPress(e) {
  if (e.key === "Shift") shiftKey = e.type === "keydown";
}

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
	margin-top: 20px;
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
		items={$slice}
		indexKey="eventId"
		margin={1200}
		bind:scrollTop={scrollTop}
		bind:scrollMax={scrollMax}
		bind:scrollTo={scrollTo}
		let:data={event}
		let:index={index}
		{fetchBackwards}
		{fetchForwards}
	>
		<div slot="top"></div>
		<div slot="placeholder-start" class="tall" style="align-items: end"><Placeholder /></div>
		<div>
			<div
				class:header={shouldSplit(event, $slice[index - 1])}
				class:ping={event.isPing}
				class:reply={$reply?.eventId === event.eventId}
				class:focused={$focused === event.eventId}
				data-event-id={event.eventId}
			>
				{#if event.type === "m.room.create"}
					<Create event={event} />
				{:else if event.type === "m.room.message" && !event.isRedacted}
				  <Message
						{event}
						{shiftKey}
						header={shouldSplit(event, $slice[index - 1]) ? true : null}
					/>
				{/if}
			</div>
			{#if index < $slice.length - 1 && shouldUnread(event)}
				<Unread unpad={shouldSplit($slice[index + 1], event) ? true : null} />
			{/if}
		</div>
		<div slot="placeholder-end" class="tall"><Placeholder /></div>
		<div slot="bottom" class="spacer">
		{#if $upload}<Upload upload={$upload} />{/if}
		</div>
	</Scroller>
</div>
<svelte:window on:resize={refocus} on:keydown={handleKeyPress} on:keyup={handleKeyPress} />
