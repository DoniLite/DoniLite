type CallbackFunc<P> = () => Promise<P[]> | P[]
type CustomOptions<T> = {
  validateTime: number
  validateFunc?: (entity: T | undefined) => boolean
}
const validateStoreData = async <T extends object>(
  persistedData:
    | (T & {
        persistTime: number
      })
    | undefined,
  stateGetterKey: string,
  storeLoader: CallbackFunc<T>,
  customOptions?: CustomOptions<T>
) => {
  if (persistedData) {
    // Revalidating based on time if any data is persisted
    const validateTime = customOptions?.validateTime || 1000 * 10
    if (
      Date.now() - persistedData['persistTime'] > validateTime &&
      customOptions?.validateFunc &&
      customOptions.validateFunc(persistedData)
    ) {
      const newStoreData = await storeLoader()
      return newStoreData
    }

    if (Date.now() - persistedData['persistTime'] > validateTime) {
      const newStoreData = await storeLoader()
      return newStoreData
    }
    return (persistedData as Record<string | number, unknown>)[stateGetterKey] as T[]
  }
  const newStoreData = await storeLoader()
  return newStoreData
}
/**
 * This Function is used to load the appropriated store with validation logic to keep persistence between all the sessions
 * All the parameters on this function are optional if all parameters are provided the store is validated based on the persisted data time
 * To avoid typescript warning on usage provide the Generic that will be return by the function because it cannot be inferred
 * @param id - The id of the store that you want to load
 * @param getter - The getter defined on the store usually the computed value that you're sharing to the store consumer
 * @param loader - An optional store loader function
 * @returns the validated data
 * ## Usage
 * ```ts
 *  export const useCategoriesStore = defineStore('categories', async () => {
 *       // Providing the store id and the getter
 *       const categoriesEntity = await loadStoreData<Category>('categories', 'getCategories')
 *       const categories = ref<Category[]>(categoriesEntity || defaultPanelist.categories)
 *       const getCategories = computed(() => categories.value)
 *  }
 * ```
 */
export default async function <T extends object>(
  loader: CallbackFunc<T>,
  id?: string,
  getter?: string,
  opts?: CustomOptions<T>
) {
  const storeFromStorage = localStorage.getItem(`persisted_${id}`)
  if (id && getter) {
    if (!storeFromStorage) {
      return loader()
    }
    return JSON.parse(storeFromStorage)[getter] as T[]
  }
  if (id && getter && loader) {
    // The store have to been revalidate
    const entity = storeFromStorage
      ? (JSON.parse(storeFromStorage) as T & {
          persistTime: number
        })
      : undefined
    const validatedStore = await validateStoreData<T>(entity, getter, loader, opts)
    return validatedStore
  }
  return loader()
}
