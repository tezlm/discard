<script>
// TODO: optimize! (and/or refactor)
// the entire timeline is rendered, which isnt good for performance
// render just a small "view" of it at a time?

// TODO: fix message scrollback (see MessageContent.svelte)
// the timeline can shift around as images and other message attachments are loaded
// luckily, width and height are sent along with that so it shouldn't be *too* hard to fix?
import Unread from './timeline/Unread.svelte';
import Create from './timeline/Create.svelte';
import Message from './message/Message.svelte';
let timeline = state.timeline;
let reply = state.replyEvent;
let scroller, atBottom = true, atTop = false;

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
	return room.getAccountData("m.fully_read")?.getContent().event_id === ev.eventId;
}

function handleScroll() {
	atBottom = scroller.scrollTop > scroller.scrollTopMax - 50;
	maybePaginate();
}

async function maybePaginate() {
	if (!scroller || scroller.scrollTop > 2000 || atTop) return;
	const oldHeight = scroller.scrollTopMax;
	const oldScroll = scroller.scrollTop;
	const liveTimeline = state.client.getRoom(state.focusedRoomId).getLiveTimeline();
	await state.client.paginateEventTimeline(liveTimeline, { backwards: true, limit: 100 });
	const heightChange = scroller.scrollTopMax - oldHeight;
	scroller.scrollTop = oldScroll + heightChange;
	if ($timeline[0]?.type === "m.room.create") atTop = true;
	maybePaginate();
}

function refocus() {
	if (scroller && atBottom) {
		queueMicrotask(() => scroller.scrollTo(0, scroller.scrollTopMax));
	}
}

timeline.subscribe(refocus);
reply.subscribe(refocus);

state.focusedRoom.subscribe(() => {
	queueMicrotask(() => {
		atTop = false;
		if (state.focusedRoomId && scroller) {
			scroller.scrollTo(0, scroller.scrollTopMax);
			maybePaginate();
		}
	});
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
</style>
<div class="content">
	<div class="scroller" on:scroll={handleScroll} bind:this={scroller}>
		{#each $timeline as event, i}
			{#if shouldUnread(event)}
				<Unread unpad={shouldSplit(event, $timeline[i - 1])} />
			{/if}
			{#if event.type === "m.room.create"}
				<Create event={event} />
			{:else if event.type === "m.room.message" && !event.redacted}
			  <Message
					event={event}
					header={shouldSplit(event, $timeline[i - 1]) ? true : null}
				/>
			{/if}
		{/each}
		<div class="spacer"></div>
	</div>
</div>
