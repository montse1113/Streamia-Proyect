import type { Genre, PaginatedResponse, Title, TitleDetail, TitleFilters } from '../types/title'
import { apiFetch } from './http'

// Gets one page of titles with the filters
export function getTitles(filters: TitleFilters = {}) {
  const params = new URLSearchParams()
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.type) params.set('type', filters.type)
  if (filters.genreId) params.set('genreId', String(filters.genreId))

  const query = params.toString()
  return apiFetch<PaginatedResponse<Title>>(`/titles${query ? `?${query}` : ''}`)
}

// Gets all genres
export async function getGenres() {
  const response = await apiFetch<{ data: Genre[] }>('/genres')
  return response.data
}

// Gets one title with its genres and, for series, its seasons and episodes
export async function getTitle(id: string) {
  const response = await apiFetch<{ data: TitleDetail }>(`/titles/${id}`)
  return response.data
}

