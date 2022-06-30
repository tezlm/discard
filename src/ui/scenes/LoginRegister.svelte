<script>
import Input from "../parts/Input.svelte";
import Button from "../parts/Button.svelte";
import UserId from "../parts/UserId.svelte";
let type = "login";
</script>
<style>
.wrapper {
  background-color: #5865f2;
  /* background-image: url(https://celery.eu.org/public/wallpapers/city4.jpg?v=0001); */
  /* background-size: cover; */
  width: 100%;
}

.card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  padding: 10px;
  border-radius: 5px;
  background: #36393f;
  color: var(--fg-content);
  box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
}

h5 {
  font-family: var(--font-display);
  font-weight: 500;
  color: #b9bbbe;
  text-transform: uppercase;
  margin-top: 1em;
}
</style>

<div class="wrapper">
  <div class="card">
    <h1>{type === "login" ? "welcome back" : "register"}</h1>
    <form>
      <h5>User Id</h5>
      <UserId />
      <h5>Password</h5>
      <Input type="password" />
      <Button type="primary" label={type === "login" ? "Login" : "Register"} />
    </form>
  </div>
</div>
