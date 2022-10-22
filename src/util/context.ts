import type { Event, Room, Member } from "discount";

declare global {
  const state: any;
  const todo: () => {};
}

interface ContextMenuOption {
  label: string,
  clicked: Function,
  icon?: string,
  color?: string,
  submenu?: Array<ContextMenuOption>
}

export function eventContext(event: Event, config: { showEmoji: () => {} }): Array<ContextMenuOption> {
  const menu = [];
  const power = event.room.power;
  if (power.me >= power.forEvent("m.room.reaction")) {
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
  if (power.me >= power.forEvent("m.room.message")) {
    if (event.sender.id === state.userId && event.type === "m.room.message") menu.push({ label: "Edit Message", icon: "edit", clicked: () => state.roomState.edit.set(event.id) });
    menu.push({ label: "Reply", icon: "reply", clicked: () => state.roomState.reply.set(event) });
  }
  menu.push({ label: "Mark Unread", icon: "mark_chat_unread", clicked: markUnread });
  menu.push({ label: "Copy Link",   icon: "link", clicked: () => navigator.clipboard.writeText(`https://matrix.to/#/${event.room.id}/${event.id}`) });
  if (!event.isState() && ((power.me >= power.forEvent("m.room.redaction") && event.sender.id === state.id) || power.me >= (power.redact ?? 50))) {
    menu.push({ label: "Delete Message", icon: "delete", color: "var(--color-red)", clicked: () => { event.flags.add("redacted"); state.api.redactEvent(event.room.id, event.id) } });
  }
  if (state.settingsRef.get("shadowdev")) {
    menu.push(null);
    menu.push({ label: "View Source", icon: "terminal", clicked: () => state.popup.set({ id: "dev-event", event }) });
  }
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
    const timeline = event.room.events.live;
    const index = timeline.lastIndexOf(event);
    const lastId = timeline[index - 1]?.id ?? event.id;
    state.log.debug(`mark ${lastId} as read`);
    event.room.accountData.set("m.fully_read", { event_id: lastId });
    state.slice.set(state.roomSlices.get(event.room.id));
    state.api.sendReceipt(event.room.id, lastId);
  }
}

export function roomContext(room: Room): Array<ContextMenuOption> {
  const menu: Array<ContextMenuOption> = [
	  { label: "Mark As Read",  clicked: () => markRead(room), icon: "done" },
	  { label: "Notifications", clicked: todo, submenu: [
	    { label: "Default",      clicked: todo, icon: "radio_button_checked", color: "var(--color-accent)" },
	    { label: "All Messages", clicked: todo, icon: "radio_button_unchecked" },
	    { label: "Mentions",     clicked: todo, icon: "radio_button_unchecked" },
	    { label: "Nothing",      clicked: mute, icon: "radio_button_unchecked" },
			null,
	    { label: "Suppress @room", clicked: todo, icon: "check_box_outline_blank" },
	    // { label: "Suppress @room", clicked: todo, icon: "check_box" },
	  ] },
	  null,
	  { label: "Settings", clicked: openSettings(room), icon: "settings", /* submenu: [
	    { label: "Overview",     icon: "info", clicked: todo },
	    { label: "Permissions",  icon: "flag", clicked: todo },
	    { label: "Security",     icon: "security", clicked: todo },
	    { label: "Integrations", icon: "link", clicked: todo },
	    { label: "Emoji",        icon: "emoji_emotions", clicked: todo },
      null,
	    { label: "Members",      icon: "people", clicked: todo },
	    { label: "Bans",         icon: "person_remove", clicked: todo },
	    { label: "Invites",      icon: "person_add_alt_1", clicked: todo },
	  ] */ },
	  null,
  ];
  if (room.type === "m.space" && room.power.me >= room.power.forState("m.space.child")) {
    menu.push(
      { label: "Create Room",  icon: "tag",    clicked: () => state.popup.set({ id: "create", type: "room", parent: room }) },
      { label: "Create Space", icon: "folder", clicked: () => state.popup.set({ id: "create", type: "space", parent: room }) },
      { label: "Add Existing", icon: "add",    clicked: () => state.popup.set({ id: "addexisting", parent: room }) },
      null,
    );
  }
	if (room.power.me >= room.power.invite) menu.push({ label: "Invite", clicked: () => state.popup.set({ id: "invite", type: "room", room }), icon: "person_add", color: "var(--color-accent)" });
  menu.push(
	  { label: "Copy Link", clicked: copy(`https://matrix.to/#/${encodeURIComponent(room.getState("m.room.canonical_alias")?.content.alias ?? room.id)}`), icon: "link" },
	  null,
	  { label: "Leave", clicked: () => state.popup.set({ id: "leave", type: "room", room }), icon: "logout", color: "var(--color-red)" },
	);
  if (state.settingsRef.get("shadowdev")) {
    menu.push(
  	  null,
  	  { label: "Copy ID", clicked: copy(room.id), icon: "terminal" },
  	  { label: "Dev Tools", clicked: () => state.popup.set({ id: "dev-room", room }) },
  	);
  }
  return menu;
  
  function mute() {
    // state.accountDataRef.get("m.push_rules").global.room.find(i => i.rule_id === room.id);
    
    // state.api.putRule('override', room.id, {
    //   conditions: [
    //     {
    //       kind: 'event_match',
    //       key: 'room_id',
    //       pattern: room.id,
    //     },
    //   ],
    //   actions: [
    //     'dont_notify',
    //   ],
    // });
    
    todo();
  }
  
	function markRead(room: Room) {
	  const lastId = room.events.live.at(-1)?.id;
    if (!lastId) return;
	  state.log.debug(`mark ${lastId} as read`);
	  room.accountData.set("m.fully_read", { event_id: lastId });
	  if (state.focusedRoomId === room.id) state.slice.set(state.roomSlices.get(room.id));
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
export function memberContext(member: Member): Array<ContextMenuOption> {
  const name = member.name || member.id;
  const { power } = member.room;
  
  const menu = [];
  menu.push(
    { label: "Profile", icon: "person",        clicked: () => state.popup.set({ id: "user", userId: member.id }) },
    { label: "Mention", icon: "notifications", clicked: () => { const { input } = state.roomState; input.set(get(input) + member.id); state.scene.set("chat") } },
    { label: "Message", icon: "message",       clicked: todo },
    { label: "Block",   icon: "block",         clicked: todo },
    null,
  );
  
  const moderate = [];
  const membership = member.membership;
  if (state.settingsRef.get("shadowmod") && power.me >= power.redact) {
    moderate.push({ label: "Remove Messages", icon: "delete", color: "var(--color-red)", clicked: () => state.popup.set({ id: "deleterecent", room: member.room, member }) });
    // redact state event?
    // moderate.push({ label: "Remove Name/Avatar", icon: "delete", color: "var(--color-red)", clicked: () => state.popup.set({ id: "deleterecent", room: member.room, member }) });
  }
  if (power.me >= power.kick && power.me > member.power) {
    if (membership !== "ban" && membership !== "leave") {
      moderate.push({ label: `Kick ${name}`, icon: "person_remove", color: "var(--color-red)", clicked: () => state.popup.set({ id: "kick", room: member.room, member }) });
    }
  }
  if (power.me >= power.ban && power.me > member.power) {
    if (membership === "ban") {
      moderate.push({ label: `Unban ${name}`, icon: "person_remove", color: "var(--color-red)", clicked: () => state.popup.set({ id: "unban", room: member.room, member }) });
    } else {
      moderate.push({ label: `Ban ${name}`,   icon: "person_remove", color: "var(--color-red)", clicked: () => state.popup.set({ id: "ban",   room: member.room, member }) });
    }
  }
  if (moderate.length > 0) moderate.push(null);
  menu.push(...moderate);
  
  menu.push(
    { label: "Power", clicked: () => {}, submenu: [
      { label: member.power.toString(), clicked: () => {}, icon: "bolt" },
      null,
      { label: "Admin - 100", clicked: todo },
      { label: "Moderator - 50", clicked: todo },
      { label: "Member - 0", clicked: todo },
      { label: "Suspicious Impostor", clicked: todo, icon: "check", color: "var(--color-accent)" },
    ] },
  );
  
  if (state.settingsRef.get("shadowdev")) {
    menu.push(
      null,
      { label: "Copy ID", clicked: copy(member.id), icon: "terminal" },
    );
  }
  
  return menu;
      
	function copy(text: string) {
		return () => navigator.clipboard.writeText(text);
	}
}