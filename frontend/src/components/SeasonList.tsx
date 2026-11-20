import type { Season } from '../types/title'

interface SeasonListProps {
  seasons: Season[]
}

// Shows each season with its episodes
export function SeasonList({ seasons }: SeasonListProps) {
  if (seasons.length === 0) {
    return <p>This series has no episodes yet.</p>
  }

  return (
    <section>
      <h2>Episodes</h2>
      {seasons.map((season) => (
        <div key={season.id}>
          <h3>Season {season.number}</h3>
          <ol>
            {season.episodes.map((episode) => (
              <li key={episode.id}>
                {episode.number}. {episode.name}
                {episode.durationMin && ` (${episode.durationMin} min)`}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  )
}
