<script>
import Tooltip from "../atoms/Tooltip.svelte";
import { parseMxc, defaultAvatar } from '../../util/content.js';
let { userId, users } = state;
let copyCount = 0, copyText = getCopyText();

let missingAvs = state.missingAvatars;

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
	const data = { avatar: avatar_url, name: displayname || userId, userId };
	users.set(userId, data);
	return data;
}
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
	{#await getProfile()}
		loading
	{:then profile}
	<img
		class="avatar"
		alt="your avatar"
		src={missingAvs.has(userId) ? defaultAvatar : parseMxc(profile.avatar, 30) ?? defaultAvatar}
    on:error={(e) => { missingAvs.add(userId); e.target.src = defaultAvatar }}
	/>
	<div class="info" on:click={handleCopyClick} on:mouseleave={resetCopy}>
		<Tooltip tip={copyText} color={copyCount > 0 ? "var(--color-green)" : null}>
			<div class="displayname">{profile.name}</div>
			<div class="userid">{userId}</div>
		</Tooltip>
	</div>
	{/await}
	<Tooltip tip="User Settings" style="height: 30px">
		<span class="icon" on:click={() => state.scene.set("user-settings")}>settings</span>
	</Tooltip>
</div>
