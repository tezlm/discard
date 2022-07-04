const sdk = globalThis.matrixcs;

function formatEvent(ev) {
  return {
    sender:  ev.getSender(),
    type:    ev.getType(),
    date:    ev.getDate(),
    roomId:  ev.getRoomId(),
    eventId: ev.getId(),
    content: ev.getContent(),
  };  
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
      function updateRooms() {
        state.rooms.set(client.getRooms().filter(i => i.getMyMembership() === "join"));
        state.invitedRooms.set(client.getRooms().filter(i => i.getMyMembership() === "invite"));
        actions.spaces.recalculate();
      }
  
      client.once("sync", () => state.scene.set("chat"));
      client.once("sync", updateRooms);
      client.on("Room.myMembership", updateRooms);
      client.on("Room.name", updateRooms);
      client.on("Room.timeline", (event, _, toBeginning) => {
        state.rooms.set(client.getRooms().filter(i => i.getMyMembership() === "join")); // to refresh unreads
        if (!state.focusedRoomId) return;
        if (event.getRoomId() !== state.focusedRoomId) return;
        actions.timeline.add(event, toBeginning);
        state.timeline.set(state.timelineRef);
      });
    },
  },
  rooms: {
    focus(room) {
    	state.focusedRoomId = room?.roomId ?? null;
    	state.focusedRoom.set(room);
    	if (room) actions.timeline.set(room);
    },
  },
  spaces: {
    focus(space) {
    	state.focusedSpaceId = space?.roomId ?? null;
    	state.focusedSpace.set(space);
    },
    recalculate() {
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
      state.timelineRef = [];
      for(let event of room.timeline) actions.timeline.add(event);
      state.timeline.set(state.timelineRef);
    },
    add(event, toBeginning) {
      if (!["m.room.create", "m.room.message"].includes(event.getType())) return;
      if (event.isRedacted()) return;
      
      const timeline = state.timelineRef;
      if (event.getRelation()?.rel_type === "m.replace") {
        const id = event.getRelation()?.event_id;
        for (let i = timeline.length - 1; i >= 0; i--) {
          if (timeline[i].eventId === id) {
            timeline[i] = {
              ...formatEvent(event),
              content: event.getContent()["m.new_content"] ?? {},
              original: timeline[i],
            };
          }
        }
      } else {
        timeline[toBeginning ? "unshift" : "push"](formatEvent(event));      
      }
    },
  },
};
