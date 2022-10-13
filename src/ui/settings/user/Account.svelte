<script>
import Button from "../../atoms/Button.svelte";
import Avatar from "../../atoms/Avatar.svelte";
let { userId, users } = state;
</script>
<style>
.account {
  background: var(--bg-spaces);
  border-radius: 6px;
  padding: 1em;
  display: flex;
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
  <Avatar user={users.get(userId)} size={72} />
  <div style="margin-left: 1em"></div>
  <div class="details">
    <span class="big">{users.get(userId).name || userId}</span>
    <span>{userId}</span>
  </div>
  <hr />
</div>
<div style="height: 1em"></div>
<hr />
<div style="height: 1em"></div>
<div>
  <Button type="primary" label="Change password" clicked={todo} />
  <div style="height: 1em"></div>
  <Button type="primary" label="Change email" clicked={todo} />
  <div style="height: 1em"></div>
  <Button type="primary" label="Change phone number" clicked={todo} />
  <div style="height: 1em"></div>
  <Button type="danger" label="Disable account" clicked={todo} />
</div>
