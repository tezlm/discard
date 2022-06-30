<script>
import Message from './Message.svelte';
let timeline = state.timeline;

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
</script>
<style>
.content {
	flex: 1;
	display: flex;
	flex-direction: column;
  padding-bottom: 1em;
	overflow: auto;
}
</style>
<div class="content">
	{#each $timeline as event, i}
		{#if event.getType() === "m.room.message"}
		  <Message
				author={getUser(event).displayName}
				timestamp={event.getDate()}
				content={event.getContent().body}
				avatarurl={getAvatar(event)}
				header={shouldSplit(event, $timeline[i - 1]) ? true : null}
			/>
		{/if}
	{/each}
</div>
