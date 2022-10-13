<script>
import Tooltip from "../atoms/Tooltip.svelte";
import Avatar from "../atoms/Avatar.svelte";
import { onDestroy } from "svelte";
let { userId, users } = state;
let copyCount = 0, copyText = getCopyText();

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

async function getProfile() {
  if (users.has(userId)) return users.get(userId);
	const { avatar_url, displayname } = await state.api.fetchUser(userId);
	const data = { avatar: avatar_url, name: displayname || userId, id: userId, userId };
	users.set(userId, data);
	return data;
}


let offline = false;
function onStatus(status) {
	offline = status === "reconnecting";
}

state.syncer.on("status", onStatus);
onDestroy(() => state.syncer.off("status", onStatus));
</script>
<style>
.wrapper > div {
	display: flex;
	background: var(--bg-misc);
	padding: 0 8px;
	border-bottom: solid var(--bg-spaces) 1px;
}

.user {
	display: flex;
	align-items: center;
	height: 52px;
}

.user .icon {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 30px;
	width: 30px;
	padding: 6px;
	font-size: 22px;
	color: var(--fg-light);
	cursor: pointer;
	border-radius: 4px;
}

.user .icon:hover {
	color: var(--fg-notice);
	background: #ffffff33;
}

.user .avatar {
	cursor: pointer;
	margin-right: 8px;
}

.offline {
	justify-content: center;
	align-items: center;
	height: 40px;
	font-weight: bold;
	color: var(--color-red);
}

.info {
	flex: 1;
	cursor: pointer;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.displayname, .userid {
	overflow-x: hidden;
	text-overflow: ellipsis;
}

.displayname {
	font-weight: 600;
	font-family: var(--font-display);
	font-size: 0.9em;
	text-overflow: ellipsis;
	line-height: 16px;
}

.userid {
	color: var(--fg-light);
	font-size: 0.8em;
	text-overflow: ellipsis;
	line-height: 14px;
}
</style>
<div class="wrapper">
	{#if !navigator.onLine || offline}
	<div class="offline">Offline!</div>
	{/if}
	{#if false}
	<div class="voice">
		<div class="icon">volume_up</div>
		Connected
		<div class="icon">cancel</div>
	</div>
	{/if}
	<div class="user">
		{#await getProfile()}
			loading
		{:then profile}
		<div class="avatar">
			<Avatar user={profile} size={32} />
		</div>
		<div class="info" on:click={handleCopyClick} on:mouseleave={resetCopy}>
			<Tooltip tip={copyText} color={copyCount > 0 ? "var(--color-green)" : null}>
				<div class="displayname">{profile.name || userId}</div>
				<div class="userid">{userId}</div>
			</Tooltip>
		</div>
		{/await}
		<!--
		<Tooltip tip="User Settings" style="height: 30px">
			<span class="icon" on:click={() => state.scene.set("user-settings")}>mic</span>
		</Tooltip>
		<Tooltip tip="User Settings" style="height: 30px">
			<span class="icon" on:click={() => state.scene.set("user-settings")}>headset</span>
		</Tooltip>
		-->
		<Tooltip tip="User Settings" style="height: 30px">
			<span class="icon" on:click={() => state.scene.set("user-settings")}>settings</span>
		</Tooltip>
	</div>
</div>
