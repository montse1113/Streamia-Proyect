export type TitleType = 'movie' | 'series'

export interface Genre {
  id: number
  name: string
}

export interface Title {
  id: number
  type: TitleType
  title: string
  synopsis: string | null
  releaseYear: number | null
  ageRating: string | null
  durationMin: number | null
  posterUrl: string | null
  genres: Genre[]
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface TitleFilters {
  page?: number
  limit?: number
  type?: TitleType
  genreId?: number
}

export interface Episode {
  id: number
  number: number
  name: string
  durationMin: number | null
}

export interface Season {
  id: number
  number: number
  episodes: Episode[]
}

// The detail also brings the seasons (only for series)
export interface TitleDetail extends Title {
  seasons?: Season[]
}
