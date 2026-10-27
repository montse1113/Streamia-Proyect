import bcrypt from "bcryptjs";
import { User } from "../models/index.ts";
import type { CreateUserDto } from "../dtos/users/CreateUserDto.ts";
import type { LoginUserDto } from "../dtos/users/LoginUserDto.ts";
import { UserResponseDto } from "../dtos/users/UserResponseDto.ts";
import type { TokenAdapter } from "../adapters/jwt.adapter.ts";
import { HttpError } from "../errors/HttpError.ts";

const SALT_ROUNDS = 10;

export class AuthService {
  constructor(private readonly tokenAdapter: TokenAdapter) {}

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

  public async login(dto: LoginUserDto) {
    const user = await User.findOne({ where: { email: dto.email, isActive: true } });
    // same message for wrong email or wrong password, so emails can not be guessed
    const validPassword = user ? await bcrypt.compare(dto.password, user.password) : false;
    if (!user || !validPassword) {
      throw new HttpError(401, "invalid email or password");
    }

    const token = await this.tokenAdapter.sign({ id: user.id, role: user.role });
    return { token, user: UserResponseDto.create(user) };
  }
}
