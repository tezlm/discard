<script>
export let tab;
const goto = (where) => () => actions.to(`/user-settings/help/${where}`);
</script>
<style>
h1 {
  margin-bottom: 1em;
  font: 20px var(--font-display);
  font-weight: 500;
}

a {
  cursor: pointer;
}
</style>
{#if tab}
<a style:padding-bottom="8px" on:mousedown|preventDefault={goto("")} on:keydown|preventDefault={goto("")}>Back</a>
{#if tab === "start"}
  <!-- a quick tutorial on how to use discard/matrix -->
  <h1>Welcome to discard!</h1>
  <p>todo: explain what it is, maybe simple high level overview of matrix</p>
  <p>todo: explain the critical parts of the ui</p>
{:else if tab === "usage"}
  <!-- an in-depth explination on how to do things -->
  <!-- maybe don't have this and have an explination on how to use each major component? (composer, spaces, rooms, timeline) -->
  <h1>Usage</h1>
  <p>todo: explain how to create rooms</p>
  <p>send/accept/reject invites</p>
  <p>todo: explain how to use spaces (maybe have its own tab?)</p>
  <p>todo: send message, attachments, markddown</p>
{:else if tab === "moderation"}
  <!-- explain how the power level system works and how to moderate -->
  <h1>Moderation</h1>
  <p>todo: explain how power levels work. each thing has a minimum required power level, each person has a power level, a person can do something if they have enough power</p>
  <p>todo: explain how to redact messages</p>
  <p>todo: explain how to kick/ban people and the difference, also unban</p>
  <p>todo: explain join rules. invite only, public, restricted</p>
{:else if tab === "keybinds"}
  <!-- just a list of every keybind -->
  <h1>Keybinds</h1>
  <table>
    <tr><th>keybind</th>                <th>where</th>         <th>what it does</th></tr>
    <tr><td><kbd>Ctrl + k</kbd></td>    <td>anywhere</td>      <td>open quick switcher</td></tr>
    <tr><td><kbd>Ctrl + /</kbd></td>    <td>anywhere</td>      <td>show keybinds</td></tr>
    <tr><td><kbd>Up</kbd></td>          <td>in the editor</td> <td>edit previous message</td></tr>
    <tr><td><kbd>Down</kbd></td>        <td>in the editor</td> <td>edit next message</td></tr>
    <tr><td><kbd>Ctrl + b</kbd></td>    <td>in the editor</td> <td>bold text</td></tr>
    <tr><td><kbd>Ctrl + i</kbd></td>    <td>in the editor</td> <td>italic text</td></tr>
    <tr><td><kbd>Alt + Up</kbd></td>    <td>in a chat</td>     <td>view previous room</td></tr>
    <tr><td><kbd>Alt + Down</kbd></td>  <td>in a chat</td>     <td>view next room</td></tr>
    <tr><td><kbd>Esc</kbd></td>         <td>in a room</td>     <td>mark room as read</td></tr>
    <tr><td><kbd>Shift + Esc</kbd></td> <td>in a space</td>    <td>mark space as read</td></tr>
    <tr><td><kbd>PgUp</kbd></td>        <td>in a room</td>     <td>scroll up</td></tr>
    <tr><td><kbd>PgDown</kbd></td>      <td>in a room</td>     <td>scroll down</td></tr>
  </table>
  <h3 style="margin-top: 16px; margin-bottom: 8px">Planned</h3>
  <table>
    <tr><td><kbd>Shift + PgUp</kbd></td>     <td>in a room</td>            <td>scroll to unread</td></tr>
    <tr><td><kbd>Shift + PgDown</kbd></td>   <td>in a room</td>            <td>scroll to end of chat</td></tr>
    <tr><td><kbd>Esc</kbd></td>              <td>in a room</td>            <td>scroll to end of chat</td></tr>
    <tr><td><kbd>Ctrl + P</kbd></td>         <td>in a room</td>            <td>open pins popout</td></tr>
    <tr><td><kbd>Ctrl + [unknown]</kbd></td> <td>anywhere</td>             <td>open inbox - discord uses ctrl-i but italics</td></tr>
    <tr><td><kbd>Ctrl + [unknown]</kbd></td> <td>anywhere</td>             <td>toggle members- discord uses ctrl-u but is this necessary?</td></tr>
    <tr><td><kbd>Ctrl + [unknown]</kbd></td> <td>open inbox</td>           <td>open pins popout</td></tr>
    <tr><td><kbd>*</kbd></td>                <td>focused on a message</td> <td>the message commands (e: edit, del/backspace: delete, r: reply, +: react, p: pin, alt+enter: mark unread)</td></tr>
    <tr><td><kbd>*</kbd></td>                <td>misc</td>                 <td>yeah just copy the other discord shortcuts if they make sense</td></tr>
  </table>
{/if}
{:else}
<h1>Help</h1>
<p>todo for v1</p>
<ul>
  <li>differences from discord</li>
  <li><a on:mousedown|preventDefault={goto("start")} on:keydown|preventDefault={goto("start")}>how to use for total beginners</a></li>
  <li><a on:mousedown|preventDefault={goto("usage")} on:keydown|preventDefault={goto("usage")}>usage</a></li>
  <li><a on:mousedown|preventDefault={goto("keybinds")} on:keydown|preventDefault={goto("keybinds")}>keybinds</a></li>
  <li><a on:mousedown|preventDefault={goto("moderation")} on:keydown|preventDefault={goto("moderation")}>moderation/power levels</a></li>
  <li>where each setting is</li>
</ul>
<p>if i forget to do this then sorry, go check out the <a href="https://matrix.org/docs/guides/introduction">matrix docs</a> for now</p>
{/if}
