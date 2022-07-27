import olmJsPath from "@matrix-org/olm/olm.js?url";
import olmWasmPath from "@matrix-org/olm/olm.wasm?url";

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

async function load() {
  await addScript(olmJsPath);
  await Olm.init({ locateFile: () => olmWasmPath });
  console.log(Olm)
}

load();
