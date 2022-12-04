import { state, actions } from "./client/index.js";
import App from "./ui/App.svelte";
import "./client/matrix/e2ee.js";

globalThis.state = state;
globalThis.actions = actions;
globalThis.todo = () => state.popup.set({ id: "todo" });

actions.client.fetch().then(() => {
  new App({ target: document.body });
});

