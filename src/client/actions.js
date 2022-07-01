const sdk = globalThis.matrixcs;

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
      if (!homeserver || !userId || !token) return null;
      
      const client = sdk.createClient({
        baseUrl: "https://" + homeserver,
        accessToken: token,
        userId: userId,
        store: await actions.client.getStore(),
      });
      client.startClient();
      state.client = client;
      state.scene.set("chat");
      actions.client.listen(client);
    },
    // login to the homeserver ang create a new client
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
        state.scene.set("chat");
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
      const updateRooms = () => state.rooms.set(client.getRooms());
      client.once("sync", updateRooms);
      client.on("sync", actions.spaces.recalculate);
      client.on("Room.myMembership", updateRooms);
      client.on("Room.myMembership", actions.spaces.recalculate);
      client.on("Room.name", updateRooms);
      client.on("Room.timeline", actions.rooms.updateTimeline);
    },
  },
  rooms: {
    focus(room) {
    	state.focusedRoomId = room?.roomId ?? null;
    	state.focusedRoom.set(room);
    	if (room) state.timeline.set(room.timeline);
    },
    updateTimeline(event) {
      if (!state.focusedRoomId) return;
      if (event.getRoomId() !== state.focusedRoomId) return;
      state.timeline.set(state.client.getRoom(state.focusedRoomId).timeline);
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
      const orphans = state.client.getRooms().filter(i => !inSpaces.includes(i));
      spaceMap.set("orphanRooms",  orphans.filter(i => !i.isSpaceRoom()).map(i => i.roomId));
      spaceMap.set("orphanSpaces", orphans.filter(i =>  i.isSpaceRoom()).map(i => i.roomId));
      state.spaceMap.set(spaceMap);
    },
  },
};
