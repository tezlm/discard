<script>
import Unread from './timeline/Unread.svelte';
import Create from './timeline/Create.svelte';
import Message from './message/Message.svelte';
let timeline = state.timeline;
let  scroller, atBottom = true, atTop = false;

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

timeline.subscribe(() => {
	if (scroller && atBottom) {
		queueMicrotask(() => scroller.scrollTo(0, scroller.scrollTopMax));
	}
});

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
