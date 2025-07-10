<script setup lang="ts">
import { toast } from 'vue-sonner'

definePageMeta({
  layout: false
})

const { login } = useSession()

const form = reactive({
  login: '',
  password: ''
})

const onFormSubmit = async () => {
  try {
    const success = await login(form)
    if (success) {
      await navigateTo('/dashboard/admin')
    }
    toast.error('authentication failed')
  } catch {
    toast.error('An error occurred')
  }
}
</script>

<template>
  <div class="flex min-h-screen w-full items-center justify-center">
    <div class="bg-card min-w-[300px] rounded-lg p-8 shadow-lg md:min-w-md lg:min-w-lg xl:min-w-xl">
      <h1 class="text-lg font-bold md:text-lg xl:text-3xl">{{ $t('admin.login.welcome') }}</h1>
      <span>{{ $t('admin.login.description') }}</span>
      <form
        class="mt-8 flex flex-col gap-4"
        @submit.prevent="onFormSubmit"
      >
        <div class="flex w-full flex-col gap-2">
          <label
            for="login"
            class="font-bold"
          >
            {{ $t('admin.login.input.login:input.label') }}
          </label>
          <input
            v-model="form.login"
            type="text"
            :placeholder="$t('admin.login.input.login:input.placeholder')"
            name="login"
            aria-required="true"
            :required="true"
            class="ring-muted focus:ring-primary rounded-md bg-transparent px-4 py-2 ring outline-none"
          />
        </div>

        <div class="flex w-full flex-col gap-2">
          <label
            for="password"
            class="font-bold"
          >
            {{ $t('admin.login.input.password:input.label') }}
          </label>
          <input
            v-model="form.password"
            type="password"
            :placeholder="$t('admin.login.input.password:input.placeholder')"
            name="password"
            :required="true"
            aria-required="true"
            class="ring-muted focus:ring-primary rounded-md bg-transparent px-4 py-2 ring outline-none"
          />
        </div>

        <Button
          type="submit"
          class="bg-primary text-primary-foreground w-full cursor-pointer rounded-md px-4 py-2 font-bold"
        >
          {{ $t('admin.login.input.submit') }}
        </Button>
      </form>
    </div>
  </div>
</template>
