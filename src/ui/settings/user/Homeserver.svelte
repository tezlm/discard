<script>
import { formatSize } from "../../../util/format.js";
</script>
<style>
.homeserver {
  border: solid var(--bg-spaces) 1px;
  background: var(--bg-rooms-members);
  padding: 1em;
  border-radius: 3px;
}

.big {
  font-size: 1.5em;
  font-weight: bold;
}

.ohno {
  color: var(--color-red);
}

h3 {
  margin-top: 1em;
}
</style>
<div class="homeserver">
  You are {#if navigator.onLine}connected to{:else}<span class="ohno">disconnected</span> from{/if}<br>
  <span class="big">{localStorage.getItem("homeserver")}</span>
</div>
<br />

{#if navigator.onLine}
  <h3>Capabilities</h3>
  {#await state.api.fetchAuth("GET", "/_matrix/media/v3/config")}
  <p>Max file size: loading..</p>
  {:then config}
  <p>Max file size: <b>{formatSize(config["m.upload.size"])}</b></p>
  {/await}
  {#await state.api.fetch("GET", "/capabilities")}
  <p>Loading server capabilities</p>
  {:then { capabilities: cap }}
  <p>You <b>{cap["m.change_password"]?.enabled ? "can" : "cannot"}</b> change your password</p>
  <p>You <b>{cap["m.set_avatar_url"]?.enabled ? "can" : "cannot"}</b> change your avatar</p>
  <p>You <b>{cap["m.set_displayname"]?.enabled ? "can" : "cannot"}</b> change your display name</p>

  <h3>Rooms</h3>
  <p>The default room version is <b>{cap["m.room_versions"].default}</b></p>
  <p>The server supports room versions <b>{Object.entries(cap["m.room_versions"].available).map(i => i[0] + (i[1] === "unstable" ? " (unstable)" : "")).join(", ")}</b></p>
  {/await}
{:else}
  <p>Come online to see more info</p>
{/if}
