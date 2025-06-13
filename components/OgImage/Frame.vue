<script setup lang="ts">
import { Icon } from 'lucide-vue-next' // Assurez-vous que l'import est correct

/**
 * @credits @arashsheyda <https://github.com/arashsheyda>
 */

interface SocialLink {
  name: string
  icon: string // Assurez-vous que 'icon' correspond aux noms d'icônes valides pour lucide-vue-next
  url?: string // Optionnel : ajouter une URL si ces icônes doivent être des liens
}

// Définition des props avec des types plus précis si nécessaire
withDefaults(
  defineProps<{
    title?: string
    description?: string
    bg?: string // Peut être une couleur, un gradient, etc.
    // icon?: string // Nom de l'icône lucide
    logo?: string // URL/chemin de l'image du logo
    image?: string // URL/chemin de l'image de fond optionnelle
    username?: string
    // socials?: SocialLink[]
  }>(),
  {
    // Utilisation d'une fonction qui retourne la valeur par défaut pour les objets/tableaux
    socials: () => [
      { name: 'github', icon: 'github' },
      { name: 'linkedin', icon: 'linkedin' },
      { name: 'twitter', icon: 'twitter' }
      // Ajoutez d'autres réseaux sociaux par défaut si nécessaire
    ],
    // Valeurs par défaut pour les types primitifs
    bg: 'linear-gradient(to bottom right, #171717, #131313)',
    image: undefined,
    description: 'Open Source Developer and Passionate about new technologies',
    title: 'Doni Lite',
    icon: 'code-2', // 'code-xml' n'existe pas dans lucide, 'code-2' ou 'code' sont des alternatives
    logo: '/avatar.jpeg', // Assurez-vous que ce chemin est correct depuis la racine publique
    username: 'DoniLite'
  }
)
</script>

<template>
  <div
    class="relative flex h-full w-full items-center justify-center overflow-hidden border-2 border-white bg-neutral-900 text-white"
    :style="{ background: bg }"
  >
    <!-- Image de fond optionnelle -->
    <div
      v-if="image"
      class="absolute inset-0 h-full w-full bg-cover bg-center opacity-10"
      :style="{ backgroundImage: `url(${image})` }"
    />

    <!-- Contenu Principal -->
    <div class="z-10 flex flex-col items-center p-8 text-center">
      <!-- Ajout de padding et z-index -->
      <h1 class="mb-4 flex items-center gap-4 text-6xl font-bold md:text-7xl">
        <!-- Responsive text size -->
        <!-- Icône du titre corrigée -->
        <!-- <Icon
          v-if="icon"
          :name="icon"
          :icon-node="[]"
          class="h-14 w-14 md:h-16"
          aria-hidden="true"
        /> -->
        {{ title }}
      </h1>
      <p class="max-w-3xl text-xl md:text-2xl">
        <!-- Responsive text size -->
        {{ description }}
      </p>
    </div>

    <!-- Logo -->
    <img
      v-if="logo"
      :src="logo"
      :alt="`${username || title} logo`"
      class="absolute bottom-5 left-5 z-10 h-24 w-24 rounded-full object-cover ring-2 ring-white md:h-32 md:w-32"
    />

    <!-- Section Sociale (Username + Icônes) -->
    <div class="absolute right-5 bottom-5 z-10 flex flex-col items-end gap-2">
      <!-- Username -->
      <div
        v-if="username"
        class="text-lg font-bold"
      >
        {{ username }}
      </div>
      <!-- Icônes Sociales -->
      <div class="flex gap-3">
        <!-- Envisagez d'envelopper chaque icône dans un <a> si ce sont des liens -->
        <!-- <Icon
          v-for="social in socials"
          :key="social.name"
          :name="social.icon"
          class="h-7 w-7 transition-opacity hover:opacity-80"
          :aria-label="social.name"
        /> -->
        <!-- Exemple avec lien:
         <a :href="social.url" target="_blank" :aria-label="`Visiter ${username} sur ${social.name}`">
            <Icon :name="social.icon" class="h-7 w-7" />
         </a>
         -->
      </div>
    </div>
  </div>
</template>
