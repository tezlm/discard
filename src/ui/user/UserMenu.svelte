<script>
import { onMount, onDestroy } from 'svelte';
import Tooltip from "../atoms/Tooltip.svelte";
import settingsIcon from "../../assets/icons/settings.svg";
import { getDisplayName, getAvatar } from "../../util/events.js";
let { userId }= state;
let copyCount = 0, copyText = getCopyText(), copyEl;

function getCopyText() {
	switch(copyCount) {
		case 0: return "Click to copy user id";
		case 1: return "Copied!";
		case 2: return "Double Copy!";
		case 3: return "Triple Copy!";
		case 4: return "Dominating!!";
		case 5: return "Rampage!!";
		case 6: return "Mega Copy!!";
		case 7: return "Unstoppable!!";
		case 8: return "Wicked Sick!!";
		case 9: return "Monster Copy!!!";
//		case 10: return "GODLIKE!!!";
//		default: return "BEYOND GODLIKE!!!";
		default: return "good jbo you copied it";
	}
}

function handleCopyClick() {
	navigator.clipboard.writeText(userId);
	copyCount++;
	copyText = getCopyText();
}

function resetCopy() {
	setTimeout(() => {
		copyCount = 0;
		copyText = getCopyText();
	}, 50);
}

onMount(() => copyEl.addEventListener("mouseleave", resetCopy));
onDestroy(() => copyEl.removeEventListener("mouseleave", resetCopy));
</script>
<style>
.user {
	display: flex;
	align-items: center;
	margin-top: auto;
	background: var(--bg-misc);
	width: 100%;
	height: 52px;
	padding: 8px;
}

.user .icon {
	height: 30px;
	width: 30px;
	cursor: pointer;
	padding: 6px;
	border-radius: 4px;
}

.user .icon:hover {
	filter: brightness(2);
	background: #ffffff33;
}

.user .avatar {
	height: 32px;
	width: 32px;
	cursor: pointer;
	border-radius: 50%;
	margin-right: 8px;
}

.offline {
	background: var(--bg-misc);
	color: var(--color-red);
	border-bottom: solid var(--bg-spaces) 1px;
	padding: 8px;
	text-align: center;
	font-weight: bold;
}

.info {
	flex: 1;
	cursor: pointer;
	display: flex;
	flex-direction: column;
}

.displayname {
	font-weight: 600;
	line-height: 1;
	font-family: var(--font-display);
	font-size: 0.9em;
	text-overflow: ellipsis;
}

.userid {
	color: var(--fg-light);
	font-size: 0.8em;
	line-height: 1;
	text-overflow: ellipsis;
}
</style>
{#if !navigator.onLine}
<div class="offline">Offline!</div>
{/if}
<div class="user">
	<img class="avatar" alt="your avatar" src={getAvatar(userId)} />
	<div class="info" on:click={handleCopyClick} bind:this={copyEl}>
		<Tooltip tip={copyText} color={copyCount > 0 ? "#3ba55d" : null}>
			<div class="displayname">{getDisplayName(userId)}</div>
			<div class="userid">{userId}</div>
		</Tooltip>
	</div>
	<Tooltip tip="User Settings" style="height: 30px">
		<img class="icon" alt="settings icon" src={settingsIcon} on:click={() => state.scene.set("user-settings")} />
	</Tooltip>
</div>
