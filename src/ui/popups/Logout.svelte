<script>
import Popup from "../atoms/Popup.svelte";
import Button from "../atoms/Button.svelte";
</script>
<Popup>
  <h2 slot="header">Log Out</h2>
  <p slot="content">Are you sure you want to logout?</p>
  <div slot="footer">
    <Button type="link" label="Nevermind" clicked={() => state.popup.set({})} />
    <Button type="danger" label="Log Out" clicked={actions.client.logout} />
  </div>
</Popup>
