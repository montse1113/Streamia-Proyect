import jwt, { type SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

type ExpiresIn = NonNullable<SignOptions["expiresIn"]>;

export type TokenPayload = {
    id: number;
    role: "admin" | "customer";
};

// contract used by services and middlewares, so the JWT library can be changed
export interface TokenAdapter {
    sign(payload: TokenPayload): Promise<string>;
    verify(token: string): Promise<TokenPayload>;
}

export class JwtAdapter implements TokenAdapter {
    private readonly secret: string;
    private readonly expiresIn: ExpiresIn;

    constructor() {
        const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        this.secret = JWT_SECRET;
        this.expiresIn = (JWT_EXPIRES_IN ?? "1h") as ExpiresIn;
    }

    public async sign(payload: TokenPayload): Promise<string> {
        return jwt.sign({ role: payload.role }, this.secret, {
            subject: String(payload.id),
            expiresIn: this.expiresIn,
            algorithm: "HS256",
        });
    }

    // throws if the signature is wrong or the token expired
    public async verify(token: string): Promise<TokenPayload> {
        const decoded = jwt.verify(token, this.secret, { algorithms: ["HS256"] }) as jwt.JwtPayload;
        return { id: Number(decoded.sub), role: decoded.role };
    }
}
