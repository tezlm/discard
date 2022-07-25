<script>
import RoomContent from './RoomContent.svelte';
import RoomFooter from './RoomFooter.svelte';
import RoomHeader from './RoomHeader.svelte';
import RoomHome from './RoomHome.svelte';
let room = state.focusedRoom;
let slice = state.slice;
// FIXME: flash when switching to roomhome?
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
</style>
<div class="room">
  <RoomHeader />
  {#if $room && $slice}
  <RoomContent room={$room} slice={$slice} />
  <RoomFooter />
  {:else}
  <RoomHome />
  {/if}
</div>
