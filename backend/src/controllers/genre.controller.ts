import type { Request, Response } from "express";
import { GenreService } from "../services/genre.service.ts";

export class GenreController {
    constructor(private readonly genreService: GenreService) {}

    public list = async (_req: Request, res: Response) => {
        const genres = await this.genreService.list();
        res.json({ data: genres });
    };
}
