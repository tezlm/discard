<script>
import Message from './Message.svelte';
</script>
<style>
.content {
	flex: 1;
	display: flex;
	flex-direction: column;
  padding-bottom: 1em;
}
</style>
<div class="content">
  <Message author="tezlm" timestamp={new Date(2)} content="hello world" avatarurl="https://celery.eu.org/_matrix/media/r0/thumbnail/celery.eu.org/h7g7YzhWoMJXVaOBT0vpOheqaOEQBhxY?width=80&height=80&method=crop" header />
  <Message author="tezlm" timestamp={new Date(2)} content="this is a test" />
  <Message author="tezlm" timestamp={new Date(2)} content="yes hello" />
  <Message author="tezlm" timestamp={new Date()} content="this is very sus" avatarurl="https://celery.eu.org/_matrix/media/r0/thumbnail/celery.eu.org/h7g7YzhWoMJXVaOBT0vpOheqaOEQBhxY?width=80&height=80&method=crop" header />
</div>

