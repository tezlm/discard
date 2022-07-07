<script>
import UserId from "./atoms/UserId.svelte";
import Button from "./atoms/Button.svelte";
import Input from "./atoms/Input.svelte";
import Popup from "./atoms/Popup.svelte";
import { formatDate } from "../util/format.js";
let client = state.client;
let current = state.popup;
let data; reset();

// TODO: there are quite a lot of popups here, maybe move each of them into a separate file?

function closePopup() {
  state.popup.set({});
}

function cancelPopup() {
  if ($current.cancel) $current.cancel();
  closePopup();
}

function confirmPopup() {
  if (!$current.confirm) return;
  $current.confirm(data);
  closePopup();
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

function rnd(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function handleKeyDown(e) {
  if (!$current.id) return;
  if (e.key !== "Escape" && e.key !== "Enter") return;
  if (e.key === "Enter") confirmPopup();
  if (e.key === "Escape") cancelPopup();
  e.preventDefault();
  e.stopImmediatePropagation();
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

pre {
  max-width: 600px;
}

.original {
  position: absolute;
  bottom: calc(-1em - 8px);
  left: 0;

  color: var(--fg-notice);
  font-size: 14px;
  font-weight: 500;
  opacity: .5;
  transition: opacity .15s;
}

.original:hover {
  opacity: 1;
}
</style>
{#if $current.id === "info"}
<Popup>
  <h2 slot="header">{$current.head} <div class="close" on:click={closePopup}>&#xd7;</div></h2>
  <div slot="content">
    {#if $current.html}
    {@html $current.body}
    {:else}
    {$current.body}
    {/if}
  </div>
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
    <Input placeholder="awesome-{$current.type}" bind:value={data.name} submitted={() => data.name && state.popup.set({ id: "todo" })} />
  </div>
  <div slot="footer">
    <Button type="link" label="Cancel" clicked={closePopup} />
    <Button type="primary" disabled={!data.name.length} label="Create {capitalize($current.type)}" clicked={() => state.popup.set({ id: "todo" })} />
  </div>
</Popup>
{:else if $current.id === "ban"}
<Popup>
  <h2 slot="header">{$current.name}</h2>
  <div slot="content" style:margin-top="-8px">
    <div style:color="var(--fg-muted)">
        {#if $current.powerLevel < 0}{rnd(["violently", "thoroughly", "briskly"])} {/if}
        {$current.powerLevel > 0 ? "fired" : rnd(["banned", "yeeted", "purged", "banished", "eliminated", "neutralized", "exiled", "expelled", "discontinued", "abolished", "discharged", "vanquished", "ejected"])}
        <!-- yeeted/yote/yaught/yate/yought? -->
        {formatDate($current.date, true)}
    </div>
    <hr />
    <div>
      {#if $current.reason}
        {$current.reason}
      {:else}
        <i>no reason supplied</i>
      {/if}
    </div>
  </div>
</Popup>
{:else if $current.id === "upload"}
<!-- temporary™ awful code -->
<Popup>
  <h2 slot="header">Upload file</h2>
  <div slot="content">
    <div style:margin-bottom="1em" style:margin-top="-8px" >do you want to upload this file?</div>
    {#if $current.file.type.startsWith("image")}
    <img src={URL.createObjectURL($current.file)} alt={$current.file.name} style="max-width: 440px; max-height: 400px; border-radius: 3px; margin: 0 auto; display: block" />
    {/if}
  </div>
  <div slot="footer">
    <Button type="link" label="Nevermind" clicked={closePopup} />
    <Button type="primary" label="Upload!" clicked={() => { $current.confirm(); closePopup() }} />
  </div>
</Popup>
{:else if $current.id === "source"}
<Popup>
  <h3 slot="header">View source <div class="close" on:click={closePopup}>&#xd7;</div></h3>
  <div slot="content">
    <p>note: this is discard's internal event representation, and not matrix's</p><br />
    <pre>{JSON.stringify($current.event, null, 2)}</pre>
  </div>
</Popup>
{:else if $current.id === "attachment"}
<Popup raw>
  <div slot="content">
    <img src={$current.url} style="max-height: 70vh; max-width: 70vw"/>
    <a href={$current.url} class="original">Open original</a>
  </div>
</Popup>
{:else if $current.id === "logout"}
<Popup>
  <h2 slot="header">Log Out</h2>
  <p slot="content">Are you sure you want to logout?</p>
  <div slot="footer">
    <Button type="link" label="Actually nah" clicked={closePopup} />
    <Button type="danger" label="Log Out" clicked={actions.client.logout} />
  </div>
</Popup>
{:else if $current.id === "todo"}
<Popup>
  <h2 slot="header">todo <div class="close" on:click={closePopup}>&#xd7;</div></h2>
  <p slot="content">nice, you found a todo popup</p>
</Popup>
{/if}
<svelte:window on:keydown={handleKeyDown} />
