<script>
import Message from './message/Message.svelte';
import { getDisplayName, getAvatar } from '../../util/events.js';
let timeline = state.timeline;
let container, scroller, atBottom = true;

function shouldSplit(ev, prev) {
	if (!prev) return true;
	if (prev.getType() !== "m.room.message") return true;
	if (prev.getSender() !== ev.getSender()) return true;
	if (ev.getContent()["m.relates_to"]?.["m.in_reply_to"]) return true;
	if (ev.getDate() - prev.getDate() < 1000 * 60 * 3) return false;
	return true;
}

function handleScroll() {
	atBottom = scroller.scrollTop > scroller.scrollTopMax - 20;
	maybePaginate();
}

async function maybePaginate() {
	if (scroller.scrollTop > 200) return;
	const lastScrollHeight = scroller.scrollHeight;
	const liveTimeline = state.client.getRoom(state.focusedRoomId).getLiveTimeline();
	await state.client.paginateEventTimeline(liveTimeline, { backwards: true, limit: 50 });
	const scrollDiff = scroller.scrollHeight - lastScrollHeight;
	scroller.scrollTop += scrollDiff;
}

timeline.subscribe(() => {
	if (scroller && atBottom) {
		queueMicrotask(() => scroller.scrollTo(0, scroller.scrollTopMax));
	}
});

state.focusedRoom.subscribe(() => {
	if (scroller) {
		scroller.scrollTo(0, scroller.scrollTopMax);
		maybePaginate();
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
</style>
<div class="content" bind:this={container}>
	<div class="scroller" on:scroll={handleScroll} bind:this={scroller}>
		{#each $timeline as event, i}
			{#if event.getType() === "m.room.message"}
			  <Message
					event={event}
					timestamp={event.getDate()}
					header={shouldSplit(event, $timeline[i - 1]) ? true : null}
				/>
			{/if}
		{/each}
		<div class="spacer"></div>
	</div>
</div>
