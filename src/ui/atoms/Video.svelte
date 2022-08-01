<script>
import { formatDuration } from "../../util/format";
export let src;
export let name = "title";
let started = false;
let paused = true;
let duration = 0;
let currentTime = 0;
let wrapperEl;
let videoEl;

function handlePlay() {
  started = true;
  paused = false;
}

function handlePause() {
  paused = true;
}

function handleTime() {
  duration = this.duration;
  currentTime = this.currentTime;
}

function togglePlayPause() {
  if (paused) {
    videoEl.play();
  } else {
    videoEl.pause();
  }
}

function toggleFullscreen() {
  if (document.fullscreen) {
    document.exitFullscreen();
  } else {
    wrapperEl.requestFullscreen();
  }
}
</script>
<style>
.wrapper {
  display: inline-block;
  position: relative;
  overflow: hidden;
  background: var(--bg-spaces);

  height: 300px;
  border-radius: 3px;
}

video {
  width: 100%;
  height: 100%;
}

.header, .controls {  
  position: absolute;
  width: 100%;
  transition: transform .2s;
}

.header {
  top: 0;
  display: flex;
  padding: 16px;
  transform: translateY(-100%);
  background: linear-gradient(rgba(4, 4, 5, .8), transparent);
}

.name {
  font-weight: 500;
}

.size {
  font-size: 14px;
  color: var(--fg-light);
}

.download {
  margin-left: auto;
  font-size: 36px;
}

.download a {
  color: var(--fg-interactive);
  text-decoration: none;
}

.download a:hover {
  color: var(--fg-notice);
}

.controls {
  bottom: 0;
  display: flex;
  align-items: center;
  background: rgba(4, 4, 5, .6);
  transform: translateY(100%);
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
  transform: translateY(1px);
}

.controls .playpause {
  margin-right: 8px;
}

.controls .bar {
  flex: 1;
  height: 6px;
  background: var(--color-gray-light);
  margin: 0 8px;
  border-radius: 6px;
}

.controls .bar .progress {
  background: var(--color-accent);
  border-radius: 8px;
  height: 6px;
}

.wrapper:hover .header,
.wrapper:hover .controls,
.header.show,
.controls.show {
  transform: translateY(0);
}

.overlay {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.time {
  font-family: var(--font-monospace);
  font-size: 12px;
  font-weight: 500;
}
</style>
<div class="wrapper" bind:this={wrapperEl}>
  <div class="header" class:show={paused || !started}>
    <div>
      <div class="name">{name}</div>
      <div class="size">??? MB</div>
    </div>
    <div class="download icon">
      <a href={src} download={name}>file_download</a>
    </div>
  </div>
  <video
    {src}
    muted
    bind:this={videoEl}
    on:play={handlePlay}
    on:pause={handlePause}
    on:click={togglePlayPause}
    on:timeupdate={handleTime}
  />
  <div class="controls" style:visibility={started ? null : "hidden"} class:show={paused}>
    <div class="icon playpause" on:click={togglePlayPause}>
      {#if currentTime === duration}
      replay
      {:else if paused}
      play_arrow
      {:else}
      pause
      {/if}
    </div>
    <div class="time">{formatDuration(Math.floor(currentTime))}/{formatDuration(Math.floor(duration))}</div>
    <div class="bar">
      <div class="progress" style:width={(currentTime * 100 / duration) + "%"}></div>
    </div>
    <div class="icon">volume_up</div>
    <div class="icon">volume_down</div>
    <div class="icon">volume_off</div>
    <div class="icon" on:click={toggleFullscreen}>fullscreen</div>
  </div>
  <div class="overlay">
    <div class="icon">play_circle_filled</div>
  </div>
</div>
