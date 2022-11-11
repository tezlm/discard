<script>
import Button from "../../atoms/Button.svelte";
import AvatarUpload from "../../atoms/AvatarUpload.svelte";
let { userId, client } = state;
let user = client.users.get(userId) ?? {};
</script>
<style>
.account {
  display: flex;
  flex-direction: column;
  padding: 1em;
  background: var(--bg-spaces);
  border-radius: 4px;
}

.details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.config {
  background: var(--bg-rooms-members);
  border-radius: 4px;
  padding: 0 16px;
  margin-top: 8px;
}

.config > div {
  display: flex;
  align-items: center;
  margin: 16px 0;
}

.config .info {
  flex: 1;
}

.config .title {
  margin: 0;
}

.big {
  font-size: 1.5em;
  font-weight: bold;
}

.danger {
  margin: 8px 0;
  padding: 16px;
  border: solid var(--color-red) 1px;
  border-radius: 4px;
}
</style>
<div class="account">
  <div style="display: flex; flex-direction: row">
    <AvatarUpload {user} size={72} />
    <div style="margin-left: 1em"></div>
    <div class="details">
      <span class="big">{user.name || userId}</span>
      <span>{userId}</span>
    </div>
  </div>
  <div class="config">
    <!--
    <div>
      <div class="info">
        <h3 class="title">Avatar</h3>
        <div style="color: var(--fg-notice)">idk what to put here</div>
      </div>
      <Button type="small primary" label="Upload" clicked={todo} />
      <Button type="small primary" label="Change" clicked={todo} />
      <Button type="small hollow" label="Remove" clicked={todo} />
    </div>
    -->
    <div>
      <div class="info">
        <h3 class="title">Display Name</h3>
        <div style="color: var(--fg-notice)">{user.name || userId}</div>
      </div>
      <Button type="gray small" label="Edit" clicked={todo} />
    </div>
    <div>
      <div class="info">
        <h3 class="title">Email</h3>
        <div style="color: var(--fg-notice)">todo</div>
      </div>
      <Button type="gray small" label="Edit" clicked={todo} />
    </div>
    <div>
      <div class="info">
        <h3 class="title">Phone Number</h3>
        <div style="color: var(--fg-notice)">todo</div>
      </div>
      <Button type="gray small" label="Edit" clicked={todo} />
    </div>
  </div>
</div>
<div style="height: 1em"></div>
<hr />
<fieldset class="danger">
  <h3>danger zone</h3>
  <div style="height: 1em"></div>
  <Button type="danger" label="Change password" clicked={todo} />
  <Button type="danger" label="Disable account" clicked={todo} />
</fieldset>
<div style="min-height: 64px"></div>
