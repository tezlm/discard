<script>
// TODO: this looks horrible, add styling and stuff later
</script>
{build.package.name} version {build.package.version}, commit <a href="https://git.celery.eu.org/tezlm/discard/commit/{build.commit}">{build.commit}</a>
<br>
<br>
made with the following dependencies:
<ul>
  {#each Object.entries(build.package.dependencies) as [pkg, ver]}
  <li><a href="https://npmjs.com/package/{pkg}">{pkg}</a> version {ver.replace(/^\^/, "")}</li>
  {/each}
</ul>
<br>
along with the following, for development:
<ul>
  {#each Object.entries(build.package.devDependencies) as [pkg, ver]}
  <li><a href="https://npmjs.com/package/{pkg}">{pkg}</a> version {ver.replace(/^\^/, "")}</li>
  {/each}
</ul>

