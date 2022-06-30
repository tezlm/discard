<script>
import settingsIcon from "../assets/icons/settings.svg";
import { getAvatar } from "../util/events.js";
</script>
<style>
.user {
	display: flex;
	align-items: center;
	margin-top: auto;
	background: var(--bg-spaces);
	width: 100%;
	height: 52px;
	padding: 8px;
}

.user .icon {
	height: 28px;
	width: 28px;
	cursor: pointer;
	padding: 6px;
	border-radius: 3px;
}

.user .icon:not(.avatar):hover {
	filter: brightness(2);
	background: #ffffff33;
}

.user .avatar {
	height: 48px;
	width: 48px;
	border-radius: 50%;
	margin-right: auto;
}
</style>
<div class="user">
	<img class="icon avatar" src={getAvatar(state.client.getUserId())} />
	<img class="icon" src={settingsIcon} on:click={() => state.scene.set("settings")} />
</div>
