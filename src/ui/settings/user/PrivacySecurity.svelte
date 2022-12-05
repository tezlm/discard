<script>
import { formatDate } from "../../../util/format.ts";
import Tooltip from "../../atoms/Tooltip.svelte";
</script>
<style>
h3 {
  font-size: 1.2rem;
  margin-bottom: 1em;
}

.device {
  display: flex;
  border-top: solid var(--color-gray) 1px;
  padding: 6px 0;
}

.big {
  font-size: 1.1rem;
  font-weight: bold;
}

.small {
  font-size: 0.7rem;
}

.dim {
  color: var(--fg-light);
}

button.icon {
  font-size: 22px;
  color: var(--fg-interactive);
  padding: 4px;
}

button.icon:hover {
  color: var(--fg-notice);
}
</style>
<h3>Encryption</h3>
{#if false}
<p>This session is (verified/not verified) (todo)</p>
{:else}
<p>This session doesn't support end-to-end encryption yet</p>
{/if}
<div style="min-height: 16px"></div>
<h3>Sessions</h3>
{#await state.api.fetch("GET", "/devices")}
<p>Loading sessions...</p>
{:then res}
<div class="devices">
{#each res.devices as device (device.device_id)}
<!-- TODO: rename and log out sessions -->
<div class="device">
  <div style="flex: 1">
    <div>
      <span class="big" class:dim={!device.display_name}>{device.display_name}</span>
      {#if device.device_id === localStorage.getItem("deviceid")}
      <span class="small dim">(current)</span>
      {/if}
      <span class="small dim">({device.device_id})</span>
    </div>
    <span class="small">
      <span class="dim">Last seen</span>
      <Tooltip tip={new Date(device.last_seen_ts).toLocaleString()}>
        <time datetime={new Date(device.last_seen_ts).toISOString()}>{formatDate(new Date(device.last_seen_ts))}</time>
      </Tooltip>
      {#if device.last_seen_ip}
      <span class="dim">at</span>
      {device.last_seen_ip}
      {/if}
    </span>
  </div>
  <!--
  <Tooltip tip="Rename"><button class="icon" on:click={todo}>edit</button></Tooltip>
  <Tooltip tip="Logout"><button class="icon" on:click={todo}>delete</button></Tooltip>
  -->
</div>
{/each}
</div>
{:catch}
{#if navigator.onLine}
<p>Failed to load sessions</p>
{:else}
<p>Can't load sessions while offline!</p>
{/if}
{/await}
