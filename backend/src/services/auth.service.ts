import bcrypt from "bcryptjs";
import { User } from "../models/index.ts";
import type { CreateUserDto } from "../dtos/users/CreateUserDto.ts";
import { UserResponseDto } from "../dtos/users/UserResponseDto.ts";
import { HttpError } from "../errors/HttpError.ts";

const SALT_ROUNDS = 10;

export class AuthService {
  public async register(dto: CreateUserDto): Promise<UserResponseDto> {
    const exists = await User.findOne({ where: { email: dto.email } });
    if (exists) {
      throw new HttpError(409, "email is already registered");
    }

    const hash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    // role is not taken from the request, new users are always customers
    const user = await User.create({
      name: dto.name,
      lastName: dto.lastName,
      email: dto.email,
      password: hash,
    });

    return UserResponseDto.create(user);
  }
}
