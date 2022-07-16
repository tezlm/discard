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
  const syncer = new Syncer(api);
  syncer.start();
  state.log.matrix("starting sync");
  
  state.api = api;
  state.syncer = syncer;
  state.userId = userId;
  state.scene.set("loading");
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
    state.log.matrix("starting sync");
    state.api = api;
    state.syncer = syncer;
    state.userId = userId;
    state.scene.set("loading");
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

export async function logout() {
  state.syncer.stop();
  state.api.logout();
  localStorage.removeItem("token");
  state.scene.set("auth");
  state.popup.set({});
  state.client = null;
}

// TODO: FIX
export async function listen(syncer) {
  state.userId = localStorage.getItem("userid");
  // new meta
  /*
   * ui <-----------------
   *  \                   \
   *   ----> actions -> state
   *    /
   * matrix
   *
   */
  /*
  
  let synced = false;

  function updateAll() {
    actions.rooms.update();
    actions.spaces.update();
  }
  
  function shouldHandle(event) {
    return state.focusedRoomId && (event.getRoomId() === state.focusedRoomId);
  }
  
  syncer.on("Room.name", () => synced && updateAll());
  syncer.on("Room", () => synced && updateAll());
  syncer.on("deleteRoom", () => synced && updateAll());
  
  // room timeline
  syncer.on("Room.timeline", (event, _, toBeginning) => {
    if (!toBeginning) actions.rooms.update();
    const atEnd = actions.slice.isAtEnd();
    actions.timeline.add(event, toBeginning);

    if (shouldHandle(event) && !toBeginning) {
      if (event.isState()) {
        state.focusedRoom.set(actions.rooms.get(state.focusedRoomId));
        return;
      }
      
      if (atEnd) {
        // TODO: fix relations
        if (event.isRelation()) {
          // state.sliceEnd = state.timeline.at(-1);
          // state.sliceRef[state.sliceRef.length - 1] = state.timeline.at(-1);
        } else {
          state.sliceRef.push(state.timeline.at(-1));
          state.sliceEnd = state.timeline.at(-1);
      
          const startIndex = state.timeline.lastIndexOf(state.sliceStart);
          if (startIndex >= 0) {
            state.sliceStart = state.timeline[startIndex + 1];
            state.sliceRef.shift();
          }
        }
      
        state.slice.set(state.sliceRef);        
      }
    }
  });
  syncer.on("Room.redaction", (event) => {
    actions.rooms.update();
    if (!shouldHandle(event)) return;
    actions.timeline.remove(event);
    state.sliceRef = actions.slice.reslice();
    state.slice.set(state.sliceRef);
  });
  syncer.on("Room.localEchoUpdated", (event, _, id) => {
    if (!id) return;
    const original = state.events.get(id);
    if (!original) return;
    original.eventId = event.getId();
    original.isSending = false;
    state.events.set(event.getId(), original);
    
    const index = state.timeline.lastIndexOf(id);
    if (index >= 0) state.timeline[index] = event.getId();
    if (state.sliceEnd === id) state.sliceEnd = event.getId();
    
    state.sliceRef = actions.slice.reslice();
    state.slice.set(state.sliceRef);
  });
  
  // misc
  syncer.on("Room.receipt", (event) => {
    const users = Object.values(event.getContent()).map(i => Object.keys(i["m.read"] ?? {})).flat(); // readable and maintainable code
    if (!users.includes(state.client.getUserId())) return;
    actions.rooms.update();
    state.slice.set(state.sliceRef);
  });
  syncer.on("RoomMember.typing", (_, member) => {
    if (member.userId === client.getUserId()) return;
    const typing = state.roomStates.get(member.roomId)?.typing;
    if (!typing) return;
    typing[member.typing ? "add" : "delete"](member.userId);
    
    if (member.roomId === state.focusedRoomId) {
      state.roomState.typing.set(typing);
    }
  });
  syncer.once("logout", () => {
    state.scene.set("auth");
    state.popup.set({});
    state.client = null;
    localStorage.removeItem("token");
  });
  */
}
