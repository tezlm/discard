<script>
import Message from './Message.svelte';
let timeline = state.timeline;

const defaultAvatar = "mxc://celery.eu.org/Wm9T9Nnch8IUQsVaJAInkaoVsgCJlmGx";

const getUser = (event) => state.client.getUser(event.getSender());
const getDisplayName = (event) => getUser(event).displayName;
const getAvatar = (event) => state.client.mxcUrlToHttp(getUser(event).avatarUrl ?? defaultAvatar, 40, 40);
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
	{#each $timeline as event}
		{#if event.getType() === "m.room.message"}
		  <Message
				author={getUser(event).displayName}
				timestamp={event.getDate()}
				content={event.getContent().body}
				avatarurl={getAvatar(event)}
				header
			/>
		{/if}
	{/each}
</div>
