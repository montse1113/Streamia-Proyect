import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError } from '../api/http'
import { getTitle } from '../api/titles'
import { TitleInfo } from '../components/TitleInfo'
import type { TitleDetail } from '../types/title'
import { NotFoundPage } from './NotFoundPage'

// Container: loads one title and handles loading, not found and error states
export function TitleDetailPage() {
  const { id } = useParams()
  const [title, setTitle] = useState<TitleDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Ignores the response if the user leaves the page before it arrives
    let ignore = false

    async function loadTitle() {
      setIsLoading(true)
      setNotFound(false)
      setError(null)

      try {
        const response = await getTitle(id ?? '')
        if (!ignore) setTitle(response)
      } catch (err) {
        if (ignore) return
        // 404: the title does not exist. 400: the id is not a number
        if (err instanceof ApiError && (err.status === 404 || err.status === 400)) {
          setNotFound(true)
        } else {
          setError('The title could not be loaded. Try again in a moment.')
        }
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadTitle()

    return () => {
      ignore = true
    }
  }, [id])

  if (notFound) {
    return <NotFoundPage />
  }

  return (
    <main>
      <Link to="/catalog">← Back to the catalog</Link>

      {isLoading && <p>Loading...</p>}
      {error && <p role="alert">{error}</p>}
      {!isLoading && !error && title && <TitleInfo title={title} />}
    </main>
  )
}
