import { asc } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~~/db/conf'
import { ArticleTagTable } from '~~/db/schema/article.schema'
import { slugify } from '~~/server/utils/slugify'

export const createTagPayloadSchema = z.object({
  label: z.string().min(1),
  slug: z.string().min(1).optional()
})

export const tagsService = {
  async list() {
    return db.query.ArticleTagTable.findMany({
      orderBy: [asc(ArticleTagTable.label)]
    })
  },

  async createTag(payload: z.infer<typeof createTagPayloadSchema>) {
    const parsed = createTagPayloadSchema.parse(payload)
    const [tag] = await db
      .insert(ArticleTagTable)
      .values({
        label: parsed.label,
        slug: parsed.slug ?? slugify(parsed.label)
      })
      .returning()

    if (!tag) {
      throw createError({ statusCode: 500, message: 'Tag creation failed' })
    }

    return tag
  }
}
