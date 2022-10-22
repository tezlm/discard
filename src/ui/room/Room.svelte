<script>
import RoomFooter from './RoomFooter.svelte';
import RoomHeader from './RoomHeader.svelte';
import RoomMembers from './RoomMembers.svelte';

import BasicRoom from './rooms/Basic.svelte';
import SpaceRoom from './rooms/Space.svelte';
import HomeRoom from './rooms/Home.svelte';
import Unverified from "./rooms/Unverified.svelte";
import UnknownRoom from './rooms/Unknown.svelte';

// hmmm...
import MediaRoom from './rooms/Media.svelte';
import ForumRoom from './rooms/Forum.svelte';

let room = state.focusedRoom;
let space = state.focusedSpace;
let slice = state.slice;
let settings = state.settings;
let selectedTab;
$: type = $room?.getState("m.room.create")?.content.type;

let navRooms = state.navRooms;
$: if($navRooms) room = state.focusedRoom;
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
<!-- TODO: currently shows a flash when switching between room types, either hide it or show loading -->
<div class="room">
  <RoomHeader room={$room} bind:selectedTab />
  {#if $room && $slice}
		<div class="content" style:flex-direction="row">
			{#if $room.getState("m.room.encryption") && false}
				<Unverified room={$room} />
			{:else if !type}
				<div class="content">
				  <BasicRoom room={$room} slice={$slice} />
				  <RoomFooter />
				</div>
			{:else if type === "m.space"}
			  <SpaceRoom room={$space} />
			<!-- {:else if type === "m.policy"} -->
			{:else if type === "org.eu.celery.room.media"}
				<MediaRoom room={$room} slice={$slice} />
			{:else if type === "org.eu.celery.room.forum"}
				<ForumRoom room={$room} />
			{:else}
				<UnknownRoom room={$room} />
			{/if}
			{#if $settings.get("showmemberlist")}
			<RoomMembers room={$room} />
			{/if}
		</div>
  {:else if $space}
	  <SpaceRoom room={$space} />
  {:else}
	  <HomeRoom {selectedTab} />
  {/if}
</div>
