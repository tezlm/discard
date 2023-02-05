<script>
import Input from "../atoms/Input.svelte";
import Button from "../atoms/Button.svelte";
import IdInput from "../atoms/IdInput.svelte";
let type = "login";
let localpart, homeserver, password;
let form;
let error;
let loading = false;

async function handleSubmit() {
  for (let input of form.querySelectorAll("input")) {
    if (!input.value) return input.focus();
  }

  loading = true;
  actions.client.login({ localpart, homeserver, password })
    .catch(err => error = err)
    .finally(() => loading = false)
}
</script>
<style>
.wrapper {
  background-color: var(--bg-spaces);
  background-position: top left;
  width: 100%;
}

.card {
  display: flex;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  border-radius: 5px;
  background: var(--bg-content);
  color: var(--fg-content);
  box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
}

.main {
  padding: 32px;
}

.main {
  min-width: 440px;
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
    <div class="main">
      <div class="header">
        <h1>Welcome back!</h1>
        <span>We're so excited to see you again!</span>
      </div>
      <form on:submit|preventDefault={handleSubmit} bind:this={form}>
        <h5 class="title">User Id</h5>
        <IdInput kind="user" bind:localpart={localpart} bind:homeserver={homeserver} />
        <h5 class="title">Password</h5>
        <Input type="password" placeholder="verysecurepassword" bind:value={password} submitted={handleSubmit} />
        <div class="spacer"></div>
        <Button type="primary big" clicked={handleSubmit} label={type === "login" ? (loading ? "Logging in..." : "Login") : "Register"} {loading} />
        {#if error}
        <div class="error">{error}</div>
        {/if}
      </form>
    </div>
  </div>
</div>
