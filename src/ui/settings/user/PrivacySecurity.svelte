<script>
import { formatDate } from "../../../util/format.js";
</script>
<style>
h3 {
  font-size: 1.2rem;
  margin-bottom: 1em;
}

.device {
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
</style>
<h3>Encryption</h3>
{#if false && state.client.isCryptoEnabled()}
<p>This session is (verified/not verified) (todo)</p>
{:else}
<p>This session doesn't support end-to-end encryption</p>
{/if}
<div style="height: 16px"></div>
<h3>Sessions</h3>
{#await state.api.fetch("GET", "/devices")}
<p>Loading sessions...</p>
{:then res}
<div class="devices">
{#each res.devices as device}
<!-- TODO: rename and log out sessions -->
<div class="device">
  <div>
    <span class="big" class:dim={!device.display_name}>{device.display_name}</span>
    <span class="small dim">({device.device_id})</span>
  </div>
  <span class="small">
    <span class="dim">Last seen</span>
    {formatDate(new Date(device.last_seen_ts))}
    <span class="dim">at</span>
    {device.last_seen_ip}
  </span>
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
