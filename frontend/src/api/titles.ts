import type { Genre, PaginatedResponse, Title, TitleFilters } from '../types/title'

const API_URL = '/api/v1'

// Keeps the HTTP status so pages can react to it (for example, 404 in title details)
export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`)

  if (!response.ok) {
    throw new ApiError(response.status, `Request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function getTitles(filters: TitleFilters = {}) {
  const params = new URLSearchParams()
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.type) params.set('type', filters.type)
  if (filters.genreId) params.set('genreId', String(filters.genreId))

  const query = params.toString()
  return request<PaginatedResponse<Title>>(`/titles${query ? `?${query}` : ''}`)
}

export async function getGenres() {
  const response = await request<{ data: Genre[] }>('/genres')
  return response.data
}