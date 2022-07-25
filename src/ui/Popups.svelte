<script>
import UserId from "./atoms/UserId.svelte";
import Button from "./atoms/Button.svelte";
import Input from "./atoms/Input.svelte";
import Popup from "./atoms/Popup.svelte";
import Create from "./popups/Create.svelte";
import Leave from "./popups/Leave.svelte";
import Ban from "./popups/Ban.svelte";
import Switcher from "./popups/Switcher.svelte";
import Logout from "./popups/Logout.svelte";
import { formatDate, formatSize } from "../util/format.js";
let current = state.popup;
let data; reset();

// TODO: there are quite a lot of popups here, maybe move each of them into a separate file?
// TODO: move emoji picker and user popout

$: if ($current.id) {
  state.log.ui("open popup " + $current.id);
}

function closePopup() {
  state.popup.set({ ...$current, id: null });
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

function rnd(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function handleKeyDown(e) {
  if (e.code === "KeyK" && e.ctrlKey) {
    if ($current.id === "switcher") {
      closePopup();
    } else if(!$current.id) {
      state.popup.set({ id: "switcher" });
    }
    return;
  }

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
  right: 12px;
  font-size: 28px;
  font-weight: normal;
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
  margin: 8px 0;
}

pre {
  max-width: 600px;
  overflow-y: auto;
  max-height: 50vh;
}

.original {
  position: absolute;
  top: 100%;
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
{#if $current.id === "nick"}
<Popup>
  <h2 slot="header">Change Nickname</h2>
  <div slot="content">
    <span class="title">Nickname<br><br></span>
    <Input />
  </div>
  <div slot="footer">
    <Button type="link" label="Cancel" clicked={closePopup} />
    <Button type="primary" label="Save" clicked={() => state.popup.set({ id: "todo" })} />
  </div>
</Popup>
{:else if $current.id === "info"}
<Popup>
  <h2 slot="header">{$current.head} <div class="close icon" on:click={closePopup}>close</div></h2>
  <div slot="content" style:width="440px">
    {#if $current.html}
    {@html $current.body}
    {:else}
    {$current.body}
    {/if}
  </div>
</Popup>
{:else if $current.id === "invite"}
<Popup>
  <h3 slot="header">Invite friends to {$current.room.name} <div class="close icon" on:click={closePopup}>close</div></h3>
  <div slot="content">
    <b>ideas</b>
    <p>search box</p>
    <Input placeholder="Search for friends" small />
    <br />
    <br />
    <p>userid entry (discord doesnt have this though)</p>
    <UserId />
    <br />
    {#if $current.room.state.find(i => i.type === "m.room.canonical_alias")?.content?.alias && $current.room.joinRule === "public"}
      <div class="title">Or, send a link</div>
      <Input value={"https://matrix.to/#/" + encodeURIComponent($current.room.state.find(i => i.type === "m.room.canonical_alias").content.alias)} autofocus />
    {/if}
  </div>
</Popup>
{:else if $current.id === "member"}
<Popup>
  <h2 slot="header">{$current.member.name}</h2>
  <div slot="content" style:margin-top="-8px">
    {#if ["invite", "ban"].includes($current.membership)}
    <div style:color="var(--fg-muted)">
      {#if $current.membership === "ban"}
      {#if $current.member.power < 0}{rnd(["violently", "thoroughly", "briskly"])} {/if}
      {$current.powerLevel > 0 ? "fired" : rnd(["banned", "yeeted", "purged", "banished", "eliminated", "neutralized", "exiled", "expelled", "discontinued", "abolished", "discharged", "vanquished", "ejected"])}
      {:else}
      invited
      {/if}
      {formatDate($current.member.date, true)}
    </div>
    <hr />
    <div>
      {#if $current.reason && $current.reason !== "<no reason supplied>"}
        {$current.reason}
      {:else}
        <i>no reason supplied</i>
      {/if}
    </div>
    {/if}
  </div>
  <div slot="footer">
    <Button type="link" label="Okay" clicked={closePopup} />
    {#if $current.canKick && $current.membership !== "ban"}
      <Button type="danger" label={$current.membership === "join" ? "Kick" : "Disinvite"} clicked={() => state.popup.set({ id: "todo" })} />
    {/if}
    {#if $current.canBan}
      {#if $current.membership === "ban"}
      <Button type="danger" label="Unban" clicked={() => state.popup.set({ id: "todo" })} />
      {:else}
      <Button type="danger" label="Ban" clicked={() => state.popup.set({ id: "ban", member: $current.member, room: $current.room })} />
      {/if}
    {/if}
  </div>
</Popup>
{:else if $current.id === "upload"}
<!-- temporary™ awful code -->
<Popup>
  <h2 slot="header">Upload file</h2>
  <div slot="content">
    <div style:margin-bottom="1em" style:margin-top="-8px" >do you want to upload {$current.file.name || "this file"}? <span style="color: var(--fg-muted)">({formatSize($current.file.size)})</span></div>
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
  <h3 slot="header">View source <div class="close icon" on:click={closePopup}>close</div></h3>
  <div slot="content">
    <p>note: this is discard's internal event representation, and not matrix's. <a style:cursor="pointer"on:click={e => {e.preventDefault();navigator.clipboard.writeText($current.event.eventId)}}>copy id</a></p><br />
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
{:else if $current.id === "create"}
<svelte:component this={Create} {current} bind:confirm={$current.confirm} />
{:else if $current.id === "leave"}
<svelte:component this={Leave} {current} bind:confirm={$current.confirm} />
{:else if $current.id === "ban"}
<svelte:component this={Ban} {current} bind:confirm={$current.confirm} />
{:else if $current.id === "switcher"}
<svelte:component this={Switcher} bind:confirm={$current.confirm} />
{:else if $current.id === "logout"}
<svelte:component this={Logout} />
{:else if $current.id === "todo"}
<Popup>
  <h2 slot="header">todo <div class="close icon" on:click={closePopup}>close</div></h2>
  <p slot="content">nice, you found a todo popup</p>
</Popup>
{/if}
<svelte:window on:keydown={handleKeyDown} />
