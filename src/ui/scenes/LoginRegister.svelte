<script>
import Input from "../parts/Input.svelte";
import Button from "../parts/Button.svelte";
import UserId from "../parts/UserId.svelte";
let type = "login";
let localpart, homeserver, password;

function submit() {
  document.forms[0].submit();
}

function handleSubmit(e) {
  e.preventDefault();
  for (let input of document.querySelectorAll("input")) {
    if (!input.value) return input.focus();
  }
  console.log(localpart)
  console.log(homeserver)
  console.log(password)
  console.log("submit")
}
</script>
<style>
.wrapper {
  background-color: #7289da;
  width: 100%;
}

.card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  padding: 32px;
  border-radius: 5px;
  background: #36393f;
  color: var(--fg-content);
  box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
}

.header {
  text-align: center;
  margin-bottom: 1em;
}

h5 {
  font-family: var(--font-display);
  font-weight: 500;
  color: #b9bbbe;
  text-transform: uppercase;
}

h5, .spacer {
  margin-top: 1em;
}
</style>

<div class="wrapper">
  <div class="card">
    <div class="header">
      <h1>Welcome back!</h1>
      <span>We're so excited to see you again!</span>
    </div>
    <form on:submit={handleSubmit}>
      <h5>User Id</h5>
      <UserId bind:localpart={localpart} bind:homeserver={homeserver} />
      <h5>Password</h5>
      <Input type="password" bind:value={password} />
      <div class="spacer"></div>
      <Button type="primary" on:click={submit} label={type === "login" ? "Login" : "Register"} />
    </form>
  </div>
</div>
