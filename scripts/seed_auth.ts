/* eslint-disable no-console */
import 'dotenv/config'
import { eq } from 'drizzle-orm'
import { db } from '~/db/conf'
import { UserTable } from '~/db/schema/user.schema'
import hash from '~/server/utils/hash'
const seedAuth = async () => {
  const credentials = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    login: process.env.DEFAULT_AUTH!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    password: process.env.DEFAULT_AUTH_PASSWORD!,
    userType: 'admin' as const
  }

  if (!credentials.login && !credentials.password) {
    console.log('Please setup your env file and retry again')
    return
  }

  const checkAdmin = await db.select().from(UserTable).where(eq(UserTable.login, credentials.login))

  if (checkAdmin[0]) {
    console.log('admin already exists')
    return
  }

  credentials.password = await hash(credentials.password)
  const admin = await db.insert(UserTable).values(credentials).returning({ login: UserTable.login })
  console.log('Successful creation of the admin user')
  console.dir(admin)
}

await seedAuth()
