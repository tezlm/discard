<script>
import Slider from "./Slider.svelte";
import Volume from "./Volume.svelte";
import { formatSize, formatDuration } from "../../../util/format.js";
import downloadIcon from "../../../assets/icons/download.svg";
export let src;
export let name = "title";
export let size;
let started = false;
let paused = true;
let duration = 1;
let currentTime = 0;
let volume = 1;
let muted = false;
let wrapperEl;
let videoEl;
let fullscreen = false;
let fullShowDebounce = null;

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
  if (document.fullscreenElement) {
    document.exitFullscreen();
    fullscreen = false;
  } else {
    wrapperEl.requestFullscreen();
    fullscreen = true;
  }
}

function handleScrub(selected) {
  if (selected > duration - .5) {
    videoEl.currentTime = videoEl.duration;
    currentTime = duration;
  } else {
    videoEl.currentTime = selected;
    currentTime = selected;
  }
}

function handleMove() {
  clearTimeout(fullShowDebounce);
  fullShowDebounce = setTimeout(() => {
    fullShowDebounce = null;
  }, 500);
}
</script>
<style>
.wrapper {
  display: inline-block;
  position: relative;
  overflow: hidden;
  background: var(--bg-context);

  height: 100%;
  border-radius: 3px;
}

video {
  height: 100%;
  width: 100%;
  object-fit: contain;
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
  background: linear-gradient(0deg,transparent,rgba(0,0,0,.9));
}

.info {
  display: flex;
  flex-direction: column;
}

.info .name {
  font-weight: 500;
  color: var(--fg-content);
}

.info .size {
  color: var(--fg-dim);
  font-weight: 500;
  font-size: .8rem;
}

.size {
  font-size: 14px;
  color: var(--fg-light);
}

.download {
  display: flex;
  margin-left: auto;
  cursor: pointer;
  filter: invert(100%) brightness(.7);
}

.download:hover {
  filter: invert(100%) brightness(.85);
}

.download img {
  height: 28px;
}

.controls {
  bottom: 0;
  display: flex;
  background: rgba(4, 4, 5, .6);
  transform: translateY(100%);
}

.controls .icon {
  padding: 4px;
  font-size: 22px;
  color: var(--fg-interactive);
  cursor: pointer;
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

.wrapper:not(.hide):hover .header,
.header.show {
  transform: translateY(-1px);
}

.wrapper:not(.hide):hover .controls,
.controls.show {
  transform: translateY(1px);
}

.wrapper.hide {
  cursor: none;
}

.overlay {
  position: absolute;
  display: flex;
  align-items: center;
  top: 0;
  justify-content: center;
  height: 100%;
  width: 100%;
  pointer-events: none;
}

.overlay .icon {
  background: var(--bg-context);
  color: var(--fg-content);
  font-size: 36px;
  height: 48px;
  width: 48px;
  border-radius: 50%;
  opacity: .7;
}

.overlay .play {
  cursor: pointer;
  pointer-events: all;
}

.overlay .play:hover {
  opacity: .8;
}

.overlay .appear {
  animation: appear .4s forwards;
}

.time {
  display: flex;
  align-items: center;
  font-family: var(--font-monospace);
  font-size: 12px;
  font-weight: 500;
}

@keyframes appear {
  to {
    opacity: 0;
    transform: scale(1.5);  
  }
}
</style>
<div class="wrapper" class:hide={fullscreen && !paused && !fullShowDebounce} bind:this={wrapperEl} on:mousemove={handleMove}>
  <div class="header" class:show={paused || !started}>
    <div class="info">
      <a class="name" href={src}>{name}</a><br />
      <span class="size">{formatSize(size)}</span>
    </div>
    <a class="download" href={src} download={name}>
      <img src={downloadIcon} alt="download" />
    </a>
  </div>
  <video
    {src}
    alt={name}
    bind:muted={muted}
    bind:volume={volume}
    bind:this={videoEl}
    on:play={handlePlay}
    on:pause={handlePause}
    on:click={togglePlayPause}
    on:timeupdate={handleTime}
    on:loadedmetadata={handleTime}
  />
  <div class="controls" style:visibility={started ? null : "hidden"} class:show={paused}>
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
    <Slider value={currentTime} max={duration} tooltipify={t => formatDuration(Math.floor(t))} changed={handleScrub} />
    <Volume bind:volume={volume} bind:muted={muted} />
    <div class="icon" on:click={toggleFullscreen}>fullscreen</div>
  </div>
  <div class="overlay">
    {#if !started}
    <div class="icon play" on:click={togglePlayPause}>play_arrow</div>
    {:else if paused}
    <div class="icon appear">pause</div>
    {:else}
    <div class="icon appear">play_arrow</div>
    {/if}
  </div>
</div>
