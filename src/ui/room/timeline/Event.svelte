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

import { eventContext } from "../../../util/context";

export let shiftKey = false;
export let header = true;
export let room;
export let event;

let toolbarEl;
let showReactionPicker = false;
let context = state.context;

// messy/complex if statements, maybe i should clean it up..?
function getToolbar(event, shiftKey) {
	const toolbar = [];
  const fromMe = event.sender.id === state.userId;

  if (event.flags?.has("errored")) {
		toolbar.push({ name: "Retry", icon: "refresh", clicked: todo });
    toolbar.push({ name: "Cancel", icon: "delete", color: "var(--color-red)", clicked: todo });
  } else if (event.flags?.has("sending")) {
    toolbar.push({ name: "Cancel", icon: "delete", color: "var(--color-red)", clicked: todo });
  } else if (shiftKey) {
    if (!event.isState() && ((fromMe && room.power.me >= room.power.forEvent("m.room.redact")) || (room.power.me >= room.power.redact))) {
      toolbar.push({ name: "Delete", icon: "delete", color: "var(--color-red)", clicked: () => { event.flags.add("redacted"); state.api.redactEvent(event.room.id, event.id) }});
    }
    if (event.type === "m.room.message" && room.power.me >= room.power.forEvent("m.room.message")) {
      toolbar.push({ name: "Reply", icon: "reply", clicked: () => state.roomState.reply.set(event) });
    }
		toolbar.push({ name: "Source", icon: "terminal", clicked: () => state.popup.set({ id: "dev-event", event }) });
	} else {
		if (room.power.me >= room.power.forEvent("m.reaction")) {
			toolbar.push({ name: "React", icon: "add_reaction", clicked: () => showReactionPicker = !showReactionPicker });
		}
    if (!event.isState() && room.power.me >= room.power.forEvent("m.room.message")) {
      if (fromMe) {
        toolbar.push({ name: "Edit", icon: "edit", clicked: () => state.roomState.edit.set(event.id) });
      } else {
        toolbar.push({ name: "Reply", icon: "reply", clicked: () => state.roomState.reply.set(event) });
      }
    }
    toolbar.push({ name: "More", icon: "more_vert", clicked: showMore });
	}
	
	return toolbar;

  function showMore() {
    const rect = toolbarEl.getBoundingClientRect();
    if ($context.items) return $context = {};
    $context = { items: eventContext(event, { showEmoji: () => showReactionPicker = true }), x: rect.left, y: rect.top + 40 };
    // $context = { items: eventContext(event, { showEmoji: () => showReactionPicker = true }), x: rect.left - 120, y: rect.top };
  }
}

function handleContext(e) {
	if (e.target.tagName === "A") return;
	e.preventDefault();
	$context = {
		items: eventContext(event, {
			showEmoji: () => showReactionPicker = true,
		}),
		x: e.clientX,
		y: e.clientY,
	};
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
</style>
<div class="event" class:create={event.type === "m.room.create"} on:contextmenu|stopPropagation={handleContext}>
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
	  <Message {room} {event} {header} />
	<!-- TODO: extensible events.
	{:else if ["m.message", "m.notice", "m.emote", "m.file"].includes(event.type)}
	-->
	{:else}
		<Unknown {room} {event} />
	{/if}
	{#if event.type !== "m.room.create"}
  <div class="toolbar" bind:this={toolbarEl} style:display={showReactionPicker ? "block" : null}>
	  <Toolbar items={getToolbar(event, shiftKey)} />
	</div>
	{/if}
  {#if event.reactions}
	<div style:margin-left={event.type === "m.room.create" ? "16px" : "72px"}>
		<MessageReactions {event} />
	</div>
	{/if}
</div>
<svelte:window on:click={() => { showReactionPicker = false }} />
