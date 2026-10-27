import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getGenres, getTitles } from '../api/titles'
import { CatalogFilters } from '../components/CatalogFilters'
import { Pagination } from '../components/Pagination'
import { TitleGrid } from '../components/TitleGrid'
import type { Genre, PaginationMeta, Title, TitleType } from '../types/title'
import './CatalogPage.css'

// Each parser returns a valid value from the URL, or a default if it is missing or invalid
function parsePage(value: string | null) {
  const page = Number(value)
  return Number.isInteger(page) && page >= 1 ? page : 1
}

function parseType(value: string | null): TitleType | undefined {
  return value === 'movie' || value === 'series' ? value : undefined
}

function parseGenreId(value: string | null) {
  const genreId = Number(value)
  return Number.isInteger(genreId) && genreId >= 1 ? genreId : undefined
}

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parsePage(searchParams.get('page'))
  const type = parseType(searchParams.get('type'))
  const genreId = parseGenreId(searchParams.get('genreId'))
  const hasFilters = type !== undefined || genreId !== undefined

  const [titles, setTitles] = useState<Title[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [genres, setGenres] = useState<Genre[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Genres only need to be loaded once
  useEffect(() => {
    let ignore = false

    getGenres()
      .then((response) => {
        if (!ignore) setGenres(response)
      })
      .catch(() => {
        // The catalog still works without genres; the select only shows "All genres"
      })

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    // Ignores the response if the user leaves the page before it arrives
    let ignore = false

    async function loadTitles() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await getTitles({ page, type, genreId })
        if (!ignore) {
          setTitles(response.data)
          setMeta(response.meta)
        }
      } catch {
        if (!ignore) setError('The catalog could not be loaded. Try again in a moment.')
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadTitles()

    return () => {
      ignore = true
    }
  }, [page, type, genreId])

  function handlePageChange(newPage: number) {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams)
      nextParams.set('page', String(newPage))
      return nextParams
    })
    window.scrollTo({ top: 0 })
  }

  // Changing a filter always goes back to page 1
  function handleFilterChange(name: 'type' | 'genreId', value: string | undefined) {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams)
      if (value) {
        nextParams.set(name, value)
      } else {
        nextParams.delete(name)
      }
      nextParams.delete('page')
      return nextParams
    })
  }

  function clearFilters() {
    setSearchParams({})
  }

  return (
    <main className="catalog">
      <h1>Catalog</h1>

      <CatalogFilters
        type={type}
        genreId={genreId}
        genres={genres}
        onTypeChange={(newType) => handleFilterChange('type', newType)}
        onGenreChange={(newGenreId) => handleFilterChange('genreId', newGenreId?.toString())}
      />

      {isLoading && <p className="catalog__message">Loading titles...</p>}

      {!isLoading && error && (
        <p className="catalog__message catalog__message--error" role="alert">
          {error}
        </p>
      )}

      {!isLoading && !error && titles.length === 0 && (
        <div className="catalog__message">
          <p>No titles match these filters.</p>
          {hasFilters && (
            <button type="button" onClick={clearFilters}>
              Clear filters
            </button>
          )}
          {!hasFilters && page > 1 && (
            <button type="button" onClick={() => handlePageChange(1)}>
              Go to the first page
            </button>
          )}
        </div>
      )}

      {!isLoading && !error && titles.length > 0 && meta && (
        <>
          <TitleGrid titles={titles} />
          <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </main>
  )
}
