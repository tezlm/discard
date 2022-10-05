<script>
import Toolbar from "../../atoms/Toolbar.svelte";
import MessageReactions from "../message/MessageReactions.svelte";

import Message from "../message/Message.svelte";
import Create from "../events/Create.svelte";
import NameTopic from "../events/NameTopic.svelte";
import Member from "../events/Member.svelte";
import Pinned from "../events/Pinned.svelte";
import Alias from "../events/Alias.svelte";
import Unknown from "../events/Unknown.svelte";

export let shiftKey;
export let header;
export let room;
export let event;

let toolbarEl;
let showReactionPicker = false;

function getToolbar(event, shiftKey) {
	const toolbar = [];
  const fromMe = event.sender.userId === state.userId;

  if (event.special) {
    if (event.special === "errored") toolbar.push({ name: "Retry", icon: "refresh", clicked: todo });
    toolbar.push({ name: "Cancel", icon: "delete", color: "var(--color-red)", clicked: todo });
  } else if (shiftKey){
		toolbar.push({ name: "Source", icon: "terminal", clicked: () => state.popup.set({ id: "dev-event", event }) });
	} else if (room.power.me >= room.power.getEvent("m.reaction")) {
    toolbar.push({ name: "React", icon: "add_reaction", clicked: () => showReactionPicker = !showReactionPicker });
    toolbar.push({ name: "More", icon: "more_vert", clicked: todo });
  }
	
	return toolbar;
}


$: if (showReactionPicker) {
  queueMicrotask(() => {
    const rect = toolbarEl.getBoundingClientRect();
    state.popout.set({
      id: "emoji",
      animate: "left",
      top: rect.top,
      right: window.innerWidth - rect.left + 8,
      selected(emoji, keepOpen) {
        if (emoji && !event.reactions?.get(emoji)?.find(i => i.sender.id === state.userId)) {
          const reaction = {
            "m.relates_to": {
              key: emoji,
              rel_type: "m.annotation",
              event_id: event.eventId,
            },
          };
          state.api.sendEvent(event.room.id, "m.reaction", reaction, Math.random());  
        }
        if (!keepOpen) showReactionPicker = false;
      },
    });
  });
} else {
  state.popout.set({});
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

.reactions {
	margin-left: 72px;
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
	{:else}
		<Unknown {room} {event} />
	{/if}
	{#if !["m.room.create", "m.room.message", "m.sticker"].includes(event.type)}
  <div class="toolbar" bind:this={toolbarEl}>
	  <Toolbar items={getToolbar(event, shiftKey)} />
	</div>
	{/if}
  {#if event.reactions && event.type !== "m.room.message"}
	<div class="reactions">
		<MessageReactions {event} />
	</div>
	{/if}
</div>
<svelte:window on:click={() => { showReactionPicker = false }} />
