import type { Request, Response } from "express";
import { matchedData } from "express-validator";
import { TitleService } from "../services/title.service.ts";
import { TitleQueryDto } from "../dtos/titles/TitleQueryDto.ts";

export class TitleController {
    constructor(private readonly titleService: TitleService) {}

    public list = async (req: Request, res: Response) => {
        // matchedData returns the values already sanitized by the validator
        const query = TitleQueryDto.create(matchedData(req));
        const result = await this.titleService.list(query);
        res.json(result);
    };

    public getById = async (req: Request, res: Response) => {
        const { id } = matchedData(req);
        const title = await this.titleService.getById(Number(id));
        res.json({ data: title });
    };
}
