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
      // },
      // {
      //   href: '/private',
      //   name: `${$session.user ? "🔓" : "🔒"}`
    }
  ];

  async function handleSignOut () {
    await fetch("/api/sign-out");
    window.location = "/sign-in";
  }
</script>

<header>
<nav class='mx-2 md:mx-4 lg:mx-8'>
    <div class="w-full flex items-center justify-between">
      <div class='grow py-2 xs:py-4 flex items-center justify-start'>
        <div class='w-8 xs:w-16'>
          <Logo small class='w-1' />
        </div>
        <div class='text-gruvlfg dark:text-gruvdfg flex items-center'>
          <div class='mx-4 md:mx-8 lg:mx-12 space-x-2 xs:space-x-4 md:space-x-8'>
            {#each navigation as link}
              <a href={link.href} class='text-lg font-medium hover:text-gruvlemphblue dark:hover:text-gruvdemphblue'>
                {link.name}
              </a>
            {/each}
          </div>
        </div>
      </div>
      <div class='w-max'>
        {#if $session.user }
          <button on:click={handleSignOut} class='inline-block bg-indigo-500 py-1 xs:py-2 px-2 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75'>
            Sign out
          </button>
        {:else}
          <a rel='external' href='/login' class='inline-block bg-indigo-500 py-1 xs:py-2 px-2 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75' >
            Sign in
          </a>
        {/if}
      </div>
    </div>
  </nav>
</header>
