<script setup lang="ts">
import { ChevronLeft, ChevronRight, Download } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { contactService } from '~/lib/service/contact.service'
import { newsletterService } from '~/lib/service/newsletter.service'
import { downloadCsv } from '~/lib/utils'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const route = useRoute()
const { d } = useI18n()
const pageSize = 10

const activeTab = ref(route.query.tab === 'newsletter' ? 'newsletter' : 'contacts')

const contactsPage = ref(1)
const { data: contactsResult } = await contactService.listContacts(contactsPage.value, pageSize)
const contactsTotalPages = computed(() =>
  Math.max(1, Math.ceil(contactsResult.value.total / contactsResult.value.pageSize))
)
const goToContactsPage = (page: number) => {
  contactsPage.value = Math.min(Math.max(page, 1), contactsTotalPages.value)
}
watch(contactsPage, async (page) => {
  const { data } = await contactService.listContacts(page, pageSize)
  contactsResult.value = data.value
})

const subscribersPage = ref(1)
const { data: subscribersResult } = await newsletterService.listSubscribers(
  subscribersPage.value,
  pageSize
)
const subscribersTotalPages = computed(() =>
  Math.max(1, Math.ceil(subscribersResult.value.total / subscribersResult.value.pageSize))
)
const goToSubscribersPage = (page: number) => {
  subscribersPage.value = Math.min(Math.max(page, 1), subscribersTotalPages.value)
}
watch(subscribersPage, async (page) => {
  const { data } = await newsletterService.listSubscribers(page, pageSize)
  subscribersResult.value = data.value
})

// Export always covers the full dataset (a one-off unpaginated fetch at
// click time), independent of whatever page is currently on screen.
const exportContacts = async () => {
  const all = await contactService.listAllContacts()
  downloadCsv(
    'contacts.csv',
    all.items.map((contact) => ({
      name: contact.name,
      email: contact.email,
      createdAt: contact.createdAt
    }))
  )
}

const exportSubscribers = async () => {
  const all = await newsletterService.listAllSubscribers()
  downloadCsv(
    'newsletter-subscribers.csv',
    all.items.map((subscriber) => ({
      email: subscriber.email,
      subscribedAt: subscriber.createdAt,
      unsubscribedAt: subscriber.unsubscribedAt ?? ''
    }))
  )
}
</script>

<template>
  <div class="flex flex-col gap-6 p-4">
    <div>
      <h1 class="text-foreground text-2xl font-bold">{{ $t('admin.contacts.title') }}</h1>
      <p class="text-muted-foreground text-sm">{{ $t('admin.contacts.description') }}</p>
    </div>

    <Tabs v-model="activeTab">
      <TabsList>
        <TabsTrigger value="contacts">
          {{ $t('admin.contacts.tabs.contacts') }} ({{ contactsResult.total }})
        </TabsTrigger>
        <TabsTrigger value="newsletter">
          {{ $t('admin.contacts.tabs.newsletter') }} ({{ subscribersResult.total }})
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="contacts"
        class="flex flex-col gap-4"
      >
        <div class="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            :disabled="contactsResult.total === 0"
            @click="exportContacts"
          >
            <Download class="h-4 w-4" />
            {{ $t('admin.contacts.export') }}
          </Button>
        </div>

        <div
          v-if="contactsResult.total === 0"
          class="text-muted-foreground rounded-md border border-dashed p-6 text-center text-sm"
        >
          {{ $t('admin.contacts.empty') }}
        </div>
        <template v-else>
          <div class="border-border overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{{ $t('common.name') }}</TableHead>
                  <TableHead>{{ $t('common.email') }}</TableHead>
                  <TableHead>{{ $t('admin.contacts.table.since') }}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="contact in contactsResult.items"
                  :key="contact.id"
                >
                  <TableCell class="font-medium">{{ contact.name }}</TableCell>
                  <TableCell>{{ contact.email }}</TableCell>
                  <TableCell class="text-muted-foreground text-sm whitespace-nowrap">
                    {{ contact.createdAt ? d(new Date(contact.createdAt)) : '—' }}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div
            v-if="contactsTotalPages > 1"
            class="flex items-center justify-center gap-2"
          >
            <button
              :class="Pagination_class.nextPage"
              :disabled="contactsPage === 1"
              @click="goToContactsPage(contactsPage - 1)"
            >
              <ChevronLeft class="h-4 w-4" />
            </button>
            <button
              v-for="page in contactsTotalPages"
              :key="page"
              :class="
                page === contactsPage ? Pagination_class.currentPage : Pagination_class.nextPage
              "
              @click="goToContactsPage(page)"
            >
              {{ page }}
            </button>
            <button
              :class="Pagination_class.nextPage"
              :disabled="contactsPage === contactsTotalPages"
              @click="goToContactsPage(contactsPage + 1)"
            >
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </template>
      </TabsContent>

      <TabsContent
        value="newsletter"
        class="flex flex-col gap-4"
      >
        <div class="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            :disabled="subscribersResult.total === 0"
            @click="exportSubscribers"
          >
            <Download class="h-4 w-4" />
            {{ $t('admin.contacts.export') }}
          </Button>
        </div>

        <div
          v-if="subscribersResult.total === 0"
          class="text-muted-foreground rounded-md border border-dashed p-6 text-center text-sm"
        >
          {{ $t('admin.contacts.empty') }}
        </div>
        <template v-else>
          <div class="border-border overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{{ $t('common.email') }}</TableHead>
                  <TableHead>{{ $t('admin.contacts.table.since') }}</TableHead>
                  <TableHead>{{ $t('admin.contacts.table.status') }}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="subscriber in subscribersResult.items"
                  :key="subscriber.id"
                >
                  <TableCell class="font-medium">{{ subscriber.email }}</TableCell>
                  <TableCell class="text-muted-foreground text-sm whitespace-nowrap">
                    {{ subscriber.createdAt ? d(new Date(subscriber.createdAt)) : '—' }}
                  </TableCell>
                  <TableCell>
                    {{
                      subscriber.unsubscribedAt
                        ? $t('admin.contacts.unsubscribed')
                        : $t('admin.contacts.subscribed')
                    }}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div
            v-if="subscribersTotalPages > 1"
            class="flex items-center justify-center gap-2"
          >
            <button
              :class="Pagination_class.nextPage"
              :disabled="subscribersPage === 1"
              @click="goToSubscribersPage(subscribersPage - 1)"
            >
              <ChevronLeft class="h-4 w-4" />
            </button>
            <button
              v-for="page in subscribersTotalPages"
              :key="page"
              :class="
                page === subscribersPage ? Pagination_class.currentPage : Pagination_class.nextPage
              "
              @click="goToSubscribersPage(page)"
            >
              {{ page }}
            </button>
            <button
              :class="Pagination_class.nextPage"
              :disabled="subscribersPage === subscribersTotalPages"
              @click="goToSubscribersPage(subscribersPage + 1)"
            >
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </template>
      </TabsContent>
    </Tabs>
  </div>
</template>
