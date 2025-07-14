<script setup lang="ts" generic="T">
import { cn } from '@/lib/utils'
import { VisXYContainer } from '@unovis/vue'
import { reactiveOmit } from '@vueuse/core'
import { useForwardProps } from 'reka-ui'
import type { ChartContainerProps } from './charts'
// eslint-disable-next-line vue/no-reserved-props, vue/prop-name-casing, vue/no-unused-properties
const props = defineProps<ChartContainerProps<T>>()

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <VisXYContainer
    v-bind="{ ...forwardedProps, ...$attrs }"
    :class="cn('bg-card container mx-auto rounded-md p-4', props.class as string)"
  >
    <slot />
  </VisXYContainer>
</template>
