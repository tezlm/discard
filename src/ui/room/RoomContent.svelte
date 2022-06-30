<script>
import Message from './Message.svelte';
let timeline = state.timeline;
let container, scroller, atBottom = true;

const defaultAvatar = "mxc://celery.eu.org/Wm9T9Nnch8IUQsVaJAInkaoVsgCJlmGx";

const getUser = (event) => state.client.getUser(event.getSender());
const getDisplayName = (event) => getUser(event).displayName;
const getAvatar = (event) => state.client.mxcUrlToHttp(getUser(event).avatarUrl ?? defaultAvatar, 40, 40);

function shouldSplit(ev, prev) {
	if (!prev) return true;
	if (prev.getType() !== "m.room.message") return true;
	if (prev.getSender() !== ev.getSender()) return true;
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
console.log(scroller.scrollHeight, lastScrollHeight, scrollDiff)
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
	height: 1em;
}
</style>
<div class="content" bind:this={container}>
	<div class="scroller" on:scroll={handleScroll} bind:this={scroller}>
		{#each $timeline as event, i}
			{#if event.getType() === "m.room.message"}
			  <Message
					author={getUser(event).displayName}
					timestamp={event.getDate()}
					content={event.getContent()}
					avatarurl={getAvatar(event)}
					header={shouldSplit(event, $timeline[i - 1]) ? true : null}
				/>
			{/if}
		{/each}
		<div class="spacer"></div>
	</div>
</div>
