import type { Title } from '../types/title'
import { TitleCard } from './TitleCard'

interface TitleGridProps {
  titles: Title[]
}

export function TitleGrid({ titles }: TitleGridProps) {
  return (
      <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {titles.map((title) => (
        <li key={title.id}>
          <TitleCard title={title} />
        </li>
      ))}
    </ul>
  )
}
