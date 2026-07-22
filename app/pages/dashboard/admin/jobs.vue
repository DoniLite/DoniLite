<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table'
import { jobService } from '~/lib/service/job.service'
import type { JobStatus } from '~~/shared/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const { d, t } = useI18n()
const { data: jobs, refresh } = await jobService.list()
const busyId = ref<string | null>(null)
const error = ref('')

const getStatusVariant = (status: JobStatus) => {
  if (status === 'success') {
    return 'default'
  }
  if (status === 'failed') {
    return 'destructive'
  }
  return 'outline'
}

const retry = async (id: string) => {
  busyId.value = id
  error.value = ''
  try {
    await jobService.retry(id)
    await refresh()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Retry failed'
  } finally {
    busyId.value = null
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 p-4">
    <div>
      <h1 class="text-foreground text-2xl font-bold">{{ $t('admin.jobs.title') }}</h1>
      <p class="text-muted-foreground text-sm">{{ $t('admin.jobs.description') }}</p>
    </div>

    <p
      v-if="error"
      class="border-destructive bg-destructive/10 text-destructive rounded-md border p-3 text-sm"
    >
      {{ error }}
    </p>

    <div
      v-if="jobs.length === 0"
      class="text-muted-foreground rounded-md border border-dashed p-6 text-center text-sm"
    >
      {{ $t('admin.jobs.empty') }}
    </div>

    <div
      v-else
      class="border-border overflow-x-auto rounded-lg border"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{{ $t('admin.jobs.table.type') }}</TableHead>
            <TableHead>{{ $t('admin.jobs.table.status') }}</TableHead>
            <TableHead>{{ $t('admin.jobs.table.error') }}</TableHead>
            <TableHead>{{ $t('admin.jobs.table.retries') }}</TableHead>
            <TableHead>{{ $t('admin.jobs.table.lastRun') }}</TableHead>
            <TableHead class="text-right">{{ $t('common.actions') }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="job in jobs"
            :key="job.id"
          >
            <TableCell class="font-medium">
              {{ t(`admin.jobs.types.${job.type}`) }}
            </TableCell>
            <TableCell>
              <Badge :variant="getStatusVariant(job.status)">
                {{ t(`admin.jobs.status.${job.status}`) }}
              </Badge>
            </TableCell>
            <TableCell
              class="text-destructive max-w-xs truncate text-sm"
              :title="job.error ?? ''"
            >
              {{ job.error ?? '—' }}
            </TableCell>
            <TableCell>{{ job.retryCount }}</TableCell>
            <TableCell class="text-muted-foreground text-sm whitespace-nowrap">
              {{ job.lastRunAt ? d(new Date(job.lastRunAt)) : '—' }}
            </TableCell>
            <TableCell class="text-right">
              <Button
                v-if="job.status === 'failed'"
                size="sm"
                variant="outline"
                :disabled="busyId === job.id"
                @click="retry(job.id)"
              >
                <RefreshCw class="h-4 w-4" />
                {{ $t('admin.jobs.retry') }}
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
