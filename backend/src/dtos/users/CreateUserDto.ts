export class CreateUserDto {
  private constructor(
    public readonly name: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly password: string,
  ) {}

  // the body was already checked by registerValidator
  public static create(body: Record<string, unknown>): CreateUserDto {
    return new CreateUserDto(
      String(body.name),
      String(body.lastName),
      String(body.email),
      String(body.password),
    );
  }
}
