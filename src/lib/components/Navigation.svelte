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
  import Logo from '$lib/components/Logo.svelte';
  import { session } from '$app/stores';

  const navigation = [
    {
      href: '/create',
      name: 'Create'
    },
    {
      href: '/consume',
      name: 'Consume'
    },
    {
      href: '/private',
      name: `${$session.user ? "🔓" : "🔒"} Private`
    }
  ];

  async function handleSignOut () {
    await fetch("/api/sign-out");
    window.location = "/sign-in";
  }

  export let user;
</script>

<header>
  <nav class='mx-4'>
    <div class="w-full flex items-center justify-between">
      <div class='grow py-4 flex items-center justify-start'>
        <div class='w-1/12'>
          <Logo small class='w-1' />
        </div>
        <div class='text-gruvlfg dark:text-gruvdfg flex items-center'>
          <div class='ml-10 space-x-8'>
            {#each navigation as link}
              <a href={link.href} class='text-lg font-medium hover:text-gruvlemphblue dark:hover:text-gruvdemphblue'>
                {link.name}
              </a>
            {/each}
          </div>
        </div>
      </div>
      <div class=''>
        {#if $session.user }
          <button
            on:click={handleSignOut}
            class='inline-block bg-indigo-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75'>
            Sign out
          </button>
        {:else}
          <a
            href='/sign-in'
            class='inline-block bg-indigo-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75'
          >
            Sign in
          </a>
          <a
            href='/sign-up'
            class='inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50'
          >
            Sign up
          </a>
        {/if}
      </div>
    </div>
  </nav>
</header>
