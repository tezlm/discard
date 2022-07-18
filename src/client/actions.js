import { writable, get } from "svelte/store";
import Slice from "./matrix/slice.js"; // TODO: move into actions/slice.js
import * as client from "./actions/client.js";
import * as timeline from "./actions/timeline.js";
import * as rooms from "./actions/rooms.js";
import * as slice from "./actions/slice.js";
import * as parser from "./matrix/parser.js";

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

export default {
  client,
  rooms,
  timeline,
  parser,
  slice,
  _rooms: {
    async focus(room) {
      state.log.ui("set focused room to " + room?.roomId);
      
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
        
        state.timeline = state.roomTimelines.get(room.roomId).live;
        if (!state.timeline.length) await state.timeline.backwards();
        
        if (!state.roomSlices.has(room.roomId)) {
          const slice = new Slice(state.roomTimelines.get(room.roomId));
          state.roomSlices.set(room.roomId, slice);
        }
        
        state.slice.set(state.roomSlices.get(room.roomId));
      }
      
      // update recent rooms
      const recentIndex = state.recentRooms.findIndex(i => i.roomId === room.roomId);
      if (recentIndex >= 0) state.recentRooms.splice(recentIndex, 1);
      state.recentRooms.unshift(room);
      if (state.recentRooms.length > 8) state.recentRooms.pop();
    },
  },
  spaces: {
    focus(space) {
    	state.focusedSpace.set(space);
    	state.navRooms.set(state.spaces.get(space?.roomId ?? "orphanRooms"));
    },
  },
};
