import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.ts";
import { CreateUserDto } from "../dtos/users/CreateUserDto.ts";
import { LoginUserDto } from "../dtos/users/LoginUserDto.ts";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public register = async (req: Request, res: Response) => {
    const dto = CreateUserDto.create(req.body);
    const user = await this.authService.register(dto);
    res.status(201).json({ message: "user created", user });
  };

  public login = async (req: Request, res: Response) => {
    const dto = LoginUserDto.create(req.body);
    const result = await this.authService.login(dto);
    res.json(result);
  };
}
