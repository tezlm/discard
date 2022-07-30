// import { Store } from "../matrix/store.js";
import Api from "../matrix/api.js";
import Syncer from "../matrix/syncer.js";

const defaultFilter = {
  room: {
    state: { lazy_load_members: true },
  },
  presence: {
    types: [],
  },
};

// try to fetch the current client
export async function fetch() {
  state.log.debug("hello, there!");
  
  const homeserver = localStorage.getItem("homeserver");
  const userId = localStorage.getItem("userid");
  const token = localStorage.getItem("token");
  if (!homeserver || !userId || !token) {
    state.scene.set("auth");
    return null;
  }
  
  const api = new Api("https://" + homeserver, token);
  const filter = await api.postFilter(userId, defaultFilter);
  api.useFilter(filter);
  state.log.matrix("starting sync");  
  const syncer = new Syncer(api);
  syncer.start();
  start(api, syncer, userId);
}

// login to the homeserver and create a new client
export async function login({ localpart, homeserver, password }) {
  const userId = `@${localpart}:${homeserver}`;
  const api = new Api("https://" + homeserver);

  try {
    state.log.matrix("logging in");
    const token = await api.login(userId, password, Math.random() > 0.99 ? "discount" : "discard");
    const filter = await api.postFilter(userId, defaultFilter);
    api.useFilter(filter);
    localStorage.setItem("homeserver", homeserver);
    localStorage.setItem("userid", userId);
    localStorage.setItem("token", token);
    const syncer = new Syncer(api);
    syncer.start();
    start(api, syncer, userId);
    state.log.matrix("starting sync");
  } catch(err) {
    state.log.error(err);
    switch(err.name) {
      case "M_FORBIDDEN": throw "Incorrect username or password";
      case "M_USER_DEACTIVATED": throw "User was deactivated";
      case "ConnectionError": throw "Invalid homeserver";
      default: throw `Unknown error (${err.name}})`;
    }
  }
}

function start(api, syncer, userId) {
  state.api = api;
  state.syncer = syncer;
  state.userId = userId;
  state.scene.set("loading");
  
  syncer.on("timeline", (roomId, event) => actions.timeline.handle(roomId, event, false));
}

export async function logout() {
  state.syncer.stop();
  state.api.logout();
  localStorage.removeItem("token");
  state.scene.set("auth");
  state.popup.set({});
  state.client = null;

  state.rooms.clear();
  state.spaces.clear();
  state.dms.clear();
}
