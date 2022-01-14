<script>
  import BigLogo from './miro-logo-2020-15.svg';
  import SmallLogo from './miro-logo-2020-15-reduced-wo-wings.svg';
  export let small;
</script>

{#if small}
  <!-- <SmallLogo viewBox="0 0 510 510" class="logo dark:logodark" /> -->
  <SmallLogo class="logo dark:logodark" />
{:else}
  <!-- <BigLogo viewBox="0 0 1204 504" class="logo dark:logodark" /> -->
  <BigLogo class="logo dark:logodark" />
{/if}
