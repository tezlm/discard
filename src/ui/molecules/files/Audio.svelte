<script>
import File from "./File.svelte";
import Slider from "./Slider.svelte";
import Volume from "./Volume.svelte";
import { formatDuration } from "../../../util/format.js";
export let src;
export let name = "title";
export let size = 0;
let audioEl;
let duration = 1;
let currentTime = 0;
let paused = true;
let muted = false;
let volume = 1;

function togglePlayPause() {
  if (paused) {
    audioEl.play();
  } else {
    audioEl.pause();
  }
}

function handleTime() {
  duration = this.duration;
  currentTime = this.currentTime;
}

function handleScrub(t) {
  audioEl.currentTime = t;
  currentTime = t;
}
</script>
<style>
.controls {
  margin-top: .5rem;
  display: flex;
  background: rgba(4, 4, 5, .6);
  border-radius: 3px;
}

.controls .icon {
  padding: 4px;
  font-size: 22px;
  color: var(--fg-interactive);
}

.controls .icon:hover {
  color: var(--fg-notice);
}

.controls .icon:active {
  transform: translateY(2px);
}

.controls .playpause {
  margin-right: 8px;
}

.time {
  display: flex;
  align-items: center;
  font-family: var(--font-monospace);
  font-size: 12px;
  font-weight: 500;
}
</style>
<File {name} {size} {src}>
  <div class="controls">
    <div class="icon playpause" on:click={togglePlayPause}>
      {#if currentTime > duration - .05}
      replay
      {:else if paused}
      play_arrow
      {:else}
      pause
      {/if}
    </div>
    <div class="time">{formatDuration(Math.floor(currentTime))}/{formatDuration(Math.floor(duration))}</div>
    <div style="min-width: 150px; display: flex;">
      <Slider value={currentTime} max={duration} changed={handleScrub} />
    </div>
    <Volume bind:volume={volume} bind:muted={muted} />
  </div>
  <audio
    {src}
    alt={name}
    bind:muted={muted}
    bind:volume={volume}
    bind:this={audioEl}
    on:play={() => paused = false}
    on:pause={() => paused = true}
    on:timeupdate={handleTime}
    on:loadedmetadata={handleTime}
  />
</File>
