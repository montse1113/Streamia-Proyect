import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/HttpError.ts";

//must be the last middleware
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError) {
        return res.status(err.status).json({ message: err.message });
    }
    // express.json() throws this when the body is not valid JSON
    if ((err as { type?: string }).type === "entity.parse.failed") {
        return res.status(400).json({ message: "invalid JSON body" });
    }
    // only the message, the full error can include the request body (passwords)
    console.log(err instanceof Error ? err.message : err);
    res.status(500).json({ message: "internal server error" });
};
