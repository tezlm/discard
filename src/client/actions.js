import { writable, get } from "svelte/store";
import * as parser from "./matrix/parser.js";
import * as client from "./actions/client.js";
import * as timeline from "./actions/timeline.js";
import * as rooms from "./actions/rooms.js";
import * as slice from "./actions/slice.js";
import * as spaces from "./actions/spaces.js";

// TODO: timeline slice

function getDefaultRoomState() {
  return {
    input: "",
    rows: 1,
    reply: null,
    edit: null,
    focused: null,
    upload: null,
    typing: [],
    slice: [],
  };
}

export default {
  client,
  rooms,
  timeline,
  parser,
  slice,
  spaces,
};
