<script>
  import { formatISO } from 'date-fns'
  export let cardData
  cardData.displayDate = formatISO(cardData.creationDate, { representation: 'date' });
</script>

<div class="max-w-sm lg:max-w-xl w-full flex flex-col lg:flex-row">
  <div class="min-h-max lg:h-auto lg:w-64 flex bg-gruvlbg dark:bg-gruvdbg lg:flex-col justify-center border-l border-t border-r lg:border-r-0 border-gruvlfg dark:border-gruvdfg lg:border-b rounded-t lg:rounded-t-none lg:rounded-l">
    <div class="mx-4 h-60 w-60 flex-none bg-contain bg-no-repeat bg-center text-center overflow-hidden"
         style="background-image: url({cardData.thumbnailUrl});" title={cardData.thumbnailTitle}>
    </div>
  </div>
  <div class="border-r border-b border-l border-gruvlfg dark:border-gruvdfg lg:border-l-0 lg:border-t bg-gruvlbg dark:bg-gruvdbg rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
    <div class="mb-3">
      <div class="text-gruvlemphblue dark:text-gruvblue font-bold text-xl mb-2">{cardData.title}</div>
      <p class="text-gruvlfg dark:text-gruvdfg text-base mb-2">{cardData.description}</p>
      <div class="text-sm text-gruvlpurple dark:text-gruvpurple flex flex-wrap items-center">
        {#each cardData.tags as tag}
          <!-- <span class="inline-flex mb-2 items-center bg-gruvlemphpurple dark:bg-gruvdemphpurple rounded-full px-3 py-0 text-sm font-semibold text-gruvlfg dark:gruvdfg mr-2"> -->
          <span class="inline-flex mb-2 items-center border border-gruvlemphpurple dark:border-gruvlemphpurple rounded-full px-3 py-0 text-sm font-semibold text-gruvlemphpurple dark:gruvpurple mr-2">
            {#if tag === 'locked'}
              <svg class="fill-current w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
              </svg>
            {/if}
            {tag}
          </span>
        {/each}
      </div>
    </div>
    <div class="flex items-center">
      <img class="w-15 h-15 rounded-full mr-4" src="{cardData.authorAvatarUrl}" alt="Avatar of {cardData.authorName}">
      <div class="text-sm">
        <p class="text-gruvlemphgreen font-bold dark:text-gruvgreen leading-none">{cardData.authorName}</p>
        <p class="text-gruvgray">{cardData.displayDate}</p>
      </div>
    </div>
  </div>
</div>
