import defaultAv from "../assets/defaultavatar.png";
export const defaultAvatar = defaultAv;
export const getDisplayName = (who) => state.client.getUser(who).displayName;
export const getAvatar = (who) => state.client.mxcUrlToHttp(state.client.getUser(who).avatarUrl, 40, 40) || defaultAvatar;
