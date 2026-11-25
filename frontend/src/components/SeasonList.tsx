import type { Season } from '../types/title'

interface SeasonListProps {
  seasons: Season[]
}

// Shows each season with its episodes
export function SeasonList({ seasons }: SeasonListProps) {
  if (seasons.length === 0) {
    return <p className="mt-6 text-slate-600">This series has no episodes yet.</p>
  }

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-2xl font-bold">Episodes</h2>
      {seasons.map((season) => (
        // One white box per season
        <div key={season.id} className="mb-4 rounded-xl bg-white p-4 shadow">
          <h3 className="mb-2 font-semibold">Season {season.number}</h3>
          <ol className="text-sm">
            {season.episodes.map((episode) => (
              <li key={episode.id} className="border-b border-slate-100 py-2 last:border-0">
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
