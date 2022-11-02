<script>
import Popup from "../atoms/Popup.svelte";
import Button from "../atoms/Button.svelte";
export let current;
let { popup } = state;

function close() {
  $popup = { ...$popup, id: null };
}

function cancel() {
  current.cancel?.();
  close();
}

export function confirm() {
  current.clicked?.();
  close();
}
</script>
<Popup>
  <h2 slot="header">{current.title}</h2>
  <div slot="content" style="max-width: 440px">
    {#if current.html}
      {@html current.html}
    {:else}
      {current.body}
    {/if}
  </div>
  <div slot="footer">
    {#if current.button}
      <Button type="link" label="Nevermind" clicked={cancel} />
      <Button type={current.danger ? "danger" : "primary"} label={current.button} clicked={confirm} />
    {:else}
      <Button type="primary" label="Alright" clicked={confirm} />
    {/if}
  </div>
</Popup>
