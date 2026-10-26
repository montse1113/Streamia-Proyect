import { body } from "express-validator";

export const registerValidator = [
  body("name").trim().notEmpty().withMessage("name is required").isLength({ max: 80 }),
  body("lastName").trim().notEmpty().withMessage("last name is required").isLength({ max: 80 }),
  body("email").trim().isEmail().withMessage("invalid email").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("password must have at least 8 characters")
    .matches(/\d/)
    .withMessage("password must contain a number"),
];
