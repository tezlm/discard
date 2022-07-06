const sdk = globalThis.matrixcs;

// TODO: timeline slice

function formatEvent(ev) {
  return {
    sender:  ev.getSender(),
    type:    ev.getType(),
    date:    ev.getDate(),
    sending: ev.isSending(),
    roomId:  ev.getRoomId(),
    eventId: ev.getId(),
    content: { ...ev.getContent() },
  };  
}

// TODO: switch over to custom room type
function formatRoom(room) {
  function getType() {
    if (room.getMyMembership() === "invite") return "invite";
    if (room.isSpaceRoom()) return "space";
    // TODO: dm room
    return "room";    
  }
  
  return {
    name:       room.name,
    topic:      room?.currentState.getStateEvents("m.room.topic")[0]?.getContent().topic ?? null,
    avatar:     room.getAvatarUrl(state.client.baseUrl),
    type:       getType(),
    roomId:     room.roomId,
    
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
      });
      client.startClient();
      state.client = client;
      state.scene.set("loading");
      actions.client.listen(client);
    },
    // login to the homeserver and create a new client
    async login({ localpart, homeserver, password }) {
      const userId = `@${localpart}:${homeserver}`;
      const client = sdk.createClient({ baseUrl: "https://" + homeserver, store: await actions.client.getStore() });
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
    listen(client) {
      function updateAll() {
        actions.rooms.update();
        actions.spaces.update();
      }
      
      function shouldHandle(event) {
        return state.focusedRoomId && (event.getRoomId() === state.focusedRoomId);
      }
              
      client.once("sync", () => state.scene.set("chat"));
      client.once("sync", updateAll);
      client.on("Room.myMembership", updateAll);
      client.on("Room.name", updateAll);
      client.on("Room.timeline", (event, _, toBeginning) => {
        if (!toBeginning) actions.rooms.update();
        if (!shouldHandle(event)) return;
        const atEnd = actions.slice.isAtEnd();
        actions.timeline.add(event, toBeginning);
        if (atEnd) {
          const lastEvent = state.timeline[state.timeline.length - 1];
          state.sliceEnd = lastEvent.eventId;
          state.sliceRef.push(lastEvent);
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
        const atEnd = actions.slice.isAtEnd();
        actions.timeline.update(id, event);
        if (atEnd) state.sliceEnd = state.timeline[state.timeline.length - 1].eventId;
        state.slice.set(state.sliceRef);
      });
      client.on("Room.receipt", (event) => {
        const users = Object.values(event.getContent()).map(i => Object.keys(i["m.read"])).flat(); // readable and maintainable code
        if (!users.includes(state.client.getUserId())) return;
        actions.rooms.update();
        state.slice.set(state.sliceRef);
      });
    },
  },
  rooms: {
    focus(room) {
    	state.focusedRoomId = room?.roomId ?? null;
    	state.focusedRoom.set(room);
    	if (room) actions.timeline.set(room);
    },
    update() {
      const client = state.client;
      const rooms = client.getRooms().filter(i => ["join", "invite"].includes(i.getMyMembership())).map(formatRoom);
      const dms = [];
      const dmData = state.client.getAccountData("m.direct").getContent();

      for (let userId in dmData) {
        for (let roomId in dmData[userId]) {
          dms.push({ userId, roomId });
        }
      }

      state.dms.set(dms);
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

      const newStart = Math.max(state.timeline.length - 51, 0);
      const newEnd = state.timeline.length - 1;
      
      // FIXME: if timeline is [], state.timeline[...] will be undefined

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
        const original = actions.timeline.get(id);
        if (!original) return;
        Object.assign(original, {
          ...formatEvent(event),
          content: { ...event.getContent()["m.new_content"] } ?? {},
          original,
        });
      } else {
        timeline[toBeginning ? "unshift" : "push"](formatEvent(event));      
      }
    },
    update(id, event) {
      const original = actions.timeline.get(id);
      Object.assign(original, formatEvent(event));
    },
    remove(event) {
      const original = actions.timeline.get(event.event.redacts);
      original.redacted = true;
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
    async backwards(limit = 50) {
      const oldStartIndex = state.timeline.findIndex(i => i.eventId === state.sliceStart);
      if (oldStartIndex - limit < 0 && state.timeline[0]?.type !== "m.room.create") {
        console.log("fetching messages");
      	const liveTimeline = state.client.getRoom(state.focusedRoomId).getLiveTimeline();
      	await state.client.paginateEventTimeline(liveTimeline, { backwards: true, limit: 200 });
      }

      const startIndex = state.timeline.findIndex(i => i.eventId === state.sliceStart);
      const endIndex = state.timeline.findIndex(i => i.eventId === state.sliceEnd);
      if (startIndex < 0) throw "this shouldn't happen";
      if (endIndex < 0) throw "this shouldn't happen";
      
      const eventCount = 100;
      const newStart = Math.max(startIndex - limit, 0);
      const newEnd = Math.min(newStart + eventCount, state.timeline.length - 1);
       
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
      const newStart = Math.max(startIndex + limit, 0);
      const newEnd = Math.min(newStart + eventCount, state.timeline.length - 1);
       
      state.sliceStart = state.timeline[newStart].eventId;
      state.sliceEnd = state.timeline[newEnd].eventId;
      state.sliceRef = state.timeline.slice(newStart, newEnd + 1);
      state.slice.set(state.sliceRef);
    },
    async jump(eventId) {
      // todo!
    },
  },
};
