<template>
  <div
    class="group bg-card relative overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
  >
    <div class="p-6">
      <h3 class="text-foreground text-lg font-bold">Projet 1</h3>
      <p class="text-muted-foreground text-sm">Une description de ce projet impressionnant</p>
      <div class="mt-4 flex flex-wrap gap-2">
        <span
          class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
        >
          Vue
        </span>
        <span
          class="bg-primary/10 text-primary inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
        >
          TypeScript
        </span>
      </div>
    </div>
    <div
      class="bg-accent/50 absolute right-0 bottom-0 left-0 border-t px-6 py-3 opacity-0 transition-opacity group-hover:opacity-100"
    >
      <a
        href="#"
        class="text-accent-foreground text-sm font-medium"
      >
        Voir le projet →
      </a>
    </div>
  </div>
</template>
