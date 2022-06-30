import { state, actions } from "./client/index.js";
import App from './ui/App.svelte';

globalThis.state = state;
globalThis.actions = actions;

await actions.client.fetch();

const app = new App({ target: document.body });
export default app;
