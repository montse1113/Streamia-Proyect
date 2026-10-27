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
        <div className="catalog-filters">
            <label>
                Type
                <select
                    value={type ?? ''}
                    onChange={(event) => onTypeChange((event.target.value || undefined) as TitleType | undefined)}
                >
                    <option value="">All</option>
                    <option value="movie">Movies</option>
                    <option value="series">Series</option>
                </select>
            </label>

            <label>
                Genre
                <select
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