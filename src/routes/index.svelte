<script context="module">
  export async function load({ session }) {
    return {
      props: {
        user: session.user || ''
      }
    };
  }
</script>

<script>
  import '../app.css';
  export let user;
</script>

<div class="w-screen p-2">
  <h1>Welcome {user}</h1>

  <div>
    {#if user}
      <a rel="external" href="/logout">
        <button class="bg-slate-200">Logout</button>
      </a>
    {:else}
      <a rel="external" href="/login">
        <button class="bg-slate-200">Github Login</button>
      </a>
    {/if}
  </div>
  <div class="flex">
    <div class="basis-1/4"></div>
      <div class="basis-1/2">
        <img src="/miro-logo-2020-15.svg" alt="miro logo circle with wings,
          showing woodworking tools and electronic components" />
      </div>
    <div class="basis-1/4"></div>
  </div>
</div>
