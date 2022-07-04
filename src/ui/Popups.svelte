<script>
import UserId from "./atoms/UserId.svelte";
import Button from "./atoms/Button.svelte";
import Input from "./atoms/Input.svelte";
import Popup from "./atoms/Popup.svelte";
let client = state.client;
let current = state.popup;
let data; reset();

function closePopup() {
  state.popup.set({});
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

function handleKeyDown(e) {
  if (e.key !== "Escape") return;
  e.stopPropagation();
  closePopup();
}

function reset() {
  data = { name: "" };
}

current.subscribe(reset);
</script>
<style>
.close {
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: 28px;
  font-weight: normal;
  font-family: initial;
  color: var(--fg-muted);
  cursor: pointer;
  transition: color 0.4s;
}

.close:hover {
  color: var(--fg-notice);
}

.split {
  box-shadow: var(--shadow-header);
  margin: 0 -16px;
  height: 3px;
}

.title {
  color: var(--fg-light);
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 16px;
}
</style>
{#if $current.id === "info"}
<Popup>
  <h2 slot="header">{$current.head} <div class="close" on:click={closePopup}>&#xd7;</div></h2>
  <p slot="content">{$current.body}</p>
</Popup>
{:else if $current.id === "leave"}
<Popup>
  <h2 slot="header">Leave {client.getRoom($current.room).name}</h2>
  <p slot="content">
    Are you sure you want to leave <b>{client.getRoom($current.room).name}</b>?
    {#if state.client.getRoom($current.room).getJoinRule() !== "public"}
    You won't be able to rejoin this {$current.type} unless you're re-invited.
    {:else}
    This {$current.type} is public and can be rejoined at any time. (Unless it gets made private!)
    {/if}
  </p>
  <div slot="footer">
    <Button type="link" label="Cancel" clicked={closePopup} />
    <Button type="danger" label="Leave {capitalize($current.type)}" clicked={() => state.popup.set({ id: "todo" })} />
  </div>
</Popup>
{:else if $current.id === "invite"}
<Popup>
  <h3 slot="header">Invite friends to {client.getRoom($current.room).name} <div class="close" on:click={closePopup}>&#xd7;</div></h3>
  <div slot="content">
    <b>ideas</b>
    <p>search box</p>
    <Input placeholder="Search for friends" small />
    <br />
    <br />
    <p>userid entry (discord doesnt have this though)</p>
    <UserId />
    <br />
    <p>link (if exists)</p>
    <Input value="https://matrix.to/#/#somewhere:example.org" />
  </div>
</Popup>
{:else if $current.id === "create"}
<Popup>
  <h3 slot="header">Create {capitalize($current.type)} <div class="close" on:click={closePopup}>&#xd7;</div></h3>
  <div slot="content" style="display:flex;flex-direction:column">
    <span class="title">{capitalize($current.type)} Name</span>
    <Input placeholder="awesome-{$current.type}" bind:value={data.name} submitted={() => state.popup.set({ id: "todo" })} />
  </div>
  <div slot="footer">
    <Button type="link" label="Cancel" clicked={closePopup} />
    <Button type="primary" disabled={!data.name.length} label="Create {capitalize($current.type)}" clicked={() => state.popup.set({ id: "todo" })} />
  </div>
</Popup>
{:else if $current.id === "todo"}
<Popup>
  <h2 slot="header">todo <div class="close" on:click={closePopup}>&#xd7;</div></h2>
  <p slot="content">nice, you found a todo popup</p>
</Popup>
{/if}
<svelte:window on:keydown={handleKeyDown} />
