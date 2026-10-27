import { Title, Genre, TitleGenre, Season, Episode } from "../models/index.ts";
import type { TitleQueryDto } from "../dtos/titles/TitleQueryDto.ts";
import { TitleResponseDto } from "../dtos/titles/TitleResponseDto.ts";
import { HttpError } from "../errors/HttpError.ts";

const genresInclude = { model: Genre, as: "genres", through: { attributes: [] } };

export class TitleService {
    public async list(query: TitleQueryDto) {
        const titleIds = query.genreId ? await this.findTitleIdsByGenre(query.genreId) : undefined;

        const { rows, count } = await Title.findAndCountAll({
            where: {
                isActive: true,
                ...(query.type && { type: query.type }),
                ...(titleIds && { id: titleIds }),
            },
            include: [genresInclude],
            order: [["id", "ASC"]],
            limit: query.limit,
            offset: (query.page - 1) * query.limit,
            distinct: true,
        });

        return {
            data: rows.map((title) => TitleResponseDto.create(title)),
            meta: {
                page: query.page,
                limit: query.limit,
                total: count,
                totalPages: Math.ceil(count / query.limit),
            },
        };
    }

    public async getById(id: number): Promise<TitleResponseDto> {
        const title = await Title.findOne({
            where: { id, isActive: true },
            include: [
                genresInclude,
                { model: Season, as: "seasons", include: [{ model: Episode, as: "episodes" }] },
            ],
            order: [
                [{ model: Season, as: "seasons" }, "number", "ASC"],
                [{ model: Season, as: "seasons" }, { model: Episode, as: "episodes" }, "number", "ASC"],
            ],
        });
        if (!title) {
            throw new HttpError(404, "title not found");
        }

        return TitleResponseDto.create(title);
    }

    private async findTitleIdsByGenre(genreId: number): Promise<number[]> {
        const rows = await TitleGenre.findAll({ where: { genreId }, attributes: ["titleId"] });
        return rows.map((row) => row.titleId);
    }
}
