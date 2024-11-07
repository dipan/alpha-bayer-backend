import { body } from "express-validator";

export const userValidator = [
  body("email")
    .isString()
    .withMessage("Email must be a string")
    .isEmail()
    .withMessage("Emai must valid"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 6 characters long"),
];
