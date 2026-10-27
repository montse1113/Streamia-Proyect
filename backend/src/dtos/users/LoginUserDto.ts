export class LoginUserDto {
  private constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}

  // the body was already checked by loginValidator
  public static create(body: Record<string, unknown>): LoginUserDto {
    return new LoginUserDto(String(body.email), String(body.password));
  }
}
