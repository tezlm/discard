const defaultAvatar = "mxc://celery.eu.org/Wm9T9Nnch8IUQsVaJAInkaoVsgCJlmGx";

export const getDisplayName = (who) => state.client.getUser(who).displayName;
export const getAvatar = (who) => state.client.mxcUrlToHttp(state.client.getUser(who).avatarUrl ?? defaultAvatar, 40, 40);
