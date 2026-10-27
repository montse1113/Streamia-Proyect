import { param, query } from "express-validator";

const MAX_LIMIT = 50;

export const listTitlesValidator = [
    query("page").optional().isInt({ min: 1 }).withMessage("page must be an integer greater than 0").toInt(),
    query("limit")
        .optional()
        .isInt({ min: 1, max: MAX_LIMIT })
        .withMessage(`limit must be between 1 and ${MAX_LIMIT}`)
        .toInt(),
    query("type").optional().isIn(["movie", "series"]).withMessage("type must be movie or series"),
    query("genreId").optional().isInt({ min: 1 }).withMessage("genreId must be an integer greater than 0").toInt(),
];

export const titleIdValidator = [
    param("id").isInt({ min: 1 }).withMessage("id must be an integer greater than 0").toInt(),
];
