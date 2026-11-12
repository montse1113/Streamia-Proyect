import type { Genre, PaginatedResponse, Title, TitleFilters } from '../types/title'
import { apiFetch } from './http'

//Ask list of titles whit the filters to the API and return them as a PaginatedResponse of Title objects
export function getTitles(filters: TitleFilters = {}) {
  const params = new URLSearchParams()
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.type) params.set('type', filters.type)
  if (filters.genreId) params.set('genreId', String(filters.genreId))

  const query = params.toString()
  return apiFetch<PaginatedResponse<Title>>(`/titles${query ? `?${query}` : ''}`)
}

//Ask list of genres to the API and return them as an array of Genre objects
export async function getGenres() {
  const response = await apiFetch<{ data: Genre[] }>('/genres')
  return response.data
}
