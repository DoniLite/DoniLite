<script setup lang="ts">
import { Download } from 'lucide-vue-next'
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

const { data: contacts } = await contactService.listContacts()
const { data: subscribers } = await newsletterService.listSubscribers()

const activeTab = ref(route.query.tab === 'newsletter' ? 'newsletter' : 'contacts')

const exportContacts = () => {
  downloadCsv(
    'contacts.csv',
    contacts.value.map((contact) => ({
      name: contact.name,
      email: contact.email,
      createdAt: contact.createdAt
    }))
  )
}

const exportSubscribers = () => {
  downloadCsv(
    'newsletter-subscribers.csv',
    subscribers.value.map((subscriber) => ({
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
          {{ $t('admin.contacts.tabs.contacts') }} ({{ contacts.length }})
        </TabsTrigger>
        <TabsTrigger value="newsletter">
          {{ $t('admin.contacts.tabs.newsletter') }} ({{ subscribers.length }})
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
            :disabled="contacts.length === 0"
            @click="exportContacts"
          >
            <Download class="h-4 w-4" />
            {{ $t('admin.contacts.export') }}
          </Button>
        </div>

        <div
          v-if="contacts.length === 0"
          class="text-muted-foreground rounded-md border border-dashed p-6 text-center text-sm"
        >
          {{ $t('admin.contacts.empty') }}
        </div>
        <div
          v-else
          class="border-border overflow-x-auto rounded-lg border"
        >
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
                v-for="contact in contacts"
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
      </TabsContent>

      <TabsContent
        value="newsletter"
        class="flex flex-col gap-4"
      >
        <div class="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            :disabled="subscribers.length === 0"
            @click="exportSubscribers"
          >
            <Download class="h-4 w-4" />
            {{ $t('admin.contacts.export') }}
          </Button>
        </div>

        <div
          v-if="subscribers.length === 0"
          class="text-muted-foreground rounded-md border border-dashed p-6 text-center text-sm"
        >
          {{ $t('admin.contacts.empty') }}
        </div>
        <div
          v-else
          class="border-border overflow-x-auto rounded-lg border"
        >
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
                v-for="subscriber in subscribers"
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
      </TabsContent>
    </Tabs>
  </div>
</template>
