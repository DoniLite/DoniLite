// Thrown by job handlers that made partial progress before failing (e.g. a
// batch send where some recipients succeeded) so the job can be marked
// 'failed' while still persisting what succeeded — a retry then only
// re-attempts what's left instead of redoing everything.
export class JobExecutionError extends Error {
  partialResult?: unknown

  constructor(message: string, partialResult?: unknown) {
    super(message)
    this.name = 'JobExecutionError'
    this.partialResult = partialResult
  }
}
