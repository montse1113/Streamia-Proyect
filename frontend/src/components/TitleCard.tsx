import { Link } from 'react-router-dom'
import type { Title } from '../types/title'

interface TitleCardProps {
  title: Title
}

export function TitleCard({ title }: TitleCardProps) {
  const typeLabel = title.type === 'series' ? 'Series' : 'Movie'

  return (
    // group lets the children react when the card is hovered
    <Link
      to={`/titles/${title.id}`}
      className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
    >
      {title.posterUrl ? (
        <img
          src={title.posterUrl}
          alt={`${title.title} poster`}
          className="aspect-2/3 w-full rounded-lg bg-slate-300 object-cover group-hover:opacity-80"
        />
      ) : (
        <div
          className="flex aspect-2/3 w-full items-center justify-center rounded-lg bg-slate-300 text-5xl font-bold text-slate-600 group-hover:opacity-80"
          aria-hidden="true"
        >
          {title.title.charAt(0)}
        </div>
      )}
      <h2 className="mt-2 font-semibold group-hover:text-indigo-600">{title.title}</h2>
      <p className="text-sm text-slate-500">
        {title.releaseYear ? `${typeLabel}, ${title.releaseYear}` : typeLabel}
      </p>
    </Link>
  )
}
