<script>
import Popup from "../atoms/Popup.svelte";
import roomNormalIcon from "../../assets/icons/room-normal.svg";
let room = state.focusedRoom;
$: topic = $room.currentState.getStateEvents("m.room.topic")[0]?.getContent().topic;

let showTopicPopup = false;
</script>
<style>
.header {
  display: flex;
  align-items: center;
  padding: 8px 1rem;
  height: 48px;
  box-shadow: 0 1px 0 rgba(4, 4, 5, 0.2),
    0 1.5px 0 rgba(6, 6, 7, 0.05),
    0 2px 0 rgba(4, 4, 5, 0.05);
}

.big {
  font-weight: bold;
  font-size: 18px;
  font-family: var(--font-display);
}

.spacer {
  width: 1px;
  background: var(--color-gray);
  height: 1.5em;
  margin: 8px;
}

.topic {
  cursor: pointer;
}

.icon {
  margin-right: 6px;
  width: 24px;
  height: 24px;
  background-color: var(--fg-dim);
}
</style>
<div class="header">
  <span class="icon" style="mask-image: url({roomNormalIcon})" />
  <span class="big">{$room.name}</span>
  {#if topic}
  <div class="spacer"></div>
  <div class="topic" on:click={() => showTopicPopup = true}>{topic}</div>
  <Popup bind:show={showTopicPopup} title={$room.name}>{topic}</Popup>
  {/if}
</div>
