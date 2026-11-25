import type { TitleDetail } from '../types/title'
import { SeasonList } from './SeasonList'

interface TitleInfoProps {
  title: TitleDetail
}

// Only shows the title data, it does not call the API
export function TitleInfo({ title }: TitleInfoProps) {
  const typeLabel = title.type === 'series' ? 'Series' : 'Movie'

  return (
    // Poster on top on mobile, on the left on desktop
    <article className="flex flex-col gap-6 md:flex-row">
      {title.posterUrl && (
        <img
          src={title.posterUrl}
          alt={`${title.title} poster`}
          className="aspect-2/3 w-48 shrink-0 self-center rounded-lg object-cover shadow md:w-64 md:self-start"
        />
      )}

      <div className="flex-1">
        <h1 className="text-3xl font-bold">{title.title}</h1>
        <p className="mt-1 text-slate-600">
          {typeLabel}
          {title.releaseYear && ` · ${title.releaseYear}`}
          {title.ageRating && ` · ${title.ageRating}`}
          {title.durationMin && ` · ${title.durationMin} min`}
        </p>

        {title.genres.length > 0 && (
          <p className="mt-3 text-sm">Genres: {title.genres.map((genre) => genre.name).join(', ')}</p>
        )}

        <p className="mt-4 leading-relaxed">{title.synopsis ?? 'No synopsis yet.'}</p>

        {title.type === 'series' && <SeasonList seasons={title.seasons ?? []} />}
      </div>
    </article>
  )
}
