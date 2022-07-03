<script>
import Input from "../atoms/Input.svelte";
import Button from "../atoms/Button.svelte";
import UserId from "../atoms/UserId.svelte";
let type = "login";
let localpart, homeserver, password, error;

function submit() {
  document.forms[0].submit();
}

async function handleSubmit(e) {
  e.preventDefault();
  for (let input of document.querySelectorAll("input")) {
    if (!input.value) return input.focus();
  }

  actions.client.login({ localpart, homeserver, password })
    .catch(err => error = err);
}
</script>
<style>
.wrapper {
  background-color: var(--color-accent);
  width: 100%;
}

.card {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  padding: 32px;
  border-radius: 5px;
  background: var(--bg-content);
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
  color: var(--fg-muted);
  text-transform: uppercase;
}

h5, .spacer {
  margin-top: 1em;
}

.error {
  margin-top: 1em;
  color: var(--color-red);
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
      <Button type="primary big" on:click={submit} label={type === "login" ? "Login" : "Register"} />
      {#if error}
      <div class="error">{error}</div>
      {/if}
    </form>
  </div>
</div>
