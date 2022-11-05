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
  actions.to("/loading");
  state.log.debug("hello, there!");
  
  const homeserver = localStorage.getItem("homeserver");
  const userId = localStorage.getItem("userid");
  const token = localStorage.getItem("token");
  if (!homeserver || !userId || !token) {
    actions.to("/auth");
    return null;
  }
  
  const api = new Api(await resolveWellKnown(homeserver), token);
  const filter = await api.postFilter(userId, defaultFilter);
  api.useFilter(filter);
  const client = new Client({ baseUrl: api.baseUrl, token, userId });
  state.log.matrix("starting sync");  
  client.start();
  return start(api, client, userId);
}

// login to the homeserver and create a new client
export async function login({ localpart, homeserver, password }) {
  const userId = `@${localpart}:${homeserver}`;
  const api = new Api(await resolveWellKnown(homeserver));

  try {
    state.log.matrix("logging in");
    const { accessToken, deviceId } = await api.login(userId, password, Math.random() > 0.99 ? "discount" : "discard");
    const filter = await api.postFilter(userId, defaultFilter);
    api.useFilter(filter);
    localStorage.setItem("homeserver", homeserver);
    localStorage.setItem("userid", userId);
    localStorage.setItem("deviceid", deviceId);
    localStorage.setItem("token", accessToken);
    const client = new Client({ baseUrl: api.baseUrl, token: accessToken, userId });
    state.log.matrix("starting sync");
    actions.to("/loading");
    client.start();
    return start(api, client, userId);
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
    const req = await window.fetch(`https://${domain}/.well-known/matrix/client`)
      .catch(() => window.fetch(`http://${domain}/.well-known/matrix/client`));
    const json = await req.json();
    return json["m.homeserver"]?.base_url;
  } catch {
    return "//" + domain;
  }
}

function start(api, client, userId) {
  state.api = api;
  state.syncer = client;
  state.client = client;
  state.userId = userId;
 
  client.on("join", (room) => actions.rooms.handleJoin(room));
  client.on("leave", (room) => actions.rooms.handleLeave(room.id));

  client.on("invite", () => state.invites.set(client.invites));
  client.on("leave-invite", () => state.invites.set(client.invites));
  client.on("join", () => state.invites.set(client.invites));
    
  client.on("state", (state) => actions.rooms.handleState(state));
  client.on("event", (event) => actions.timeline.handle(event));
  client.on("redact", (event) => actions.timeline.handle(event));
  client.on("ephemeral", (edu) => {
    if (edu.type !== "m.typing") return;
  
    const roomState = state.roomStates.get(edu.room.id);
    if (!roomState) return;
    roomState.typing = edu.content.user_ids;
    if (edu.room.id === state.focusedRoomId) {
      state.roomState.typing.set(edu.content.user_ids);
    }
  });
  
  client.on("remoteEcho", (echo, txnId) => {
    const { id, room, type } = echo;
    state.log.matrix(`successfully sent ${id} in ${room.id} (for ${txnId})`);
    if (type === "m.room.message") {
      room.accountData.set("m.fully_read", id);
      state.api.sendReceipt(room.id, id);
    }
    actions.timeline.reslice(room, true);
  });
  
  client.on("notifications", (_room, _notifs) => {
    actions.spaces.refresh();
  });
  
  client.on("roomAccountData", (room, event) => {
    actions.rooms.handleAccount(room, event);
  });
  
  client.on("accountData", ({ type, content }) => {
    if (type === "org.eu.celery.settings") {
      const settings = new Settings(content);
      state.settings.set(settings);
      state.settingsRef = settings;
    }
    if (type === "m.push_rules") {
      state.pushRules.set(new PushRules(content.global));
      actions.spaces.refresh();
    }
    state.accountDataRef.set(type, content);
    state.accountData.set(state.accountDataRef);
  });
  
  client.on("ready", () => {
    state.log.matrix("ready");
    actions.spaces.update();
    actions.to("/home");
  });
}

export async function logout() {
  state.log.debug("bye!");
  state.client.stop();
  state.api.logout();
  localStorage.clear();
  actions.to("/auth");
  state.popup.set({});
  state.client = null;

	state.navRooms.set([]);
	state.navSpaces.set([]);
  
  state.rooms.clear();
  state.spaces.clear();
  state.dms.clear();
}

// TEMP: there is no local echo for settings account data
export function reloadSettings() {
  state.settings.set(state.settingsRef);
}
