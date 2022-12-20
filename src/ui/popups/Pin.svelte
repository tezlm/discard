<script>
import Popup from "../atoms/Popup.svelte";
import Button from "../atoms/Button.svelte";
import Event from "../room/timeline/Event.svelte";
export let current;
let { popup } = state;
let { event } = current;

function close() {
  $popup = { ...$popup, id: null };
}

export function confirm() {
  const events = event.room.getState("m.room.pinned_events")?.content.pinned ?? [];
  event.room.sendState("m.room.pinned_events", { pinned: [event.id, ...events] });
  close();
}
</script>
<style>
.tip {
  color: var(--fg-dim);
  font-size: 14px;
  text-align: center;
  margin-top: 16px;
}

.event {
  padding: 8px 0;
  border: solid var(--bg-misc) 1px;
  border-radius: 4px;
  box-shadow: var(--shadow-popup)
}
</style>
<Popup>
  <h2 slot="header">Pin {event.type === "m.room.message" ? "Message" : "Event"}?</h2>
  <div slot="content" style="max-width: 440px">
    <div style="margin-bottom: 16px;">Do you really want to pin this {event.type === "m.room.message" ? "message" : "event"}?</div>
    <div class="event">
      <Event noInteract header {event} />
    </div>
    <div class="tip">(hold shift to bypass this dialog)</div>
  </div>
  <div slot="footer">
    <Button type="link" label="Nevermind" on:click={close} />
    <Button type="primary" label="Yeah!" on:click={confirm} />
  </div>
</Popup>
