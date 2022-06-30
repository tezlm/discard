<script>
export let localpart = "";
export let homeserver = "";

function update() {
  if (homeserver.startsWith("@")) {
    const [newLocal, newServer] = homeserver.slice(1).split(":");
    if (newLocal) localpart = newLocal;
    homeserver = newServer;
    document.getElementById("localpart").focus(); 
  }

  localpart  = localpart.replace(/^@*/, "");
  if (localpart.includes(":"))  {
    const [newLocal, newServer] = localpart.split(":");
    localpart = newLocal;
    if (newServer) homeserver = newServer;
    document.getElementById("homeserver").focus(); 
  }
  if (homeserver.includes(":")) {
    const [newLocal, newServer] = homeserver.split(":"); 
    homeserver = newServer;
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
  padding: 10px;
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
  <span>@</span>
  <input id="localpart"  bind:value={localpart}  on:input={update} placeholder="cool-id" />
  <span>:</span>
  <input id="homeserver" bind:value={homeserver} on:input={update} placeholder="example.org" />
</div>

