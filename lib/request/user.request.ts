import type { UserTable } from '~/db/schema/user.schema'

export type CreateUserRequest = Pick<
  typeof UserTable.$inferInsert,
  'login' | 'password' | 'userType'
>

export type AuthRequest = Omit<CreateUserRequest, 'userType'>

export type UpdateUserRequest = Partial<CreateUserRequest>
