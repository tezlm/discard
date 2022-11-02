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
export let noInteract = false;
export let header = true;
export let room;
export let event;

let toolbarEl;
let { context, popout, slice } = state;

// messy/complex if statements, maybe i should clean it up..?
function getToolbar(event, shiftKey) {
	const toolbar = [];
  const fromMe = event.sender.id === state.userId;
	const { power } = room;
	
  function markUnread() {
    const timeline = event.room.events.live;
    const index = timeline.lastIndexOf(event);
    const lastId = timeline[index - 1]?.id ?? event.id;
    state.log.debug(`mark ${lastId} as read`);
    event.room.accountData.set("m.fully_read", { event_id: lastId });
    state.slice.set(state.roomSlices.get(event.room.id));
    state.api.sendReceipt(event.room.id, lastId);
  }

  if (event.flags?.has("errored")) {
		toolbar.push({ name: "Retry", icon: "refresh", clicked: todo });
    toolbar.push({ name: "Cancel", icon: "delete", color: "var(--color-red)", clicked: todo });
  } else if (event.flags?.has("sending")) {
    toolbar.push({ name: "Cancel", icon: "delete", color: "var(--color-red)", clicked: todo });
  } else if (shiftKey) {
    if (event.type === "m.room.message" && power.me >= power.forEvent("m.room.message")) {
      toolbar.push({ name: "Reply", icon: "reply", clicked: () => state.roomState.reply.set(event) });
    }
    if (fromMe) {
      toolbar.push({ name: "Edit", icon: "edit", clicked: () => state.roomState.edit.set(event.id) });
		}
		toolbar.push({ name: "Mark Unread", icon: "mark_chat_unread", clicked: markUnread });
		if (power.me >= power.forEvent("m.room.pinned_events")) {
	    const pins = event.room.getState("m.room.pinned_events")?.content.pinned ?? [];
			toolbar.push({ name: pins.includes(event.id) ? "Unpin" : "Pin", icon: "push_pin", clicked: () => {
	      if (pins.includes(event.id)) {
	        pins.splice(pins.indexOf(event.id), 1);
	        event.room.sendState("m.room.pinned_events", { pinned: pins });
	        return;
	      }
        event.room.sendState("m.room.pinned_events", { pinned: [event.id, ...pins] });
			}});
		}
		toolbar.push({ name: "Copy Link", icon: "link", clicked: () => navigator.clipboard.writeText(`https://matrix.to/#/${event.room.id}/${event.id}`) });
		toolbar.push({ name: "Source", icon: "terminal", clicked: () => state.popup.set({ id: "dev-event", event }) });
    if (!event.isState() && ((fromMe && power.me >= power.forEvent("m.room.redact")) || (power.me >= power.redact))) {
      toolbar.push({ name: "Redact", icon: "delete", color: "var(--color-red)", clicked: () => { event.flags.add("redacted"); event.redact() }});
    }
	} else {
		if (power.me >= power.forEvent("m.reaction")) {
			toolbar.push({ name: "React", icon: "add_reaction", clicked: toggleReactionPicker });
		}
    if (!event.isState() && power.me >= power.forEvent("m.room.message")) {
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
    $context = { items: eventContext(event, { showEmoji: () => showReactionPicker(rect) }), x: rect.left, y: rect.top + 40 };
  }
}

function handleClick(e) {
	if (noInteract) return;
  if (e.altKey) {
    const prev = $slice.events[$slice.events.findIndex(i => i.id === event.id) - 1];
    if (prev) {
      room.accountData.set("m.fully_read", { event_id: prev.id });
      state.slice.set(state.roomSlices.get(event.room.id));
      state.api.sendReceipt(event.room.id, prev.id);
    }
  }
}

function handleContext(e) {
	if (noInteract) return;
	if (["A", "IMG", "VIDEO"].includes(e.target.tagName)) return;
	e.preventDefault();
  const rect = toolbarEl.getBoundingClientRect();
	$context = {
		items: eventContext(event, {
			showEmoji: () => showReactionPicker(rect),
		}),
		x: e.clientX,
		y: e.clientY,
	};
}

function toggleReactionPicker() {
	if ($popout._owner === "event-" + event.id) {
	  $popout = {};
	} else {
		showReactionPicker();
	}
}

function showReactionPicker(overrideRect) {
  const rect = overrideRect ?? toolbarEl.getBoundingClientRect();
  $popout = {
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
            event_id: event.id,
          },
        };
        state.api.sendEvent(event.room.id, "m.reaction", reaction, Math.random());  
      }
      if (!keepOpen) $popout = {}
    },
		_owner: "event-" + event.id,
  };
}
</script>
<style>
.event {
	position: relative;
	user-select: text;
}

.event:not(.create, .noInteract):hover {
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
<div class="event" class:noInteract class:create={event.type === "m.room.create"} on:click={handleClick} on:contextmenu|stopPropagation={handleContext}>
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
	{#if event.type !== "m.room.create" && !noInteract}
  <div class="toolbar" bind:this={toolbarEl} style:display={$popout._owner === "event-" + event.id ? "block" : null}>
	  <Toolbar items={getToolbar(event, shiftKey)} />
	</div>
	{/if}
  {#if event.reactions && !noInteract}
	<div style:margin-left={event.type === "m.room.create" ? "16px" : "72px"}>
		<MessageReactions {event} />
	</div>
	{/if}
</div>
