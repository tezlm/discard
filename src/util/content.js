// TODO: fix this
import defaultAv from "../assets/default-avatar.png";
export const defaultAvatar = defaultAv;
export const parseMxc = (mxc, thumbSize) => thumbSize
  ? mxc?.replace(/mxc:\/\/([^/]+)\/(.+)/, `${state.api.baseUrl}/_matrix/media/r0/thumbnail/$1/$2?height=${thumbSize}&width=${thumbSize}`)
  : mxc?.replace(/mxc:\/\/([^/]+)\/(.+)/, `${state.api.baseUrl}/_matrix/media/r0/download/$1/$2`);

export const getDisplayName = (userId, roomId, raw = false) => 
  // state.client.getRoom(roomId)?.getMember(userId)?.[raw ? "rawDisplayName" : "name"] ??
  // state.client.getUser(userId)?.[raw ? "rawDisplayName" : "displayName"]??
  userId;
export const getAvatar = (userId, roomId, size = 40) => 
  // state.client.getRoom(roomId)?.getMember(userId)?.getAvatarUrl(state.client.baseUrl, size, size) ??
  // state.client.mxcUrlToHttp(state.client.getUser(userId)?.avatarUrl, size, size) ??
  defaultAvatar;

export function calculateHash(str) {
  if (!str?.length) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}
