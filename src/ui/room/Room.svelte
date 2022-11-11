<script>
import RoomFooter from './RoomFooter.svelte';
import RoomHeader from './RoomHeader.svelte';
import RoomMembers from './RoomMembers.svelte';
import RoomSearch from './RoomSearch.svelte';

import BasicRoom from './rooms/Basic.svelte';
import SpaceRoom from './rooms/Space.svelte';
import HomeRoom from './rooms/Home.svelte';
import Unverified from "./rooms/Unverified.svelte";
import UnknownRoom from './rooms/Unknown.svelte';

// hmmm...
import MediaRoom from './rooms/Media.svelte';
import ForumRoom from './rooms/Forum.svelte';
// import LongformRoom from './rooms/Longform.svelte';

export let room;

let { focusedSpace: space, navRooms, roomState, slice, settings } = state;
let { search } = roomState;

let selectedTab;
$: type = room?.getState("m.room.create")?.content.type;
</script>
<style>
.room {
	flex: 1;
	display: flex;
	flex-direction: column;
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
  <RoomHeader {room} bind:selectedTab />
  {#if room}
		<div class="content" style:flex-direction="row">
			{#if room.getState("m.room.encryption") && false}
				<Unverified {room} />
			{:else if !type}
				<div class="content">
				  <BasicRoom {room} />
				  <RoomFooter />
				</div>
			{:else if type === "m.space"}
			  <SpaceRoom room={$space} />
			<!-- {:else if type === "m.policy"} -->
			{:else if type === "org.eu.celery.room.media"}
				<MediaRoom {room} />
			{:else if type === "org.eu.celery.room.forum"}
				<ForumRoom {room} />
			<!--
			{:else if type === "org.eu.celery.room.longform"}
				<LongformRoom {room} />
			-->
			{:else}
				<UnknownRoom {room} />
			{/if}
			{#if $search}
			<RoomSearch {room} search={$search} />
			{:else if $settings.get("showmemberlist")}
			<RoomMembers {room} />
			{/if}
		</div>
  {:else if $space}
	  <SpaceRoom room={$space} />
  {:else}
	  <HomeRoom {selectedTab} />
  {/if}
</div>
