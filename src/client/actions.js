import { writable, get } from "svelte/store";

const sdk = globalThis.matrixcs;

// TODO: timeline slice

function getDefaultRoomState() {
  return {
    input: "",
    rows: 1,
    reply: null,
    edit: null,
    focused: null,
    upload: null,
    typing: new Set(),
  };
}

function formatEvent(ev) {
  return {
    sender:     ev.getSender(),
    type:       ev.getType(),
    roomId:     ev.getRoomId(),
    eventId:    ev.getId(),
    date:       ev.getDate(),
    isSending:  ev.isSending(),
    isPing:     state.client.getPushActionsForEvent(ev).tweaks?.highlight || false,
    isRedacted: ev.isRedacted(),
    content:    { ...ev.getContent() },
  };  
}

// TODO: switch over to custom room type
function formatRoom(room) {
  const getState = (event) => room?.currentState.getStateEvents(event)?.[0]?.getContent();
  
  function getType() {
    if (room.getMyMembership() === "invite") return "invite";
    if (room.isSpaceRoom()) return "space";
    // TODO: dm room
    return "room";
  }
  
  function getPower() {
    const power = getState("m.room.power_levels") ?? { state_default: 0 };
    power.me = power.users?.[state.client.getUserId()] ?? power.users_default ?? 0;
    return {
      ...power,
      me: power.users?.[state.client.getUserId()] ?? power.users_default ?? 0,
      getEvent: (name) => power.events?.[name] ?? power.events_default ?? 0,
      getState: (name) => power.state?.[name] ?? power.state_default ?? 50,
    }
  }
    
  return {
    name:       room.name,
    topic:      getState("m.room.topic")?.topic ?? null,
    avatar:     room.getAvatarUrl(state.client.baseUrl),
    type:       getType(),
    roomId:     room.roomId,
    power:      getPower(),
    tombstone:  getState("m.room.tombstone") ?? null,

    getMembers(membership) {
      return room[membership ? "getMembersWithMembership" : "getMembers"](membership)
        .sort((a, b) => a.displayName > b.displayName ? -1 : 1)
        .sort((a, b) => a.powerLevel > b.powerLevel ? -1 : 1);
    },
    
    // compat for now
    hasUserReadEvent: (user, ev) => room.hasUserReadEvent(user, ev),
    timeline: room.timeline,
  }
}

export default {
  client: {
    async getStore() {
      const idbStore = new sdk.IndexedDBStore({
        indexedDB: indexedDB,
        localStorage: localStorage,
        dbName: "web-sync-store",
      });
      await idbStore.startup();
      return idbStore;
    },
    // try to fetch the current client
    async fetch() {
      const homeserver = localStorage.getItem("homeserver");
      const userId = localStorage.getItem("userid");
      const token = localStorage.getItem("token");
      if (!homeserver || !userId || !token) {
        state.scene.set("auth");
        return null;
      }
      
      const client = sdk.createClient({
        baseUrl: "https://" + homeserver,
        accessToken: token,
        userId: userId,
        store: await actions.client.getStore(),
        useAuthorizationHeader: true,
      });
      client.startClient();
      state.client = client;
      state.scene.set("loading");
      actions.client.listen(client);
    },
    // login to the homeserver and create a new client
    async login({ localpart, homeserver, password }) {
      const userId = `@${localpart}:${homeserver}`;
      const client = sdk.createClient({
        baseUrl: "https://" + homeserver,
        store: await actions.client.getStore(),
        useAuthorizationHeader: true,
      });
      const data = { identifier: { type: "m.id.user", user: userId }, password };

      try {
        const { access_token: token } = await client.login("m.login.password", data);
        localStorage.setItem("homeserver", homeserver);
        localStorage.setItem("userid", userId);
        localStorage.setItem("token", token);
        client.startClient();
        state.client = client;
        state.scene.set("loading");
        actions.client.listen(client);
      } catch(err) {
        console.error(err);
        switch(err.name) {
          case "M_FORBIDDEN": throw "Incorrect username or password";
          case "M_USER_DEACTIVATED": throw "User was deactivated";
          case "ConnectionError": throw "Invalid homeserver";
          default: throw `Unknown error (${err.name}})`;
        }
      }
    },
    async logout() {
      state.client.stopClient();
      if (state.client.isLoggedIn()) state.client.logout();
      localStorage.removeItem("token");
      await state.client.clearStores();
      state.scene.set("auth");
      state.popup.set({});
      state.client = null;
    },
    listen(client) {
      let synced = false;

      function updateAll() {
        actions.rooms.update();
        actions.spaces.update();
      }
      
      function shouldHandle(event) {
        return state.focusedRoomId && (event.getRoomId() === state.focusedRoomId);
      }
      
      // update rooms
      client.once("sync", (syncState) => {
        if (syncState !== "PREPARED") return;
        synced = true;
        updateAll();
        state.scene.set("chat");
      });
      client.on("Room.name", () => synced && updateAll());
      client.on("Room", () => synced && updateAll());
      client.on("deleteRoom", () => synced && updateAll());
      
      // room timeline
      // TODO: optimize: when first viewing a room, we refresh the slice a bunch of times
      // this is because room events are getting added
      client.on("Room.timeline", (event, _, toBeginning) => {
        if (!toBeginning) actions.rooms.update();
        if (!shouldHandle(event)) return;
        if (event.isState()) state.focusedRoom.set(actions.rooms.get(state.focusedRoomId));
        const atEnd = actions.slice.isAtEnd();
        actions.timeline.add(event, toBeginning);

        if (!["m.room.create", "m.room.message"].includes(event.getType())) return; // TODO: merge allowed events lists together
        if (atEnd && !toBeginning) {
          if (event.isRelation()) {
            state.sliceEnd = state.timeline.at(-1).eventId;
            state.sliceRef[state.sliceRef.length - 1] = state.timeline.at(-1);
          } else {
            state.sliceRef.push(state.timeline.at(-1));
            state.sliceEnd = state.timeline.at(-1).eventId;
          
            const startIndex = state.timeline.findIndex(i => i.eventId === state.sliceStart);
            if (startIndex >= 0) {
              state.sliceStart = state.timeline[startIndex + 1].eventId;
              state.sliceRef.shift();
            }          
          }
          
          state.slice.set(state.sliceRef);
        }
      });
      client.on("Room.redaction", (event) => {
        actions.rooms.update();
        if (!shouldHandle(event)) return;
        actions.timeline.remove(event);
      });
      client.on("Room.localEchoUpdated", (event, _, id) => {
        if (!shouldHandle(event)) return;
        if (!id) return;
        actions.timeline.update(id, event);
        if (state.sliceEnd === id) state.sliceEnd = event.getId();
        state.slice.set(state.sliceRef);
      });
      
      // misc
      client.on("Room.receipt", (event) => {
        const users = Object.values(event.getContent()).map(i => Object.keys(i["m.read"] ?? {})).flat(); // readable and maintainable code
        if (!users.includes(state.client.getUserId())) return;
        actions.rooms.update();
        state.slice.set(state.sliceRef);
      });
      client.on("RoomMember.typing", (_, member) => {
        const typing = state.roomStates.get(member.roomId)?.typing;
        if (!typing) return;
        typing[member.typing ? "add" : "delete"](member.userId);
        
        if (member.roomId === state.focusedRoomId) {
          state.roomState.typing.set(typing);
        }
      });
      client.once("Session.logged_out", () => {
        state.scene.set("auth");
        state.popup.set({});
        state.client = null;
        localStorage.removeItem("token");
      });
    },
  },
  rooms: {
    focus(room) {
      // TODO: clean up this code
      // save room state
      if (!state.roomState) {
        state.roomState = {};
        const defaultState = getDefaultRoomState();
        for (let key in defaultState) {
        	state.roomState[key] = writable(defaultState[key]);
        }
      }
      
      const oldState = state.roomStates.get(state.focusedRoomId);
      if (oldState) {
        for (let key in state.roomState) {
        	oldState[key] = get(state.roomState[key]);
        }
      } 
      
    	state.focusedRoomId = room?.roomId ?? null;
    	state.focusedRoom.set(room);
      
      if (room) {
        // load room state
      	if (!state.roomStates.has(room.roomId)) {
          state.roomStates.set(room.roomId, getDefaultRoomState());
        }
        
        const newState = state.roomStates.get(room.roomId);
        for (let key in newState) {
        	state.roomState[key].set(newState[key]);
        }
        
    	  actions.timeline.set(room);
      }
    },
    update() {
      const client = state.client;
      const rooms = client.getRooms().filter(i => ["join", "invite"].includes(i.getMyMembership())).map(formatRoom);
      const dms = [];
      const dmData = state.client.getAccountData("m.direct")?.getContent();

      if (dmData) {
        for (let userId in dmData) {
          for (let roomId in dmData[userId]) dms.push({ userId, roomId });
        }
        state.dms.set(dms);
      }

      state.rooms.set(rooms);
    },
    get(id) {
      return formatRoom(state.client.getRoom(id));
    },
  },
  spaces: {
    focus(space) {
    	state.focusedSpaceId = space?.roomId ?? null;
    	state.focusedSpace.set(space);
    },
    update() {
      const spaceMap = new Map();
      const inSpaces = [];
      const spaces = state.client.getRooms().filter(i => i.isSpaceRoom());
      for (let space of spaces) {
        const rooms = space.currentState.getStateEvents("m.space.child").map(i => i.getStateKey());
        inSpaces.push(...rooms);
        spaceMap.set(space.roomId, rooms);
      }
      const orphans = state.client.getRooms().filter(i => !inSpaces.includes(i.roomId));
      const pinnedSpaces = state.client.getAccountData("in.cinny.spaces")?.getContent().shortcut;
      spaceMap.set("orphanRooms",  orphans.filter(i => !i.isSpaceRoom()).map(i => i.roomId));
      spaceMap.set("orphanSpaces", pinnedSpaces
        ? pinnedSpaces.filter(i => state.client.getRoom(i)?.getMyMembership() === "join")
        : orphans.filter(i =>  i.isSpaceRoom()).map(i => i.roomId));
      state.spaceMap.set(spaceMap);
    },
  },
  timeline: {
    set(room) {
      state.timeline = [];
      for(let event of room.timeline) actions.timeline.add(event);
      if (state.timeline.length === 0) {
        state.timeline.push({ type: "dummy", eventId: "dummy", roomId: room.roomId });
      }

      const newStart = Math.max(state.timeline.length - 51, 0);
      const newEnd = state.timeline.length - 1;

      state.sliceStart = state.timeline[newStart].eventId;
      state.sliceEnd = state.timeline[newEnd].eventId;
      state.sliceRef = state.timeline.slice(newStart, newEnd + 1);
      state.slice.set(state.sliceRef);
    },
    add(event, toBeginning) {
      if (!["m.room.create", "m.room.message"].includes(event.getType())) return;
      if (event.isRedacted()) return;
      const timeline = state.timeline;
      if (event.getRelation()?.rel_type === "m.replace") {
        const id = event.getRelation()?.event_id;
        const index = state.timeline.findIndex(i => i.eventId === id);
        if (index < 0) return;
        const original = state.timeline[index];
        state.timeline[index] = {
          ...formatEvent(event),
          // eventId: original.eventId,
          content: { ...original.content, ...event.getContent()["m.new_content"] },
          original,
        };
      } else {
        timeline[toBeginning ? "unshift" : "push"](formatEvent(event));      
      }
    },
    update(id, event) {
      const original = actions.timeline.get(id);
      if (!original) return;
      Object.assign(original, formatEvent(event));
    },
    remove(event) {
      const original = actions.timeline.get(event.event.redacts);
      original.isRedacted = true;
    },
    get(id) {
      return state.timeline.find(i => i.eventId === id);
    }
  },
  slice: {
    isAtEnd() {
      const endIndex = state.timeline.findIndex(i => i.eventId === state.sliceEnd);
      return endIndex === state.timeline.length - 1;
    },
    async backwards(limit = 50, lastTop) {
      const oldStartIndex = state.timeline.findIndex(i => i.eventId === state.sliceStart);
      if (oldStartIndex - limit < 0 && state.timeline[0]?.type !== "m.room.create") {
      	const liveTimeline = state.client.getRoom(state.focusedRoomId).getLiveTimeline();
      	await state.client.paginateEventTimeline(liveTimeline, { backwards: true, limit: 200 });
        if (state.timeline.length < limit && state.timeline.at(-1)?.eventId !== lastTop) { // lastTop is a hacky solution for now
          return actions.slice.backwards(limit, state.timeline.at(-1)?.eventId);
        }
      }

      const startIndex = state.timeline.findIndex(i => i.eventId === state.sliceStart);
      const endIndex = state.timeline.findIndex(i => i.eventId === state.sliceEnd);
      if (startIndex < 0) throw "this shouldn't happen";
      if (endIndex < 0) throw "this shouldn't happen";
      
      const eventCount = 100;
      const newStart = Math.max(startIndex - limit, 0);
      const newEnd = Math.min(newStart + eventCount, state.timeline.length - 1);
       
      console.log(`now viewing [${newStart}..${newEnd}] of ${state.timeline.length}`);
      
      state.sliceStart = state.timeline[newStart].eventId;
      state.sliceEnd = state.timeline[newEnd].eventId;
      state.sliceRef = state.timeline.slice(newStart, newEnd + 1);
      state.slice.set(state.sliceRef);
    },
    async forwards(limit = 50) {
      const startIndex = state.timeline.findIndex(i => i.eventId === state.sliceStart);
      const endIndex = state.timeline.findIndex(i => i.eventId === state.sliceEnd);
      if (startIndex < 0) throw "this shouldn't happen";
      if (endIndex < 0) throw "this shouldn't happen";
      
      const eventCount = 100;
      // const newStart = Math.min(Math.max(startIndex + limit, 0), state.timeline.length - 1);
      const newStart = Math.max(startIndex + limit, 0);
      const newEnd = Math.min(newStart + eventCount, state.timeline.length - 1);
      
      console.log(`now viewing [${newStart}..${newEnd}] of ${state.timeline.length}`);
      
      state.sliceStart = state.timeline[newStart].eventId;
      state.sliceEnd = state.timeline[newEnd].eventId;
      state.sliceRef = state.timeline.slice(newStart, newEnd + 1);
      state.slice.set(state.sliceRef);
    },
    async jump(_roomId, eventId) {
      // TODO: add better jumping/context support
      console.log("jump to ", eventId)
      const index = state.timeline.findIndex(i => i.eventId === eventId);
      
      if (!state.sliceRef.find(i => i.eventId === eventId)) {
        if (index === -1) return; // TODO: actually finish this
        
        const context = 50;
        const newStart = Math.max(index - context, 0);
        const newEnd = Math.min(index + context, state.timeline.length - 1);
        
        state.sliceStart = state.timeline[newStart].eventId;
        state.sliceEnd = state.timeline[newEnd].eventId;
        state.sliceRef = state.timeline.slice(newStart, newEnd + 1);
        state.slice.set(state.sliceRef);
        
        // state.sliceStart = eventId;
        // state.sliceEnd = eventId;
        // console.log(await state.client.fetchRoomEvent(roomId, eventId));

        // state.sliceRef = [];
        // state.timeline.slice(newStart, newEnd + 1);
        // state.slice.set(state.sliceRef);
        // state.sliceStart = state.timeline[newStart].eventId;
        // state.sliceEnd = state.timeline[newEnd].eventId;
        // state.sliceRef = state.timeline.slice(newStart, newEnd + 1);
        // state.slice.set(state.sliceRef);
      }
      
      state.roomState.focused.set(eventId);
    },
  },
};
