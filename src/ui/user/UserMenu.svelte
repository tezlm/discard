<script>
import Loading from "../atoms/Loading.svelte";
import Tooltip from "../atoms/Tooltip.svelte";
import Avatar from "../atoms/Avatar.svelte";
import { homeContext } from "../../util/context.ts";
import { fastclick } from "../../util/use.ts";
import { onDestroy } from "svelte";
let { userId, context } = state;
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
	const fetched = await state.client.users.fetch(userId);
	return fetched ?? {};
}


let offline = state.client.status === "reconnecting";
function onStatus(status) {
	offline = status === "reconnecting";
}

state.client.on("status", onStatus);
onDestroy(() => state.client?.off("status", onStatus));
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

.user .icon:hover,
.user .icon:focus {
	color: var(--fg-notice);
	background: #ffffff33;
}

.user .icon:focus {
  outline: solid var(--color-accent) 3px;
}

.user .avatar {
	cursor: pointer;
	margin-right: 8px;
}

.offline {
	align-items: center;
	height: 40px;
	font-weight: 500;
	color: var(--color-red);
}

.offline::after {
	animation: dots infinite 1s;
	content: "";
}

.online {
	align-items: center;
	height: 40px;
	font-weight: 500;
	color: var(--color-green);
	animation: fadeout .5s 1s both;
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
}

.userid {
	color: var(--fg-light);
	font-size: 0.8em;
	text-overflow: ellipsis;
	line-height: 14px;
}

@keyframes dots {
 0% { content: "" }
 33% { content: "." }
 67% { content: ".." }
 100% { content: "..." }
}

@keyframes fadeout {
	0% { opacity: 1 }
	99% { opacity: 0; height: 40px }
	100% { opacity: 0; height: 0 }
}
</style>
<div class="wrapper">
	{#if offline}
	<div class="offline">
	reconnecting
	</div>
	{:else if false}
	<div class="online">
	connected!
	</div>
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
		<div style="flex: 1">
			loading
		</div>
		{:then profile}
		<div class="avatar">
			<Avatar user={profile} size={32} />
		</div>
		<div class="info" on:click={handleCopyClick} on:mouseleave={resetCopy}>
			<Tooltip tip={copyText} color={copyCount > 0 ? "var(--color-green)" : null}>
				<div class="displayname" tabindex="-1">{profile.name || userId}</div>
				<div class="userid" tabindex="-1">{userId}</div>
			</Tooltip>
		</div>
		{/await}
		<Tooltip tip="User Settings" style="height: 30px">
			<button
				class="icon"
				use:fastclick 
				on:fastclick={() => actions.to("/user-settings")}
				on:contextmenu|preventDefault|stopPropagation={e => $context = { items: homeContext(), x: e.clientX, y: e.clientY }}
				tabindex="0"
			>settings</button>
		</Tooltip>
	</div>
</div>
