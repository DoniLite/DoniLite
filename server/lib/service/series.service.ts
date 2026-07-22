import { asc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~~/db/conf'
import { ArticleSeasonTable, ArticleSeriesTable } from '~~/db/schema/article.schema'
import { slugify } from '~~/server/utils/slugify'

export const createSeriesPayloadSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().optional().nullable()
})

export const createSeasonPayloadSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  position: z.number().int().positive().optional()
})

export const seriesService = {
  async list() {
    return db.query.ArticleSeriesTable.findMany({
      with: {
        seasons: {
          orderBy: [asc(ArticleSeasonTable.position)]
        }
      },
      orderBy: [asc(ArticleSeriesTable.title)]
    })
  },

  async createSeries(payload: z.infer<typeof createSeriesPayloadSchema>) {
    const parsed = createSeriesPayloadSchema.parse(payload)
    const [series] = await db
      .insert(ArticleSeriesTable)
      .values({
        title: parsed.title,
        slug: parsed.slug ?? slugify(parsed.title),
        description: parsed.description
      })
      .returning()

    if (!series) {
      throw createError({ statusCode: 500, message: 'Series creation failed' })
    }

    return series
  },

  async createSeason(seriesId: string, payload: z.infer<typeof createSeasonPayloadSchema>) {
    const parsed = createSeasonPayloadSchema.parse(payload)
    const series = await db.query.ArticleSeriesTable.findFirst({
      where: eq(ArticleSeriesTable.id, seriesId)
    })
    if (!series) {
      throw createError({ statusCode: 404, message: 'Series not found' })
    }

    const existingSeasons = await db.query.ArticleSeasonTable.findMany({
      where: eq(ArticleSeasonTable.seriesId, seriesId)
    })

    const [season] = await db
      .insert(ArticleSeasonTable)
      .values({
        seriesId,
        title: parsed.title,
        slug: parsed.slug ?? slugify(parsed.title),
        description: parsed.description,
        position: parsed.position ?? existingSeasons.length + 1
      })
      .returning()

    if (!season) {
      throw createError({ statusCode: 500, message: 'Season creation failed' })
    }

    return season
  }
}
