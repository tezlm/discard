<script>
import Toolbar from "../../atoms/Toolbar.svelte";
import Create from "../events/Create.svelte";
import NameTopic from "../events/NameTopic.svelte";
import Member from "../events/Member.svelte";
import Pinned from "../events/Pinned.svelte";
import Alias from "../events/Alias.svelte";
import Message from "../message/Message.svelte";
export let shiftKey;
export let header;
export let room;
export let event;

function getToolbar(event, shiftKey) {
	const toolbar = [];
  const fromMe = event.sender.userId === state.userId;

  if (event.special) {
    if (event.special === "errored") toolbar.push({ name: "Retry", icon: "refresh", clicked: todo });
    toolbar.push({ name: "Cancel", icon: "delete", color: "var(--color-red)", clicked: todo });
  } else if (shiftKey){
		toolbar.push({ name: "Source", icon: "terminal", clicked: () => state.popup.set({ id: "source", event }) });
	} else if (room.power.me >= room.power.getEvent("m.reaction")) {
    toolbar.push({ name: "React", icon: "add_reaction", clicked: todo });
    toolbar.push({ name: "More", icon: "more_vert", clicked: todo });
  }
	
	return toolbar;
}
</script>
<style>
.event {
	position: relative;
	user-select: text;
}

.event:not(.create):hover {
  background: var(--mod-darken);
}

.toolbar {
  display: none;
  align-items: start;
  position: absolute;
  right: 1rem;
  top: -16px;
  z-index: 1;
}

.event:hover .toolbar {
	display: block;
}
</style>
<div class="event" class:create={event.type === "m.room.create"}>
	{#if event.type === "m.room.create"}
		<Create {room} {event} {shiftKey} />
	{:else if event.type === "m.room.name" || event.type === "m.room.topic"}
		<NameTopic {room} {event} />
	{:else if event.type === "m.room.member"}
		<Member {room} {event} />
	{:else if event.type === "m.room.pinned_events"}
		<Pinned {room} {event} />
	{:else if event.type === "m.room.canonical_alias"}
		<Alias {room} {event} />
	{:else if event.type === "m.room.message" || event.type === "m.sticker"}
	  <Message {room} {event} {header} {shiftKey} />
	<!-- TODO: extensible events.
	{:else if ["m.message", "m.notice", "m.emote", "m.file"].includes(event.type)}
	-->
	{/if}
	{#if !["m.room.create", "m.room.message", "m.sticker"].includes(event.type)}
  <div class="toolbar">
	  <Toolbar items={getToolbar(event, shiftKey)} {event} />
	</div>
	{/if}
</div>
