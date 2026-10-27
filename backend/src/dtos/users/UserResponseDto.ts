type UserData = {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: string;
};

// never includes the password hash
export class UserResponseDto {
  private constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly role: string,
  ) {}

  public static create(user: UserData): UserResponseDto {
    return new UserResponseDto(user.id, user.name, user.lastName, user.email, user.role);
  }
}
