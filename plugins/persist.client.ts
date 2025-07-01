import type { Pinia, PiniaPluginContext } from 'pinia'

const persistStore = ({ store }: PiniaPluginContext) => {
  const localStoreNamespace = `persisted_${store.$id}`
  store.$onAction(({ store: actionStore, after }) => {
    // Waiting until the action finished and then persist the store
    after(() => {
      const JSONStore = JSON.stringify({ ...actionStore.$state, persistTime: Date.now() })
      localStorage.setItem(localStoreNamespace, JSONStore)
    })
  })
}

export default defineNuxtPlugin(({ $pinia }) => {
  if (!$pinia) {
    return
  }
  ;($pinia as Pinia).use(persistStore)
})
