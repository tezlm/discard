<script>
export let type = "normal";
export let label = "button";
export let clicked = () => {};
</script>
<style>
button {
  position: relative;
  font: inherit;
  border-radius: 3px;
  border: none;
  color: var(--fg-notice);
  cursor: pointer;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  transition: all 170ms;
}

.big {
  font-size: 16px;
  padding: 10px;
  width: 100%;
  height: 40px;
}

.normal {
  background: var(--bg-misc);
}

.primary {
  background: var(--color-accent);
}

.danger {
  background: var(--color-red);
}

.link {
  background: transparent;
}

.hollow {
  background: transparent;
  border: solid var(--button-outline) 1px;
}

button::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 3px;
  background: #00000000;
  transition: all 170ms;
}

button:hover::after {
  background: #00000033;
}

.hollow:hover::after, .link:hover::after {
  background: none;
}

.link:hover {
  text-decoration: underline;
}

.hollow:hover {
  background: var(--button-outline);
}
</style>
<button class={type} on:click={clicked}>{label}</button>
