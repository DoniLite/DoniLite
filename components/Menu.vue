<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'
</script>

<template>
  <div
    class="absolute top-0 left-[2.5%] z-20 mx-auto flex h-12 w-[95%] items-center justify-between p-2 lg:left-[15%] lg:w-[70%] lg:p-12"
  >
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{{ $t('header.me.id') }}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink>
              <NuxtLink :to="{ path: `${$localePath('index')}`, hash: '#about' }">
                {{ $t('header.me.about') }}
              </NuxtLink>
            </NavigationMenuLink>
            <NavigationMenuLink>
              <NuxtLink :to="$localePath('projects')">{{ $t('header.me.projects') }}</NuxtLink>
            </NavigationMenuLink>
            <NavigationMenuLink>
              <NuxtLink :to="{ path: `${$localePath('index')}`, hash: '#contact' }">
                {{ $t('header.me.contact') }}
              </NuxtLink>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink>
            <NuxtLink :to="$localePath('blog')">{{ $t('header.blog') }}</NuxtLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink>
            <NuxtLink
              :to="'https://patreon.com/donilite'"
              :target="'_blank'"
            >
              {{ $t('header.sponsor') }}
            </NuxtLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    <div class="flex items-center justify-center gap-2 lg:gap-8">
      <LanguageTrigger />
      <ThemingTrigger />
    </div>
  </div>
</template>
