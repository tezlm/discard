<script>
import Unread from './timeline/Unread.svelte';
import Upload from './timeline/Upload.svelte';
import Create from './timeline/Create.svelte';
import Message from './message/Message.svelte';
import Loading from '../atoms/Loading.svelte';
let slice = state.slice;
let { focusedEvent, replyEvent, editingEvent, fileUpload: upload } = state;
let scroller, paginating = false, atEnd = true, atBottom = true, atTop = false;

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

function handleScroll() {
	atEnd = scroller.scrollTop > scroller.scrollTopMax - 50;
	console.log(paginating);
	if (!paginating) maybePaginate();
}

// FIXME: occasionally, you get sent all the way to the top of the content
// FIXME: forward pagination doesn't work properly
async function maybePaginate() {
	if (!scroller || paginating) return;

	const paginateUp = !atTop && scroller.scrollTop < 800;
	const paginateDown =  !atBottom && scroller.scrollTopMax - scroller.scrollTop < 800;
	if (paginateDown === paginateUp) return; // bootleg xor (both true = entire timeline loaded, both false = dont paginate)
	
	paginating = true;

	if (paginateUp) {
		const oldScroll = scroller.children[1].offsetTop;
		const topEvent = scroller.children[1].dataset.eventId;
		await actions.slice.backwards();
		if ($slice[0]?.type === "m.room.create") atTop = true;
		if (scroller) {
			const recreated = scroller.querySelector(`[data-event-id="${topEvent}"]`);
			if (recreated) scroller.scrollTop += recreated.offsetTop - oldScroll;
		}
	} else if (paginateDown) {
		console.log("yes", atBottom, atEnd, $slice.at(-1))
		const oldScroll = scroller.children[1].offsetTop;
		const bottomEvent = scroller.children[scroller.children.length - 2].dataset.eventId;
		await actions.slice.forwards();
		if (scroller) {
			const recreated = scroller.querySelector(`[data-event-id="${bottomEvent}"]`);
			if (recreated) scroller.scrollTop -= recreated.offsetTop - oldScroll;
		}
	}

	atBottom = $slice.at(-1)?.eventId === state.timeline.at(-1)?.eventId;
	paginating = false;
}

function refocus() {
	if (scroller && atEnd) {
		queueMicrotask(() => scroller.scrollTop = scroller.scrollTopMax);
	}
}

slice.subscribe(refocus);
replyEvent.subscribe(refocus);

state.focusedRoom.subscribe(() => {
	queueMicrotask(() => {
		atEnd = true;
		atBottom = true;
		atTop = false;
		paginating = false;
		if (state.focusedRoomId && scroller) {
			scroller.scrollTop = scroller.scrollTopMax;
			maybePaginate();
		}
	});
});

focusedEvent.subscribe(() => {
	if (!scroller) return;
	const id = $focusedEvent;
	const element = scroller.querySelector(`[data-event-id="${id}"]`);
	if (element) {
		element.scrollIntoView({ behavior: "smooth", block: "center" });
		setTimeout(() => id === $focusedEvent && focusedEvent.set(null), 2000);
	}
});
</script>
<style>
.content {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: end;
	overflow: hidden;
}

.scroller {
	overflow-y: auto;
}

.spacer {
	height: 1.5rem;
}

.loading {
	text-align: center;
}

.tall {
	margin-top: 500px;
}

.ping {
	position: relative;
	background: var(--event-ping-bg);
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
	<div class="scroller" tabindex=-1 on:scroll={handleScroll} bind:this={scroller}>
		{#if !atTop}
		<div class="loading tall"><Loading /></div>
		{/if}
		{#each $slice as event, i}
		<div data-event-id={event.eventId} class:focused={$focusedEvent === event.eventId} class:ping={event.isPing}>
			{#if event.type === "m.room.create"}
				<Create event={event} />
			{:else if event.type === "m.room.message" && !event.redacted}
			  <Message
					event={event}
					header={shouldSplit(event, $slice[i - 1]) ? true : null}
				/>
			{/if}
			</div>
			{#if i < $slice.length - 1 && shouldUnread(event)}
				<Unread unpad={shouldSplit($slice[i + 1], event) ? true : null} />
			{/if}
		{/each}
		{#if $upload}
	  <Upload upload={$upload} />
		{/if}
		<div class="spacer" class:tall={!atBottom} ></div>
	</div>
</div>
<svelte:window on:resize={refocus} />
