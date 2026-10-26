export type TitleType = 'movie' | 'series'
 
export interface Genre {
  id: number
  name: string
}
 
export interface Title {
  id: number
  title: string
  type: TitleType
  releaseYear: number
  rating: string
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
