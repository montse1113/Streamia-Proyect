import type { Genre, Title } from '../types/title'

// Temporary data with the agreed API shape. Remove once the backend is ready.
export const mockGenres: Genre[] = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Comedy' },
  { id: 3, name: 'Drama' },
  { id: 4, name: 'Horror' },
  { id: 5, name: 'Sci-Fi' },
  { id: 6, name: 'Documentary' },
]

const mockMovies: Title[] = Array.from({ length: 15 }, (_, index) => ({
  id: index + 1,
  title: `Mock Movie ${index + 1}`,
  type: 'movie',
  releaseYear: 2010 + index,
  rating: 'PG-13',
  posterUrl: null,
  genres: [mockGenres[index % mockGenres.length]],
}))

const mockSeries: Title = {
  id: 16,
  title: 'The Open Lab',
  type: 'series',
  releaseYear: 2024,
  rating: 'TV-14',
  posterUrl: null,
  genres: [mockGenres[5]],
}

export const mockTitles: Title[] = [...mockMovies, mockSeries]