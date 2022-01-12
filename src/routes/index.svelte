<script context="module">
  export async function load({ session }) {
    return {
      props: {
        user: session.user
      }
    };
  }
</script>

<script>
  export let user;
</script>

<h1>Welcome {user}</h1>
{#if user}
  <a href="/logout">
    <button>Logout</button>
  </a>
{:else}
  <a href="/login">
    <button>Github Login</button>
  </a>
{/if}
