// TODO: local echo for settings?

const defaultSettings = new Map();

// appearance
defaultSettings.set("showmemberlist", true);
defaultSettings.set("namecolors", "always");
defaultSettings.set("reducemotion", false);
defaultSettings.set("showjoinleave", "always");
defaultSettings.set("shownickavatar", "always");
defaultSettings.set("showmoderation", "always");
defaultSettings.set("showunknown", "always");

// text box
defaultSettings.set("sendtyping", true);
defaultSettings.set("autocomplete", true);
defaultSettings.set("showembeds", "unencrypted");

// misc
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

  put(key, val) {
    this.set(key, val);
    actions.client.reloadSettings();
    state.api.sendAccountData(state.userId, "org.eu.celery.settings", Object.fromEntries(this.entries()));
  }
  
  /*
  // convert into store?
  subscribe() {}
  set(val) {}
  */
}
