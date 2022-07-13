<script>
import { getAvatar, getDisplayName } from '../../../util/events.js';
let userid = state.client.userId;
</script>
<style>
.account {
  background: var(--bg-spaces);
  border-radius: 6px;
  padding: 1em;
  display: flex;
}

.account > img {
  border-radius: 50%;
  height: 72px;
  width: 72px;
  margin-right: 1em;
}

.account > .details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.big {
  font-size: 1.5em;
  font-weight: bold;
}
</style>
<div class="account">
  <img src={getAvatar(state.client.userId)} alt="your avatar" />
  <div class="details">
    <span class="big">{getDisplayName(state.client.userId)}</span>
    <span>{userid}</span>
  </div>
</div>
<!-- TODO: change password
<br>
<Button type="primary" label="Change password" /> -->
