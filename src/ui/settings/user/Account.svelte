<script>
import Button from "../../atoms/Button.svelte";
import { parseMxc, defaultAvatar } from "../../../util/content.js";
let { userId, users } = state;
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
  <img src={parseMxc(users.get(userId).avatar) ?? defaultAvatar} alt="your avatar" />
  <div class="details">
    <span class="big">{users.get(userId).name}</span>
    <span>{userId}</span>
  </div>
</div>
<br><br>
<Button type="primary" label="Change password" clicked={todo} /><br><br>
<Button type="primary" label="Change email" clicked={todo} /><br><br>
<Button type="primary" label="Change phone number" clicked={todo} /><br><br>
<Button type="danger" label="Disable account" clicked={todo} /><br><br>
