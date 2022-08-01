<script>
import RoomContent from './RoomContent.svelte';
import RoomFooter from './RoomFooter.svelte';
import RoomHeader from './RoomHeader.svelte';
import RoomHome from './RoomHome.svelte';
import RoomMembers from './RoomMembers.svelte';
let room = state.focusedRoom;
let slice = state.slice;
let settings = state.settings;
</script>
<style>
.room {
	flex: 1;
	display: flex;
	flex-direction: column;
  width: 100%;
  background: var(--bg-content);
	overflow: hidden;
}

.content {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: end;
	overflow: hidden;
}
</style>
<div class="room">
  <RoomHeader room={$room} />
  {#if $room}
		<div class="content" style:flex-direction="row">
			<div class="content">
			  <RoomContent room={$room} slice={$slice} />
			  <RoomFooter />
			</div>
			{#if $settings.get("showmemberlist")}
			<RoomMembers room={$room} />
			{/if}
		</div>
  {:else}
	  <RoomHome />
  {/if}
</div>
