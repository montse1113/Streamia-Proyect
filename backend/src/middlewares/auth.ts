import type { Request, Response, NextFunction } from "express";
import type { TokenAdapter, TokenPayload } from "../adapters/jwt.adapter.ts";
import { HttpError } from "../errors/HttpError.ts";

// checks the Bearer token and saves the user in res.locals.user
export const authenticate = (tokenAdapter: TokenAdapter) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const header = req.headers.authorization;
        if (!header?.startsWith("Bearer ")) {
            throw new HttpError(401, "token is required");
        }

        try {
            res.locals.user = await tokenAdapter.verify(header.slice(7));
        } catch {
            throw new HttpError(401, "invalid or expired token");
        }
        next();
    };
};

// must go after authenticate
export const authorize = (...roles: TokenPayload["role"][]) => {
    return (_req: Request, res: Response, next: NextFunction) => {
        const user = res.locals.user as TokenPayload;
        if (!roles.includes(user.role)) {
            throw new HttpError(403, "you do not have permission to do this");
        }
        next();
    };
};
