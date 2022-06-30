import "./matrix/browser-matrix.js";
import App from './ui/App.svelte';

globalThis.sdk = matrixcs;
globalThis.client = getClient();

const app = new App({ target: document.body });
export default app;

function getClient() {
  const homeserver = localStorage.getItem("homeserver");
  const userId = localStorage.getItem("userid");
  const token = localStorage.getItem("token");
  if (!homeserver || !userId || !token) return null;
  const client = sdk.createClient({
      baseUrl: "https://" + homeserver,
      accessToken: token,
      userId: userId,
  });
  client.startClient();
  return client;
}
