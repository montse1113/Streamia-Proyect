type GenreData = { id: number; name: string };
type EpisodeData = { id: number; number: number; name: string; durationMin: number | null };
type SeasonData = { id: number; number: number; episodes?: EpisodeData[] };

type TitleData = {
    id: number;
    type: string;
    title: string;
    synopsis: string | null;
    releaseYear: number | null;
    ageRating: string | null;
    durationMin: number | null;
    posterUrl: string | null;
    genres?: GenreData[];
    seasons?: SeasonData[];
};

//video urls are not included, only the playback endpoint returns them
export class TitleResponseDto {
    private constructor(
        public readonly id: number,
        public readonly type: string,
        public readonly title: string,
        public readonly synopsis: string | null,
        public readonly releaseYear: number | null,
        public readonly ageRating: string | null,
        public readonly durationMin: number | null,
        public readonly posterUrl: string | null,
        public readonly genres: GenreData[],
        public readonly seasons: SeasonData[] | undefined,
    ) {}

    public static create(title: TitleData): TitleResponseDto {
        const genres = (title.genres ?? []).map((genre) => ({ id: genre.id, name: genre.name }));
        const seasons = title.seasons?.map((season) => ({
            id: season.id,
            number: season.number,
            episodes: (season.episodes ?? []).map((episode) => ({
                id: episode.id,
                number: episode.number,
                name: episode.name,
                durationMin: episode.durationMin,
            })),
        }));

        return new TitleResponseDto(
            title.id,
            title.type,
            title.title,
            title.synopsis,
            title.releaseYear,
            title.ageRating,
            title.durationMin,
            title.posterUrl,
            genres,
            seasons,
        );
    }
}
