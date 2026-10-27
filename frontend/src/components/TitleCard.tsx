import { Link } from 'react-router-dom'
import type { Title } from '../types/title'

interface TitleCardProps {
  title: Title
}

export function TitleCard({ title }: TitleCardProps) {
  const typeLabel = title.type === 'series' ? 'Series' : 'Movie'

  return (
    <Link to={`/titles/${title.id}`} className="title-card">
      {title.posterUrl ? (
        <img src={title.posterUrl} alt={`${title.title} poster`} className="title-card__poster" />
      ) : (
        <div className="title-card__poster title-card__poster--empty" aria-hidden="true">
          {title.title.charAt(0)}
        </div>
      )}
      <h2 className="title-card__name">{title.title}</h2>
      <p className="title-card__info">
        {typeLabel}, {title.releaseYear}
      </p>
    </Link>
  )
}
