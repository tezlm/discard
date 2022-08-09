import olmJsPath from "@matrix-org/olm/olm.js?url";
import olmWasmPath from "@matrix-org/olm/olm.wasm?url";

export async function load() {
  await addScript(olmJsPath);
  await Olm.init({ locateFile: () => olmWasmPath });
  
  function addScript(path) {
    const script = document.createElement("script");
    const promise = new Promise((res, rej) => {
      script.onload = res;
      script.onerror = rej;
    })
    script.src = path;
    document.body.append(script);
    return promise;
  }
}

export class Account {
  constructor(userId) {
    this._wrapped = new Olm.Account();
    this.userId = userId;
  }
  
  generateOneTimeKeys() {
    const olm = this._wrapped;
    const maxKeys = olm.max_number_of_one_time_keys();
    olm.generate_one_time_keys(maxKeys);
    return JSON.parse(olm.one_time_keys());
  }

  generateFallbackKey() {
    const olm = this._wrapped;
    olm.generate_fallback_key();
    return JSON.parse(olm.fallback_key());
  }
}

window.Account = Account;

load();
