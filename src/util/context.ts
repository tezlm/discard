import type { Event, Room, Member } from "discount";

declare global {
  const state: any;
  const todo: () => {};
}

export function eventContext(event: Event, config: { showEmoji: () => {} }) {
  const menu = [];
  const power = event.room.power;
  if (power.me >= power.getEvent("m.room.reaction")) {
    menu.push({ label: "Add Reaction", clicked: config.showEmoji, submenu: [
      { label: "thumbsup",   clicked: () => addReaction("👍️"), icon: "👍️" },
      { label: "thumbsdown", clicked: () => addReaction("👎️"), icon: "👎️" },
      { label: "eyes",       clicked: () => addReaction("👀"), icon: "👀" },
      { label: "sparkles",   clicked: () => addReaction("✨"), icon: "✨" },
      { label: "Other Reactions", icon: "add_reaction", clicked: config.showEmoji },
    ] });
  }
  if (event.reactions?.size) {
    menu.push({ label: "Reactions", icon: "emoji_emotions", clicked: () => state.popup.set({ id: "reactions", event }) });
  }
  if (power.me >= power.getEvent("m.room.message")) {
    if (event.sender.id === state.userId && event.type === "m.room.message") menu.push({ label: "Edit Message", icon: "edit", clicked: () => state.roomState.edit.set(event.id) });
    menu.push({ label: "Reply", icon: "reply", clicked: () => state.roomState.reply.set(event) });
  }
  menu.push({ label: "Mark Unread", icon: "mark_chat_unread", clicked: markUnread });
  menu.push({ label: "Copy Link",   icon: "link", clicked: () => navigator.clipboard.writeText(`https://matrix.to/#/${event.room.id}/${event.id}`) });
  if ((power.me >= power.getEvent("m.room.redaction") && event.sender.id === state.id) || power.me >= (power.redact ?? 50)) {
    menu.push({ label: "Delete Message", icon: "delete", color: "var(--color-red)", clicked: () => { event.flags.add("redacted"); state.api.redactEvent(event.room.id, event.id) } });
  }
  menu.push(null);
  menu.push({ label: "View Source", icon: "terminal", clicked: () => state.popup.set({ id: "dev-event", event }) });
  return menu;

  function addReaction(emoji: string) {
    if (!event.reactions?.get(emoji)?.find((i: Event) => i.sender.id === state.userId)) {
      const reaction = {
        "m.relates_to": {
          key: emoji,
          rel_type: "m.annotation",
          event_id: event.id,
        },
      };
      state.api.sendEvent(event.room.id, "m.reaction", reaction, Math.random());  
    }
  }

  function markUnread() {
    const roomId = event.room.id;
    const timeline = state.roomTimelines.get(roomId).current;
    const index = timeline.lastIndexOf(event.id);
    const lastId = timeline[index - 1] ?? event.id;
    state.log.debug(`mark ${lastId} as read`);
    state.rooms.get(event.room.id).accountData.set("m.fully_read", { event_id: lastId });
    state.slice.set(state.roomSlices.get(roomId));
    state.api.sendReceipt(roomId, lastId);
  }
}

export function roomContext(room: Room) {
	return [
	  { label: "Mark As Read",  clicked: () => markRead(room), icon: "done" },
	  { label: "Notifications", clicked: todo, submenu: [
	    { label: "Default",      clicked: todo, icon: "radio_button_checked" },
	    { label: "All Messages", clicked: todo, icon: "radio_button_unchecked" },
	    { label: "Mentions",     clicked: todo, icon: "radio_button_unchecked" },
	    { label: "Nothing",      clicked: todo, icon: "radio_button_unchecked" },
			null,
	    { label: "Suppress @room", clicked: todo },
	  ] },
	  null,
	  { label: "Settings", clicked: openSettings(room), icon: "settings" /* submenu: [
	    { label: "Foo", clicked: todo },
	    { label: "Bar", clicked: todo },
	    { label: "Baz", clicked: todo },
	  ]*/ },
	  null,
	  { label: "Invite",    clicked: () => state.popup.set({ id: "invite", type: "room", room }), icon: "person_add", color: "var(--color-accent)" },
	  { label: "Copy Link", clicked: copy(`https://matrix.to/#/${encodeURIComponent(room.getState("m.room.canonical_alias")?.content.alias ?? room.id)}`), icon: "link" },
	  null,
	  { label: "Leave",   clicked: () => state.popup.set({ id: "leave", type: "room", room }), icon: "logout", color: "var(--color-red)" },
	  null,
	  { label: "Copy ID", clicked: copy(room.id), icon: "terminal" },
	  { label: "Dev Tools", clicked: () => state.popup.set({ id: "dev-room", room }) },
	];

	function markRead(room: Room) {
	  const lastId = state.roomTimelines.get(room.roomId).live.at(-1);
	  state.log.debug(`mark ${lastId} as read`);
	  state.rooms.get(room.id).accountData.set("m.fully_read", { event_id: lastId });
	  if (state.focusedRoomId === room.roomId) state.slice.set(state.roomSlices.get(room.id));
	  state.api.sendReceipt(room.id, lastId);
    state.api.fetch("POST", `/rooms/${encodeURIComponent(room.id)}/receipt/m.read.private/${encodeURIComponent(lastId)}`, { thread_id: "main" });
    
    if (room.type === "m.space") {
      for (let child of state.spaces.get(room.id)) markRead(child);
    }
	}

	function copy(text: string) {
		return () => navigator.clipboard.writeText(text);
	}
  
  function openSettings(room: Room) {
  	return () => {
  		state.selectedRoom.set(room);
  		state.scene.set(`${room.type === "m.space" ? "space" : "room"}-settings`);	
  	};
  }
}

import { get } from "svelte/store";
export function memberContext(member: Member) {
  const name = member.name || member.id;
  const { power } = member.room;
  
  const menu = [];
  menu.push(
    { label: "Profile", icon: "person",        clicked: () => state.popup.set({ id: "user", userId: member.id }) },
    // { label: "Mention", icon: "notifications", clicked: () => $input += event.sender.userId },
    { label: "Mention", icon: "notifications", clicked: () => { const { input } = state.roomState; input.set(get(input) + member.id); state.scene.set("chat") } },
    { label: "Message", icon: "message",       clicked: todo },
    { label: "Block",   icon: "block",         clicked: todo },
    null,
  );
  
  const moderate = [];
  const membership = member.membership;
  if (power.me >= (power.redact ?? 50)) moderate.push({ label: "Remove Messages", icon: "delete", color: "var(--color-red)", clicked: () => state.popup.set({ id: "deleterecent", room: member.room, member }) });
  if (power.me >= (power.kick ?? 50) && power.me > member.power) {
    if (membership !== "ban" && membership !== "leave") {
      moderate.push({ label: `Kick ${name}`, icon: "person_remove", color: "var(--color-red)", clicked: () => state.popup.set({ id: "kick", room: member.room, member }) });
    }
  }
  if (power.me >= (power.ban ?? 50) && power.me > member.power) {
    if (membership === "ban") {
      moderate.push({ label: `Unban ${name}`,  icon: "person_remove", color: "var(--color-red)", clicked: () => state.popup.set({ id: "unban", room: member.room, member }) });
    } else {
      moderate.push({ label: `Ban ${name}`,    icon: "person_remove", color: "var(--color-red)", clicked: () => state.popup.set({ id: "ban",   room: member.room, member }) });
    }
  }
  if (moderate.length > 0) moderate.push(null);
  menu.push(...moderate);
  
  menu.push(
    // { label: "Power",   clicked: todo, submenu: [] },
    { label: "Power",   clicked: todo, submenu: [{ label: member.power.toString(), clicked: () => {}, icon: "bolt" }] },
    null,
    { label: "Copy ID", clicked: copy(member.id), icon: "terminal" },
  );
  
  return menu;
      
	function copy(text: string) {
		return () => navigator.clipboard.writeText(text);
	}
}