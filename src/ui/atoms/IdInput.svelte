<script lang="ts">
export let localpart = "";
export let homeserver = "";
export let kind: "user" | "alias" | "room" = "user";
export let lockHomeserver = false;
export let autofocus = false;
let localpartEl: HTMLInputElement, homeserverEl: HTMLInputElement;

const symbols = {
  "user": "@",
  "room": "!",
  "alias": "#",
};

function update() {
  if (homeserver?.startsWith(symbols[kind])) {
    const [newLocal, newServer] = homeserver.slice(1).split(":");
    if (newLocal) localpart = newLocal;
    homeserver = newServer;
    localpartEl.focus();
  }

  localpart  = localpart?.replace(new RegExp(`^${symbols[kind]}*`), "");
  if (localpart?.includes(":"))  {
    const [newLocal, newServer] = localpart.split(":");
    localpart = newLocal;
    if (newServer && !lockHomeserver) homeserver = newServer;
    homeserverEl?.focus(); 
  }
  if (homeserver?.includes(":")) {
    const [newLocal, newServer] = homeserver.split(":"); 
    if (!lockHomeserver) homeserver = newServer;
    if (newLocal) localpart = newLocal;
  }
}
</script>
<style>
.userid {
  display: flex;
  align-items: center;
}

.userid span {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 10px;
  font-size: 16px;
  background: var(--bg-rooms-members);
}

input {
  font-family: var(--font-primary);
  font-size: 16px;
  padding: 10px;
  width: 100%;
  height: 40px;
  border: none;
  color: inherit;
  background: #202225;
  outline: none;
}

span:nth-child(1) {
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}

input:nth-child(4) {
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  width: 8em;
}
</style>
<div class="userid">
  <span>{symbols[kind]}</span>
  <input bind:value={localpart}  bind:this={localpartEl}  on:input={update} placeholder="cool-id"     {autofocus} />
  {#if lockHomeserver}
  <span>:{homeserver}</span>
  {:else}
  <span>:</span>
  <input bind:value={homeserver} bind:this={homeserverEl} on:input={update} placeholder="example.org" />
  {/if}
</div>
