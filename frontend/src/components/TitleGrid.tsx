import type { Title } from '../types/title'
import { TitleCard } from './TitleCard'

interface TitleGridProps {
  titles: Title[]
}

export function TitleGrid({ titles }: TitleGridProps) {
  return (
    <ul className="title-grid">
      {titles.map((title) => (
        <li key={title.id}>
          <TitleCard title={title} />
        </li>
      ))}
    </ul>
  )
}
