<script>
import Button from "./atoms/Button.svelte";
import Popup from "./atoms/Popup.svelte";
let client = state.client;
let current = state.popup;

function closePopup() {
  state.popup.set({});
}

function quoteName(name) {
  if (name.includes("'")) return `"${name}"`;
  return `'${name}'`;
}
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
</style>
{#if $current.id === "info"}
<Popup>
  <h2 slot="header">{$current.head} <div class="close" on:click={closePopup}>&#xd7;</div></h2>
  <p slot="content">{$current.body}</p>
</Popup>
{:else if $current.id === "leave"}
<Popup>
  <h2 slot="header">Leave {quoteName(client.getRoom($current.room).name)}</h2>
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
    <Button type="danger" label="Leave {$current.type[0].toUpperCase()}{$current.type.slice(1)}" clicked={() => state.popup.set({ id: "todo" })} />
  </div>
</Popup>
{:else if $current.id === "todo"}
<Popup>
  <h2 slot="header">todo <div class="close" on:click={closePopup}>&#xd7;</div></h2>
  <p slot="content">nice, you found a todo popup</p>
</Popup>
{/if}
