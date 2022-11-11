import type { Event, Room, Member } from "discount.ts";
import { getRoomNotifRule, putRoomNotifRule } from "../client/matrix/notifications";
import { get } from "svelte/store";
import * as notif from "../client/matrix/notifications";
globalThis.notif = notif;

declare global {
  const todo: () => {};
  const actions: any;
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
  if (power.me >= power.forState("m.room.pinned_events")) {
    const events = event.room.getState("m.room.pinned_events")?.content.pinned ?? [];
    function pinOrUnpin(e) {
      if (events.includes(event.id)) {
        events.splice(events.indexOf(event.id), 1);
        event.room.sendState("m.room.pinned_events", { pinned: events });
        return;
      }
      if (e.detail.shiftKey) {
        event.room.sendState("m.room.pinned_events", { pinned: [event.id, ...events] });
      } else {
        state.popup.set({ id: "pin", event });
      }
    }
    menu.push({ label: `${events.includes(event.id) ? "Unpin" : "Pin"} Message`, icon: "push_pin", clicked: pinOrUnpin });
  }
  menu.push({ label: "Mark Unread", icon: "mark_chat_unread", clicked: markUnread });
  menu.push({ label: "Copy Link",   icon: "link", clicked: () => navigator.clipboard.writeText(`https://matrix.to/#/${event.room.id}/${event.id}`) });
  if (!event.isState() && ((power.me >= power.forEvent("m.room.redaction") && event.sender.id === state.id) || power.me >= (power.redact ?? 50))) {
    function redact(e) {
      if (e.detail.shiftKey) {
        event.flags.add("redacted");
        event.redact();
      } else {
        state.popup.set({ id: "redact", event });
      }
    }
    menu.push({ label: "Delete Message", icon: "delete", color: "var(--color-red)", clicked: redact });
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
      event.room.sendEvent("m.reaction", reaction);  
    }
  }

  function markUnread() {
    const timeline = event.room.events.live;
    const index = timeline.lastIndexOf(event);
    const lastId = timeline[index - 1]?.id ?? event.id;
    actions.rooms.markRead(event.room, lastId);
  }
}

export function roomContext(room: Room): Array<ContextMenuOption> {
  const notif = getRoomNotifRule(room);
  
  function getNotifItem(label: string, type: "default" | "all" | "mentions" | "muted") {
    if (notif.level === type) {
      return { label, clicked: () => {}, icon: "radio_button_checked", color: "var(--color-accent)" };
    } else {
      return { label, clicked: () => { putRoomNotifRule(room, { ...notif, level: type }) }, icon: "radio_button_unchecked" };
    }
  }
  
  function getSettingsSubmenu() {
    const goto = (type: string) => () => {
  		state.selectedRoom.set(room);
      actions.to(`/${room.type === "m.space" ? "space-settings" : "room-settings"}/${room.id}/${type}`);
    };
    const settings = [
	    { label: "Overview",    icon: "info", clicked: goto("overview") },
	    { label: "Permissions", icon: "flag", clicked: goto("permissions") },
	    { label: "Security",    icon: "security", clicked: goto("security") },
      ...(room.type === "m.space" ? [
        { label: "Rooms",     icon: "tag", clicked: goto("rooms") },
        { label: "Audit Log", icon: "assignment", clicked: goto("audit") },
      ] : [
  	    { label: "Integrations", icon: "link", clicked: goto("integrations") },
      ]),
	    { label: "Emoji and Stickers",   icon: "emoji_emotions", clicked: goto("emoji") },
      null,
	    { label: "Members", icon: "people", clicked: goto("members") },
	    { label: "Bans",    icon: "person_remove", clicked: goto("bans") },
	    { label: "Invites", icon: "person_add_alt_1", clicked: goto("invites") },
    ];
    return settings;
  }
  
  const menu: Array<ContextMenuOption> = [
	  { label: "Mark As Read",  clicked: () => markRead(room), icon: "done" },
    ...(room.type === "m.space" ? [] : [
	  { label: "Notifications", clicked: todo, submenu: [
      getNotifItem("Default", "default"),
      getNotifItem("All Messages", "all"),
      getNotifItem("Only @mentions", "mentions"),
      getNotifItem("Nothing", "muted"),
			null,
	    { label: "Suppress @room", clicked: todo, icon: "check_box_outline_blank" },
	    // { label: "Suppress @room", clicked: todo, icon: "check_box" },
	  ] },
    ]),
	  null,
	  { label: "Settings", clicked: openSettings(room), icon: "settings", submenu: getSettingsSubmenu() },
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
	if (room.power.me >= room.power.invite || room.joinRule === "public") {
    menu.push({ label: "Invite", clicked: () => state.popup.set({ id: "invite", type: "room", room }), icon: "person_add", color: "var(--color-accent)" });
  }
  menu.push(
	  { label: "Copy Link", clicked: copy(`https://matrix.to/#/${encodeURIComponent(room.getState("m.room.canonical_alias")?.content.alias ?? room.id)}`), icon: "link" },
	  null,
	  { label: "Leave", clicked: () => state.popup.set({ id: "leave", type: room.type === "m.space" ? "space" : "room", room }), icon: "logout", color: "var(--color-red)" },
	);
  if (state.settingsRef.get("shadowdev")) {
    menu.push(
  	  null,
  	  { label: "Copy ID", clicked: copy(room.id), icon: "terminal" },
  	  { label: "Dev Tools", clicked: () => state.popup.set({ id: "dev-room", room }) },
  	);
  }
  return menu;  
  
	function markRead(room: Room) {
    actions.rooms.markRead(room);
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
  		actions.to(`/${room.type === "m.space" ? "space" : "room"}-settings/${room.id}`);	
  	};
  }
}

export function memberContext(member: Member): Array<ContextMenuOption> {
  const name = member.name || member.id;
  const { power } = member.room;

  function close() {
    if (state.focusedRoomId) {
  		actions.to(`/room/${state.focusedRoomId}`);
    } else if (get(state.focusedSpace)) {
  		actions.to(`/space/${state.focusedSpaceId}`);
    } else {
      actions.to("/home");
    }
  }

  const menu = [];
  menu.push(
    { label: "Profile", icon: "person",        clicked: () => { state.popout.set({}); state.popup.set({ id: "user", userId: member.id }) } },
    { label: "Mention", icon: "notifications", clicked: () => { const { input } = state.roomState; input.set(get(input) + member.id); close() } },
    { label: "Message", icon: "message",       clicked: todo },
    { label: "Block",   icon: "block",         clicked: todo },
    null,
  );
  
  const moderate = [];
  const membership = member.membership;
  if (state.settingsRef.get("shadowmod") && power.me >= power.redact) {
    moderate.push({ label: "Remove Messages", icon: "delete", color: "var(--color-red)", clicked: () => state.popup.set({ id: "deleterecent", room: member.room, member }) });
    moderate.push({ label: "Remove Name/Avatar", icon: "delete", color: "var(--color-red)", clicked: todo });
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
  
  function getPowerMenu() {
    if (power.me >= power.forState("m.room.power_levels") && (power.me > member.power || member.id === state.userId)) {
      const setPower = (pl: number) => {
        if (pl === power.me) {
          state.popup.set({
            id: "dialog",
            title: "Change power level?",
            html: "You are about to change this member's power level to the same level as yourself! You will <b>not</b> be able to demote them after this change. Are you absolutely sure you want to do this?",
            button: "Promote!",
            danger: true,
            clicked: () => member.setPower(pl),
          });
        } else if (member.id === state.userId) {
          state.popup.set({
            id: "dialog",
            title: "Change power level?",
            html: "You are about to demote yourself! You will <b>not</b> be able to undo this. Are you absolutely sure you want to demote yourself?",
            button: "Demote!",
            danger: true,
            clicked: () => member.setPower(pl),
          });
        } else {
          member.setPower(pl);
        }
      };
      const getItem = (pl: number, name: string): any => {
        if (member.power === pl) {
          return { label: `${name} - ${pl}`, clicked: () => setPower(pl), icon: "check", color: "var(--color-accent)" };
        } else {
          return { label: `${name} - ${pl}`, clicked: () => setPower(pl) };
        }
      };
      const submenu = [{ label: `Power: ${member.power}`, clicked: () => {}, icon: "bolt" }, null];
      if (power.me >= 100) submenu.push(getItem(100, "Admin"));
      if (power.me >= 50) submenu.push(getItem(50, "Moderator"));
      if (power.me >= power.usersDefault) submenu.push(getItem(power.usersDefault, "Member"));
      return { label: "Power", clicked: () => {}, submenu };
    } else {
      return { label: `Power: ${member.power}`, clicked: () => {}, icon: "bolt" };
    }
  }
  
  menu.push(getPowerMenu());
  
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

export function homeContext() {
  const goto = (where: string) => () => actions.to(`/user-settings/${where}`);
	return [
	  { label: "Mark As Read",  clicked: markEverythingRead, icon: "done_all" },
	  { label: "Create Room",  clicked: () => state.popup.set({ id: "create", type: "room" }),  icon: "tag" },
	  { label: "Create Space", clicked: () => state.popup.set({ id: "create", type: "space" }), icon: "folder" },
	  { label: "Join",         clicked: () => state.popup.set({ id: "join" }), icon: "add" },
	  null,
	  { label: "Settings", clicked: () => actions.to("/user-settings"), icon: "settings", submenu: [
      { label: "My Account",           clicked: goto("account"),    icon: "account_circle" },
      { label: "Privacy and Security", clicked: goto("privsec"),    icon: "security" },
      { label: "Homeserver",           clicked: goto("homeserver"), icon: "storage" },
      null,
      { label: "Appearance",       clicked: goto("appearance"),    icon: "palette" },
      { label: "Text and Images",  clicked: goto("text-images"),   icon: "message" },
      { label: "Rooms and Spaces", clicked: goto("rooms-spaces"),  icon: "grid_3x3" },
      { label: "Notifications",    clicked: goto("notifications"), icon: "notifications" },
      // { label: "Keybinds",         clicked: goto("keybinds"),      icon: "keyboard" },
      { label: "Language",         clicked: goto("language"),      icon: "language" },
      null,
      { label: "Changelog", clicked: goto("changelog"), icon: "assignment" },
      { label: "Help",      clicked: goto("help"),      icon: "help" },
      { label: "Credits",   clicked: goto("version"),   icon: "groups" },
	  ] },
	];
  
  function markEverythingRead() {
    state.popup.set({
      id: "dialog",
      title: "a clean slate",
      html: `Heya, this will mark <b>all ${state.rooms.size} rooms</b> you're in as read. Just checking you didn't misclick.`,
      button: "Do it already!",
      clicked() {
        for (let [_, room] of state.rooms) {
          actions.rooms.markRead(room);
        }
      },
    });
  }
}
