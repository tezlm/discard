<script>
import Unread from './timeline/Unread.svelte';
import Upload from './timeline/Upload.svelte';
import Create from './timeline/Create.svelte';
import Placeholder from './timeline/Placeholder.svelte';
import Message from './message/Message.svelte';
let slice = state.slice;
let { focusedEvent, replyEvent, editingEvent, fileUpload: upload } = state;
let scroller, paginateTimeout = null, atEnd = true, atBottom = true, atTop = false;

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
	atEnd = scroller.scrollTop > scroller.scrollTopMax - 300;
	clearTimeout(paginateTimeout);
	paginateTimeout = setTimeout(maybePaginate, 100);
}

// FIXME: forward pagination doesn't work properly
async function maybePaginate() {
	if (!scroller) return;

	const paginateUp = !atTop && scroller.scrollTop < 1200;
	const paginateDown =  !atBottom && scroller.scrollTopMax - scroller.scrollTop < 1200;
	if (paginateDown === paginateUp) return; // bootleg xor (both true = entire timeline loaded, both false = dont paginate)
	
	if (paginateUp) {
		const topChild = scroller.children[1];
		const topEvent = topChild.dataset.eventId;
		const oldScroll = topChild.offsetTop;
		await actions.slice.backwards();
		if ($slice[0]?.type === "m.room.create" || $slice[0]?.eventId === topEvent) atTop = true;
		if (scroller) {
			const recreated = scroller.querySelector(`[data-event-id="${topEvent}"]`);
			if (recreated) scroller.scrollTop += recreated.offsetTop - oldScroll;
		}
	} else if (paginateDown) {
		const bottomChild = scroller.children[scroller.children.length - 2];
		const bottomEvent = bottomChild.dataset.eventId;
		const oldScroll = bottomChild.offsetTop;
		await actions.slice.forwards();
		if (scroller) {
			const recreated = scroller.querySelector(`[data-event-id="${bottomEvent}"]`);
			if (recreated) scroller.scrollTop -= oldScroll - recreated.offsetTop;
		}
	}

	atBottom = $slice.at(-1)?.eventId === state.timeline.at(-1)?.eventId;
}

function refocus() {
	if (scroller && atEnd) {
		queueMicrotask(() => scroller.scrollTop = scroller.scrollTopMax);
	}
}

slice.subscribe(refocus);
replyEvent.subscribe(refocus);

state.focusedRoom.subscribe(() => {
	clearTimeout(paginateTimeout);
	queueMicrotask(() => {
		atEnd = true;
		atBottom = true;
		atTop = false;
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

.tall {
	display: flex;
	align-content: end;
	max-height: 800px;
	overflow: hidden;
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
		<div class="loading tall"><Placeholder /></div>
		{/if}
		{#each $slice as event, i}
		<div data-event-id={event.eventId} class:focused={$focusedEvent === event.eventId} class:ping={event.isPing}>
			{#if event.type === "m.room.create"}
				<Create event={event} />
			{:else if event.type === "m.room.message" && !event.isRedacted}
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
		{#if atBottom}
		<div class="spacer" ></div>
		{:else}
		<div class="tall"><Placeholder /></div>
		{/if}
	</div>
</div>
<svelte:window on:resize={refocus} />
