import { eq } from 'drizzle-orm'
import { db } from '~/db/conf'
import { UserTable } from '~/db/schema/user.schema'
import type { AuthRequest, CreateUserRequest, UpdateUserRequest } from '../request/user.request'

export const userService = {
  async find(login: AuthRequest['login']) {
    return db.select().from(UserTable).where(eq(UserTable.login, login))
  },
  async create(user: CreateUserRequest) {
    return db.insert(UserTable).values(user).returning({ id: UserTable.id })
  },
  async update(login: string, user: UpdateUserRequest) {
    return db.update(UserTable).set(user).where(eq(UserTable.login, login))
  }
}
