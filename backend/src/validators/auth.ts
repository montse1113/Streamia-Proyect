import { body } from "express-validator";

export const registerValidator = [
  body("name").trim().notEmpty().withMessage("Please enter your name.").isLength({ max: 80 }).withMessage("Your name can have up to 80 characters."),
  body("lastName").trim().notEmpty().withMessage("Please enter your last name.").isLength({ max: 80 }).withMessage("Your last name can have up to 80 characters."),
  body("email")
    .trim()
    .isLength({ max: 255 })
    .withMessage("The email can have up to 255 characters.")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8, max: 72 })
    .withMessage("The password must have between 8 and 72 characters.")
    .matches(/\d/)
    .withMessage("The password must include at least one number."),
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("Please enter a valid email.").normalizeEmail(),
  body("password").notEmpty().withMessage("Please enter your password."),
];
