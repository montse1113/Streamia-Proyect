import type {Genre,  TitleType} from '../types/title'

interface CatalogFiltersProps {
    type: TitleType | undefined
    genreId: number | undefined
    genres: Genre[]
    onTypeChange: (type: TitleType | undefined) => void
    onGenreChange: (genreId: number | undefined) => void
}

export function CatalogFilters({ type, genreId, genres, onTypeChange, onGenreChange }: CatalogFiltersProps) {
    return (
        <div className="mb-6 flex flex-wrap gap-4">
            <label className="flex flex-col gap-1 text-sm font-medium">
                Type
                <select
                    className="min-w-40 rounded-lg border border-slate-400 bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-indigo-600"
                    value={type ?? ''}
                    onChange={(event) => onTypeChange((event.target.value || undefined) as TitleType | undefined)}
                >
                    <option value="">All</option>
                    <option value="movie">Movies</option>
                    <option value="series">Series</option>
                </select>
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
                Genre
                <select
                    className="min-w-40 rounded-lg border border-slate-400 bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-indigo-600"
                    value={genreId ?? ''}
                    onChange={(event) => onGenreChange(event.target.value ? Number(event.target.value) : undefined)}
                >
                    <option value="">All</option>
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                            {genre.name}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}