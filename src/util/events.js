import defaultAv from "../assets/default-avatar.png";
export const defaultAvatar = defaultAv;
export const getDisplayName = (who) => state.client.getUser(who)?.displayName || who;
export const getAvatar = (who) => state.client.mxcUrlToHttp(state.client.getUser(who).avatarUrl, 40, 40) || defaultAvatar;
