import * as parser from "./matrix/parser.js";
import * as client from "./actions/client.js";
import * as timeline from "./actions/timeline.js";
import * as rooms from "./actions/rooms.js";
import * as slice from "./actions/slice.js";
import * as spaces from "./actions/spaces.js";

export default {
  client,
  rooms,
  timeline,
  parser,
  slice,
  spaces,
};
