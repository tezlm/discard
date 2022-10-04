<script>
// TODO: this looks horrible, add styling and stuff later
const env = discardEnv;
</script>
<div>
  {env.package.name} version {env.package.version}, commit <a href="https://git.celery.eu.org/tezlm/discard/commit/{env.commit}">{env.commit}</a>
  <br>
  <br>
  made with the following dependencies:
  <ul>
    {#each Object.entries(env.package.dependencies) as [pkg, ver]}
    <li><a href="https://npmjs.com/package/{pkg}">{pkg}</a> version {ver.replace(/^\^/, "")}</li>
    {/each}
  </ul>
  <br>
  along with the following, for development:
  <ul>
    {#each Object.entries(env.package.devDependencies) as [pkg, ver]}
    <li><a href="https://npmjs.com/package/{pkg}">{pkg}</a> version {ver.replace(/^\^/, "")}</li>
    {/each}
  </ul>
</div>
