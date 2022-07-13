// TODO: fix this
import defaultAv from "../assets/default-avatar.png";
export const defaultAvatar = defaultAv;
export const getDisplayName = (userId, roomId, raw = false) => 
  // state.client.getRoom(roomId)?.getMember(userId)?.[raw ? "rawDisplayName" : "name"] ??
  // state.client.getUser(userId)?.[raw ? "rawDisplayName" : "displayName"]??
  userId;
export const getAvatar = (userId, roomId, size = 40) => 
  // state.client.getRoom(roomId)?.getMember(userId)?.getAvatarUrl(state.client.baseUrl, size, size) ??
  // state.client.mxcUrlToHttp(state.client.getUser(userId)?.avatarUrl, size, size) ??
  defaultAvatar;
