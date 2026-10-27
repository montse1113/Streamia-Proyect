import { Genre } from "../models/index.ts";

export class GenreService {
    public async list() {
        const genres = await Genre.findAll({ order: [["name", "ASC"]] });
        return genres.map((genre) => ({ id: genre.id, name: genre.name }));
    }
}
