import type { TitleDetail } from '../types/title'
import { SeasonList } from './SeasonList'

interface TitleInfoProps {
  title: TitleDetail
}

// Only shows the title data, it does not call the API
export function TitleInfo({ title }: TitleInfoProps) {
  const typeLabel = title.type === 'series' ? 'Series' : 'Movie'

  return (
    <article>
      {title.posterUrl && <img src={title.posterUrl} alt={`${title.title} poster`} />}

      <h1>{title.title}</h1>
      <p>
        {typeLabel}
        {title.releaseYear && ` · ${title.releaseYear}`}
        {title.ageRating && ` · ${title.ageRating}`}
        {title.durationMin && ` · ${title.durationMin} min`}
      </p>

      {title.genres.length > 0 && (
        <p>Genres: {title.genres.map((genre) => genre.name).join(', ')}</p>
      )}

      <p>{title.synopsis ?? 'No synopsis yet.'}</p>

      {title.type === 'series' && <SeasonList seasons={title.seasons ?? []} />}
    </article>
  )
}
