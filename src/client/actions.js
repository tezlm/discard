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
    if (route === null) {
      const { focusedRoomId: roomId, focusedSpaceId: spaceId } = state;
      if (roomId) {
    		actions.to(`/room/${roomId}`);
      } else if (spaceId) {
    		actions.to(`/space/${spaceId}`);
      } else {
        actions.to("/home");
      }
    } else {
      state.pathRef = route;
      state.path.set(route);
    }
  }
};
