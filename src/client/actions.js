import * as parser from "./matrix/parser";
import * as client from "./actions/client";
import * as timeline from "./actions/timeline";
import * as rooms from "./actions/rooms";
import * as slice from "./actions/slice";
import * as spaces from "./actions/spaces";

export default {
  client,
  rooms,
  timeline,
  parser,
  slice,
  spaces,
  to(route) {
    state.pathRef = route;
    state.path.set(route);
  }
};
