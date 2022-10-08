// import { Store } from "../matrix/store.js";
import Api from "../matrix/api.js";
import Settings from "../matrix/settings.js";
import PushRules from "../../util/push.js";
import { Client } from "discount";

const defaultFilter = {
  room: {
    state: { lazy_load_members: true },
    timeline: { limit: 0 },
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
  
  const api = new Api(await resolveWellKnown(homeserver), token);
  const filter = await api.postFilter(userId, defaultFilter);
  api.useFilter(filter);
  state.log.matrix("starting sync");  
  const syncer = new Client({ baseUrl: api.baseUrl, token, userId });
  syncer.start();
  start(api, syncer, userId);
}

// login to the homeserver and create a new client
export async function login({ localpart, homeserver, password }) {
  const userId = `@${localpart}:${homeserver}`;
  const api = new Api(await resolveWellKnown(homeserver));

  try {
    state.log.matrix("logging in");
    const token = await api.login(userId, password, Math.random() > 0.99 ? "discount" : "discard");
    const filter = await api.postFilter(userId, defaultFilter);
    api.useFilter(filter);
    localStorage.setItem("homeserver", homeserver);
    localStorage.setItem("userid", userId);
    localStorage.setItem("token", token);
    const syncer = new Client({ baseUrl: api.baseUrl, token, userId});
    syncer.start();
    start(api, syncer, userId);
    state.log.matrix("starting sync");
  } catch(err) {
    switch(err.errcode) {
      case "M_FORBIDDEN": throw "Incorrect username or password";
      case "M_USER_DEACTIVATED": throw "User was deactivated";
      default: throw `Unknown error (${err.name}})`;
    }
  }
}

async function resolveWellKnown(domain) {
  try {
    const req = await window.fetch(`https://${domain}/.well-known/matrix/client`);
    const json = await req.json();
    return json["m.homeserver"]?.base_url;
  } catch {
    return "https://" + domain;
  }
}

function start(api, syncer, userId) {
  state.api = api;
  state.syncer = syncer;
  state.userId = userId;
  state.scene.set("loading");
  
  syncer.on("join", (room, batch) => actions.rooms.handleJoin(room, batch));
  // syncer.on("invite", (roomId, state) => console.log(roomId, state));
  syncer.on("leave", (room) => actions.rooms.handleLeave(room.id));
  
  syncer.on("state", (state) => actions.rooms.handleState(state.room.id, state.raw));
  syncer.on("event", (event) => actions.timeline.handle(event));
  syncer.on("ephemeral", (edu) => {
    if (edu.type !== "m.typing") return;
  
    const roomState = state.roomStates.get(edu.room.id);
    if (!roomState) return;
    roomState.typing = edu.content.user_ids;
    if (edu.room.id === state.focusedRoomId) {
      state.roomState.typing.set(edu.content.user_ids);
    }
  });
  
  syncer.on("notifications", (_room, _notifs) => {
    actions.rooms.update();
    actions.spaces.update();
  });
  
  syncer.on("roomAccountData", (room, event) => {
    actions.rooms.handleAccount(room, event);
  });
  
  syncer.on("accountData", ({ type, content }) => {
    if (type === "org.eu.celery.settings") state.settings.set(new Settings(content));
    if (type === "m.push_rules") state.pushRules.set(new PushRules(content.global));
    state.accountDataRef.set(type, content);
    state.accountData.set(state.accountDataRef);
    state.store.account.put(type, content);
  });
  
  syncer.on("ready", () => {
    state.log.matrix("ready");
    actions.rooms.update();
    actions.spaces.update();
    state.scene.set("chat");
  });
}

export async function logout() {
  // state.syncer.stop();
  state.api.logout();
  localStorage.removeItem("token");
  state.scene.set("auth");
  state.popup.set({});
  state.client = null;

  state.rooms.clear();
  state.spaces.clear();
  state.dms.clear();
}
