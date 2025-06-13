<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Languages } from 'lucide-vue-next'
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger><Languages /></DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>{{ $t('header.languages.label') }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <NuxtLink :to="$switchLocalePath('en')">{{ $t('header.languages.english') }}</NuxtLink>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <NuxtLink :to="$switchLocalePath('fr')">{{ $t('header.languages.french') }}</NuxtLink>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
