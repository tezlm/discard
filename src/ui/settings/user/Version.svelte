<script>
// TODO: this looks horrible, add styling and stuff later
const env = DISCARD;
</script>
<div>
  {env.package.name} version {env.package.version}, commit <a href="https://git.celery.eu.org/tezlm/discard/commit/{env.commit}">{env.commit}</a>
  <br>
  <div style="margin: 1em 0">made with the following dependencies:</div>
  <table>
    <tr><th>name</th><th>version</th></tr>
    {#each Object.entries(env.package.dependencies) as [pkg, ver]}
    <tr><td><a href="https://npmjs.com/package/{pkg}">{pkg}</a></td><td>{ver.replace(/^\^/, "")}</td></tr>
    {/each}
  </table>
  <div style="margin: 1em 0">along with the following, for development:</div>
  <table>
    <tr><th>name</th><th>version</th></tr>
    {#each Object.entries(env.package.devDependencies) as [pkg, ver]}
    <tr><td><a href="https://npmjs.com/package/{pkg}">{pkg}</a></td><td>{ver.replace(/^\^/, "")}</td></tr>
    {/each}
  </table>
  <div style="margin: 3em 0"></div>
</div>
