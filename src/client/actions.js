const sdk = globalThis.matrixcs;

export default {
  client: {
    // try to fetch the current client
    fetch() {
      const homeserver = localStorage.getItem("homeserver");
      const userId = localStorage.getItem("userid");
      const token = localStorage.getItem("token");
      if (!homeserver || !userId || !token) return null;
      const client = sdk.createClient({
          baseUrl: "https://" + homeserver,
          accessToken: token,
          userId: userId,
      });
      client.startClient();
      state.client = client;
      state.scene.set("chat");
      actions.client.listen(client);
    },
    // login to the homeserver ang create a new client
    async login({ localpart, homeserver, password }) {
      const userId = `@${localpart}:${homeserver}`;
      const client = sdk.createClient("https://" + homeserver);
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
      client.on("Room.myMembership", updateRooms);
      client.on("Room.name", updateRooms);
    }
  },
  rooms: {
    switch(id) {
      const room = state.client.getRoom(id);
      if (!room) return;
    	state.focusedRoom.set(id);
    	state.timeline.set(room.timeline);
    },
  }
};
