const defaultSettings = new Map();
defaultSettings.set("namecolors", "always");
defaultSettings.set("showjoinleave", true);
defaultSettings.set("showmembership", true);
defaultSettings.set("shownickavatar", true);
defaultSettings.set("shownametopic", true);
defaultSettings.set("sendtyping", true);
defaultSettings.set("autocomplete", true);
defaultSettings.set("showembeds", "unencrypted");
defaultSettings.set("autojoin", true);

export default class Settings extends Map {
  constructor(data) {
    if (data) {
      super(Object.entries(data));
    } else {
      super();
    }
  }
  
  get(key) {
    return super.get(key) ?? defaultSettings.get(key);
  }

  async put(key, val) {
    this.set(key, val);
    state.api.sendAccountData(state.userId, "org.eu.celery.settings", Object.fromEntries(this.entries()));
  }
}
