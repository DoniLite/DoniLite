<template>
  <div class="flex w-full flex-col gap-2">
    <label
      :for="name"
      class="font-bold"
    >
      {{ label }}
    </label>
    <input
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :name="name"
      :aria-required="required"
      :required="required"
      class="ring-muted focus:ring-primary rounded-md bg-transparent px-4 py-2 ring outline-none"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      @change="inputChangeHandler"
      @input="inputChangeHandler"
    />
  </div>
</template>

<script setup lang="ts" generic="T">
import type { InputTypeHTMLAttribute } from 'vue'

interface Props {
  label?: string
  placeholder?: string
  name?: string
  required?: boolean
  type?: InputTypeHTMLAttribute
}

type Emits = {
  change: [value: T]
  blur: []
  focus: []
}

withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: '',
  name: '',
  required: false,
  type: 'text'
})

const emits = defineEmits<Emits>()

const inputChangeHandler = () => {
  if (model.value) {
    emits('change', model.value)
  }
}

const model = defineModel<T>()
</script>
