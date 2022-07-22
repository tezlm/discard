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
    super(data);
  }
  
  get(key) {
    return super.get(key) ?? defaultSettings.get(key);
  }

  async put(key, val) {
    this.set(key, val);
    state.api.sendAccountData(state.userId, "org.eu.celery.settings", { data: [...this.entries()] });
  }
}
