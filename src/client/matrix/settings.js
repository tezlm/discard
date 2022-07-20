const defaultSettings = new Map();
defaultSettings.set("namecolors", "always");

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
