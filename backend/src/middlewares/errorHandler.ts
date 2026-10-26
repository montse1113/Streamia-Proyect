import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/HttpError.ts";

//must be the last middleware
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if(err instanceof HttpError){
        return res.status(err.status).json({ message: err.message });
    }
    console.log(err);
    res.status(500).json({ message: "internal server error" });
};