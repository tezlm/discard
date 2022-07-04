globalThis.global = globalThis; // fixes matrix-js-sdk

const imports = Promise.all([import("./client/index.js"), import('./ui/App.svelte')]);
const [{ state, actions }, { default: App }] = await imports;

global.state = state;
global.actions = actions;

await actions.client.fetch();

const app = new App({ target: document.body });
export default app;
