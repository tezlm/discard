import { state, actions } from "./client/index.js";
import App from "./ui/App.svelte";

// const api = new Api(localStorage.getItem("token"), "https://celery.eu.org");
// const filter = await api.postFilter("@tezlm:celery.eu.org", { rooms: { state: { lazy_load_members: true }}});
// api.useFilter(filter);
// const syncer = new Syncer(api);
// syncer.start();

globalThis.state = state;
globalThis.actions = actions;
globalThis.todo = () => state.popup.set({ id: "todo" });

await actions.client.fetch();

const app = new App({ target: document.body });
export default app;
