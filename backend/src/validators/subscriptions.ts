import { body } from "express-validator";

// only the plan id comes from the client, the price is read from the database
export const checkoutValidator = [
    body("planId").isInt({ min: 1 }).withMessage("Please choose a valid plan.").toInt(),
];
