import { mockGenres, mockTitles } from '../mocks/titles'
import type { Genre, PaginatedResponse, Title, TitleFilters } from '../types/title'

const DEFAULT_LIMIT = 15
const MOCK_DELAY_MS = 400

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// TODO: replace the mock with GET /api/v1/titles when the endpoint is ready
export async function getTitles(filters: TitleFilters = {}): Promise<PaginatedResponse<Title>> {
  await wait(MOCK_DELAY_MS)

  const page = filters.page ?? 1
  const limit = filters.limit ?? DEFAULT_LIMIT

  const filteredTitles = mockTitles.filter((title) => {
    const matchesType = !filters.type || title.type === filters.type
    const matchesGenre = !filters.genreId || title.genres.some((genre) => genre.id === filters.genreId)
    return matchesType && matchesGenre
  })

  const start = (page - 1) * limit

  return {
    data: filteredTitles.slice(start, start + limit),
    meta: {
      page,
      limit,
      total: filteredTitles.length,
      totalPages: Math.ceil(filteredTitles.length / limit),
    },
  }
}

// TODO: replace the mock with GET /api/v1/genres when the endpoint is ready
export async function getGenres(): Promise<Genre[]> {
  await wait(MOCK_DELAY_MS)
  return mockGenres
}