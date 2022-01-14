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
  import Logo from '$lib/components/logo.svelte';
  export let user;
</script>

<div class="w-screen p-2">
  <div class="flex">
    <div class="basis-6/12"></div>
      <div class="basis-1/12">
         <Logo small />
      </div>
    <div class="basis-6/12"></div>
  </div>
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
    <div class="basis-1/3"></div>
      <div class="basis-1/3">
         <Logo />
      </div>
    <div class="basis-1/3"></div>
  </div>
</div>
