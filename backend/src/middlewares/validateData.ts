import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";


//returns the invalid fields withouth echoing the values (e.g passwords)
export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const fields = errors.array().map((error) => ({
            field: error.type === "field" ? error.path: null,
            message: error.msg,
        }));
        return res.status(400).json({ errors: fields});
    }
    next();
};