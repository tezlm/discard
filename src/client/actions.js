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
        actions.rooms.update();
        if (!shouldHandle(event)) return;
        actions.timeline.add(event, toBeginning);
        state.slice.set(state.timeline);
      });
      client.on("Room.redaction", (event) => {
        actions.rooms.update();
        if (!shouldHandle(event)) return;
        actions.timeline.remove(event);
        state.slice.set(state.timeline);
      });
      client.on("Room.localEchoUpdated", (event, _, id) => {
        if (!shouldHandle(event)) return;
        if (!id) return;
        actions.timeline.update(id, event);
        state.slice.set(state.timeline);
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
      state.slice.set(state.timeline);
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
      const timeline = state.timeline;
      for (let i = timeline.length - 1; i >= 0; i--) {
        if (timeline[i].eventId === id) {
          return timeline[i];
        }
      }
    }
  },
};
