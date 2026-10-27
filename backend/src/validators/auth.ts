import { body } from "express-validator";

export const registerValidator = [
  body("name").trim().notEmpty().withMessage("name is required").isLength({ max: 80 }),
  body("lastName").trim().notEmpty().withMessage("last name is required").isLength({ max: 80 }),
    body("email")
    .trim()
    .isLength({ max: 255 })
    .withMessage("email is too long")
    .isEmail()
    .withMessage("invalid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8, max: 72 })
    .withMessage("password must have between 8 and 72 characters")
    .matches(/\d/)
    .withMessage("password must contain a number"),
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("invalid email").normalizeEmail(),
  body("password").notEmpty().withMessage("password is required"),
];
