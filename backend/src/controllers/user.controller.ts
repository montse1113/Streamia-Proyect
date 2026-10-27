import type { Request, Response } from "express";
import { UserService } from "../services/user.service.ts";
import type { TokenPayload } from "../adapters/jwt.adapter.ts";

export class UserController {
    constructor(private readonly userService: UserService) {}

    // the id always comes from the token, never from the url or the body
    public me = async (_req: Request, res: Response) => {
        const { id } = res.locals.user as TokenPayload;
        const user = await this.userService.getById(id);
        res.json({ data: user });
    };

    public list = async (_req: Request, res: Response) => {
        const users = await this.userService.list();
        res.json({ data: users });
    };
}
