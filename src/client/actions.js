import { writable, get } from "svelte/store";
import * as client from "./actions/client.js";
import * as events from "./actions/events.js";
import * as timeline from "./actions/timeline.js";

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
    slice: [],
  };
}

// TODO: ..?
function getDefaultTimeline() {
  return {
    timeline: [],
    slice: writable([]),
    sliceStart: null,
    sliceEnd: null,
    sliceStartIdx: 0,
    sliceEndIdx: 0,
  }
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
  client,
  events,
  timeline: {
    set(room) {
      state.timeline = [];
      for(let event of room.timeline) actions.timeline.add(event);
      if (state.timeline.length === 0) {
        state.timeline.push(null);
      }
    },
    add: timeline.add,
    get: timeline.get,
    remove: timeline.redact,
  },
  rooms: {
    focus(room) {
      console.log("set focused room");
      
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
        
        state.timeline = actions.timeline.get(room.roomId);
        
        const newStart = Math.max(state.timeline.length - 51, 0);
        const newEnd = state.timeline.length - 1;

        state.sliceStart = state.timeline[newStart];
        state.sliceEnd = state.timeline[newEnd];
        state.sliceRef = state.timeline.slice(newStart, newEnd + 1);
        state.slice.set(state.sliceRef);
      }
      
      // update recent rooms
      const recentIndex = state.recentRooms.findIndex(i => i.roomId === room.roomId);
      if (recentIndex >= 0) state.recentRooms.splice(recentIndex, 1);
      state.recentRooms.unshift(room);
      if (state.recentRooms.length > 8) state.recentRooms.pop();
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
  slice: {
    isAtEnd() {
      const endIndex = state.timeline.lastIndexOf(state.sliceEnd);
      return endIndex === state.timeline.length - 1;
    },
    reslice() {
      const startIndex = state.timeline.lastIndexOf(state.sliceStart);
      const endIndex = state.timeline.lastIndexOf(state.sliceEnd);
      return state.timeline.slice(startIndex, endIndex + 1);
    },
    async backwards(limit = 50, lastTop) {
      const oldStartIndex = state.timeline.indexOf(state.sliceStart);
      if (oldStartIndex - limit < 0 && state.events.get(state.timeline[0])?.type !== "m.room.create") {
      	const liveTimeline = state.client.getRoom(state.focusedRoomId).getLiveTimeline();
      	await state.client.paginateEventTimeline(liveTimeline, { backwards: true, limit: 200 });
        if (state.timeline.length < limit && state.timeline.at(-1) !== lastTop) { // lastTop is a hacky solution for now
          return actions.slice.backwards(limit, state.timeline.at(-1));
        }
      }

      const startIndex = state.timeline.indexOf(state.sliceStart);
      const endIndex = state.timeline.indexOf(state.sliceEnd);
      if (startIndex < 0) throw "this shouldn't happen";
      if (endIndex < 0) throw "this shouldn't happen";
      
      const eventCount = 100;
      const newStart = Math.max(startIndex - limit, 0);
      const newEnd = Math.min(newStart + eventCount, state.timeline.length - 1);
       
      console.log(`now viewing [${newStart}..${newEnd}] of ${state.timeline.length}`);
      
      state.sliceStart = state.timeline[newStart];
      state.sliceEnd = state.timeline[newEnd];
      state.sliceRef = state.timeline.slice(newStart, newEnd + 1);
      state.slice.set(state.sliceRef);
    },
    async forwards(limit = 50) {
      const startIndex = state.timeline.indexOf(state.sliceStart);
      const endIndex = state.timeline.indexOf(state.sliceEnd);
      if (startIndex < 0) throw "this shouldn't happen";
      if (endIndex < 0) throw "this shouldn't happen";
      
      const eventCount = 100;
      const newStart = Math.max(startIndex + limit, 0);
      const newEnd = Math.min(newStart + eventCount, state.timeline.length - 1);
      
      console.log(`now viewing [${newStart}..${newEnd}] of ${state.timeline.length}`);
      
      state.sliceStart = state.timeline[newStart];
      state.sliceEnd = state.timeline[newEnd];
      state.sliceRef = state.timeline.slice(newStart, newEnd + 1);
      state.slice.set(state.sliceRef);
    },
    async jump(_roomId, eventId) {
      // TODO: add better jumping/context support
      console.log("jump to ", eventId)
      // const index = state.timeline.indexOf(eventId);
      
      // if (!state.sliceRef.find(i => i.eventId === eventId)) {
      //   if (index === -1) return; // TODO: actually finish this
        
      //   const context = 50;
      //   const newStart = Math.max(index - context, 0);
      //   const newEnd = Math.min(index + context, state.timeline.length - 1);
        
      //   state.sliceStart = state.timeline[newStart].eventId;
      //   state.sliceEnd = state.timeline[newEnd].eventId;
      //   state.sliceRef = state.timeline.slice(newStart, newEnd + 1);
      //   state.slice.set(state.sliceRef);
        
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
      // }
      
      state.roomState.focused.set(eventId);
    },
  },
};
