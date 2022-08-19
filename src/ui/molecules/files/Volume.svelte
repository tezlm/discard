<svelte:options immutable />
<script>
import Slider from "./Slider.svelte";
export let volume;
export let muted;
let moving = false;
</script>
<style>
.volume {
  position: relative;
}

.volume .slider-wrap {
  visibility: hidden;
  position: absolute;
  height: 130px;
  width: 50px;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.volume .slider {
  position: absolute;
  display: flex;
  visibility: hidden;
  bottom: 45px;
  left: 50%;
  height: 80px;
  border-radius: 8px;
  background: rgba(4, 4, 5, 0.8);
  transform: translate(-50%, 8px);
}

.volume:hover .slider-wrap {
  visibility: visible;
}

.volume.moving .slider {
  visibility: visible;
}

.volume:hover .slider {
  visibility: visible;
}

.icon {
  position: relative;
  padding: 4px;
  font-size: 22px;
  color: var(--fg-interactive);
  cursor: pointer;
  z-index: 1;
}

.icon:hover {
  color: var(--fg-notice);
}

.icon:active {
  transform: translateY(1px);
}
</style>
<div class="volume" class:moving>
  <div class="slider-wrap">
    <div class="slider">
      <Slider value={muted ? 0 : volume} max={1} changed={(v) => { muted = false; volume = v }} bind:moving={moving} vertical />
    </div>
  </div>
  <div class="icon" on:click={() => muted = !muted}>
    {#if muted}
    volume_off
    {:else if volume >= .5}
    volume_up
    {:else}
    volume_down
    {/if}
  </div>
</div>

