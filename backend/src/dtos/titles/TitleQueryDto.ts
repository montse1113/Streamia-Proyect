const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 15;

type TitleType = "movie" | "series";

// filters and pagination for GET /titles (values already validated)
export class TitleQueryDto {
    private constructor(
        public readonly page: number,
        public readonly limit: number,
        public readonly type: TitleType | undefined,
        public readonly genreId: number | undefined,
    ) {}

    public static create(query: Record<string, unknown>): TitleQueryDto {
        return new TitleQueryDto(
            Number(query.page ?? DEFAULT_PAGE),
            Number(query.limit ?? DEFAULT_LIMIT),
            query.type as TitleType | undefined,
            query.genreId === undefined ? undefined : Number(query.genreId),
        );
    }
}
