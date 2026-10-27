import { User } from "../models/index.ts";
import { UserResponseDto } from "../dtos/users/UserResponseDto.ts";
import { HttpError } from "../errors/HttpError.ts";

export class UserService {
    public async getById(id: number): Promise<UserResponseDto> {
        const user = await User.findOne({ where: { id, isActive: true } });
        if (!user) {
            throw new HttpError(404, "user not found");
        }
        return UserResponseDto.create(user);
    }

    public async list(): Promise<UserResponseDto[]> {
        const users = await User.findAll({ order: [["id", "ASC"]] });
        return users.map((user) => UserResponseDto.create(user));
    }
}
