<script>
import { getAvatar, getDisplayName } from '../../../util/events.js';
let { userId }= state;
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
  <img src={getAvatar(userId)} alt="your avatar" />
  <div class="details">
    <span class="big">{getDisplayName(userId)}</span>
    <span>{userId}</span>
  </div>
</div>
<!-- TODO: change password
<br>
<Button type="primary" label="Change password" /> -->
