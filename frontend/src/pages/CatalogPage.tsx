import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getTitles } from '../api/titles'
import { Pagination } from '../components/Pagination'
import { TitleGrid } from '../components/TitleGrid'
import type { PaginationMeta, Title } from '../types/title'
import './CatalogPage.css'

// Returns a valid page number from the URL, or 1 if it is missing or invalid
function parsePage(value: string | null) {
  const page = Number(value)
  return Number.isInteger(page) && page >= 1 ? page : 1
}

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parsePage(searchParams.get('page'))

  const [titles, setTitles] = useState<Title[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Ignores the response if the user leaves the page before it arrives
    let ignore = false

    async function loadTitles() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await getTitles()
        if (!ignore) setTitles(response.data)
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
  }, [page])

  function handlePageChange(newPage: number) {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams)
      nextParams.set('page', String(newPage))
      return nextParams
    })
    window.scrollTo({ top: 0 })
  }

  return (
    <main className="catalog">
      <h1>Catalog</h1>

      {isLoading && <p className="catalog__message">Loading titles...</p>}

      {!isLoading && error && (
        <p className="catalog__message catalog__message--error" role="alert">
          {error}
        </p>
      )}

      {!isLoading && !error && titles.length === 0 && (
        <div className="catalog__message">
          <p>No titles match these filters.</p>
          {page > 1 && (
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
