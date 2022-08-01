<script>
import { formatDuration } from "../../util/format";
export let src;
export let name = "yes";
let started = false;
let paused = true;
let duration = 0;
let currentTime = 0;

function handlePlay() {
  started = true;
  paused = false;
}

function handlePause() {
  paused = true;
}

function handleClick() {
  if (paused) {
    this.play();
  } else {
    this.pause();
  }
}

function handleTime() {
  duration = this.duration;
  currentTime = this.currentTime;
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
  padding: 8px;
  background: rgba(4, 4, 5, .6);
  transform: translateY(100%);
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
<div class="wrapper">
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
    on:play={handlePlay}
    on:pause={handlePause}
    on:click={handleClick}
    on:timeupdate={handleTime}
  />
  <div class="controls" style:visibility={started ? null : "hidden"} class:show={paused}>
    <div class="icon">play_arrow</div>
    <div class="icon">pause</div>
    <div class="icon">replay</div>
    <div class="time">{formatDuration(Math.floor(currentTime))}/{formatDuration(Math.floor(duration))}</div>
    <div class="bar">
      <div class="progress" style:width={(currentTime / duration) + "%"}></div>
    </div>
  </div>
  <div class="overlay">
    <div class="icon">play_circle_filled</div>
  </div>
</div>
